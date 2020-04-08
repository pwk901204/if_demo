/* eslint-disable */
import Vue from 'vue'
import VueDraggableResizable from 'vue-draggable-resizable'
const cloneDeep = require('lodash.clonedeep')

Vue.component('vue-draggable-resizable', VueDraggableResizable)

export default {
  name: 'MTable',
  props: {
    columns: { type: Array, required: true },
    dataSource: { type: Array, required: true },
    pagination: { type: [Object, Boolean] },
    showRowSelection: { type: Boolean, default: false },
    bordered: { type: Boolean, default: true },
    rowKey: { type: String, default: 'id' },
    selectedRows: { type: Array }
  },
  data () {
    return {
      pagination2: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal (total) {
          return `总共${total}条数据`
        }
      },
      loading: false,
      columns2: [],
      dataSource2: [],
      selectedRowKeys: [],
      draggingState: {}
    }
  },
  computed: {
    rowSelection () {
      const { selectedRowKeys, showRowSelection } = this
      if (showRowSelection) {
        return {
          selectedRowKeys,
          onChange: this.onSelectChange
        }
      } else {
        return null
      }
    }
  },
  watch: {
    pagination: {
      handler: function (pagination) {
        if (typeof pagination === 'boolean') {
          this.pagination2 = false
        } else {
          const { total = 0, pageNo = 1, pageSize = 10 } = pagination
          this.pagination2 = { ...this.pagination2, total, pageSize, ...{ current: pageNo } }
        }
        this.handleDataSource(this.dataSource)
      },
      deep: true
    }
  },
  mounted () {
    this.loading = true
    setTimeout(() => {
      this.handleColumns(this.columns)
    }, 100)
  },

  methods: {
    // 表格列的配置
    handleColumns (columns = []) {
      let offsetWidth = this.$refs.colw.offsetWidth
      let counter = 0
      let list = []
      columns.forEach(col => {
        col = cloneDeep(col)

        if (col.dataIndex === '_index') {
          col.width = 80
          col.align = 'center'
          counter++
          offsetWidth -= 80
        } else {
          col.ellipsis = true
        }

        if ('width' in col && typeof col.width === 'string') {
          col.width = Number(col.width.replace('px', '').replace('%', ''))
          counter++
          offsetWidth -= col.width
        }
        list.push(col)
      })
      // 设置列平均值
      if (this.showRowSelection) {
        offsetWidth -= 60
      }
      const average = Math.floor(offsetWidth / (list.length - counter))
      list.forEach(col => {
        if (!col.width) {
          col.width = offsetWidth > average ? average : offsetWidth
          offsetWidth -= average
        }
        // if (index === list.length - 1) {
        //   col.width = undefined
        // }
        this.draggingState[col.key] = col.width
      })
      this.columns2 = list
    },

    // 数据数组
    handleDataSource (list = []) {
      const { pagination } = this
      let baseNum = 0
      if (typeof pagination !== 'boolean') {
        baseNum = (this.pagination2.current - 1) * this.pagination2.pageSize
      }
      for (let i = 0; i < list.length; i++) {
        list[i]._index = baseNum + i + 1
      }
      this.dataSource2 = list
      this.$nextTick(() => {
        this.loading = false
      })
    },

    // 处理分页、排序、筛选变化
    onChange (pagination, filters, sorter) {
      const pager = { ...this.pagination2 }
      const { current, pageSize } = pagination
      pager.current = current
      pager.pageSize = pageSize
      this.pagination2 = pager

      const { order, field } = sorter
      const _filters = {}
      Object.keys(filters).forEach(key => {
        _filters[key] = filters[key].join(',')
      })
      const params = {
        pageNo: current,
        pageSize,
        ..._filters
      }
      if (field) {
        params[field] = order === 'ascend' ? 'asc' : 'desc'
      }
      this.loading = true
      this.$emit('change', params)
    },

    // 选中项发生变化时
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit('rowSelection', selectedRows)
    }
  },
  render () {
    const { columns2, draggingState } = this
    const ResizeableTitle = ({ props, data, children }) => {
      let thDom = null
      const { key } = props
      const col = columns2.find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })
      if (col) {
        const index = columns2.findIndex(col => {
          const k = col.dataIndex || col.key
          return k === key
        })
        // console.log(index)
        if (!col.width || index === columns2.length - 1) {
          return <th {...data}>{children}</th>
        }
        const onDrag = (x, y) => {
          draggingState[key] = 0
          col.width = Math.max(x, 1)
        }

        const onDragstop = () => {
          if (thDom) {
            draggingState[key] = thDom.getBoundingClientRect().width
          }
        }

        return (
          <th
            {...data}
            v-ant-ref={r => (thDom = r)}
            width={col.width}
            class="resize-table-th"
          >
            {children}
            <vue-draggable-resizable
              key={col.key}
              class="table-draggable-handle"
              w={10}
              x={draggingState[key] || col.width}
              z={1}
              axis="x"
              draggable={true}
              resizable={false}
              onDragging={onDrag}
              onDragstop={onDragstop}
            />
          </th>
        )
      } else {
        return <th {...data}>{children}</th>
      }
    }

    const components = {
      header: {
        cell: ResizeableTitle
      }
    }
    // console.log(this.columns2)
    // debugger
    return (this.columns2.length > 0 ? <a-table
      bordered={this.bordered}
      rowKey={this.rowKey}
      pagination={this.pagination2}
      columns={this.columns2}
      dataSource={this.dataSource2}
      components={components}
      rowSelection={this.rowSelection}
      loading={this.loading}
      onChange={this.onChange}
    /> : <div ref="colw"></div>)
  }
}
