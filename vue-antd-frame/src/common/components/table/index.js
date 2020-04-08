import Vue from 'vue'
const cloneDeep = require('lodash.clonedeep')
export default {
  name: 'StandardTable',
  props: {
    columns: {
      type: Array,
      required: true
    },
    dataSource: {
      type: Array,
      required: true
    },
    pagination: {
      type: [Object, Boolean]
    },
    showRowSelection: {
      type: Boolean,
      default: false
    },
    bordered: {
      type: Boolean
    },
    rowKey: {
      type: String,
      default: 'id'
    },
    selectedRows: {
      type: Array
    }
  },
  data () {
    const draggingMap = {}
    this.columns.forEach(col => {
      console.log(col)
      draggingMap[col.key] = col.width
    })
    const draggingState = Vue.observable(draggingMap)
    const ResizeableTitle = (h, props, children) => {
      let thDom = null
      const { key, ...restProps } = props
      const col = this.columns.find(col => {
        const k = col.dataIndex || col.key
        return k === key
      })
      if (!col.width) {
        return <th {...restProps}>{children}</th>
      }
      const onDrag = (x, y) => {
        draggingState[key] = 0
        col.width = Math.max(x, 1)
      }

      const onDragstop = () => {
        draggingState[key] = thDom.getBoundingClientRect().width
      }
      return (
        <th {...restProps} v-ant-ref={r => (thDom = r)} width={col.width} class="resize-table-th">
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
          ></vue-draggable-resizable>
        </th>
      )
    }
    console.log(ResizeableTitle)
    // ResizeableTitle().bind(this.$createElement)
    this.components = {
      header: {
        cell: ResizeableTitle
      }
    }
    return {
      PAGINATION: {
        total: 0,
        current: 1,
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal (total) {
          return `总共${total}条数据`
        }
      },
      COLUMNS: [], // 列表项是否可选择
      selectedRowKeys: []
    }
  },
  computed: {
    rowSelection () {
      let that = this
      return this.showRowSelection ? {
        selectedRowKeys: this.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          that.selectedRowKeys = selectedRowKeys
          that.$emit('rowChange', selectedRows)
        }
      } : null
    }
  },
  watch: {
    pagination: {
      handler () {
        if (typeof this.pagination === 'boolean') {
          this.PAGINATION = false
        } else {
          const { total = 0, pageNum = 1, pageSize = 10 } = this.pagination
          this.PAGINATION = { ...this.PAGINATION, total, pageSize, ...{ current: pageNum } }
        }
      },
      deep: true
    }
  },
  mounted () {
    // 初始化表格
    this.initTable()
  },
  methods: {
    // 初始化表格
    initTable () {
      let columns = cloneDeep(this.columns)
      // 列表不分页
      if (typeof this.pagination === 'boolean') {
        this.PAGINATION = false
        // 序号
        columns.map(i => {
          if (i.dataIndex === '_index') {
            i.customRender = (text, record, index) => {
              return index + 1
            }
            i.width = 80
            i.align = 'center'
          }
        })
      } else {
        // 分页总条数
        const { total = 0, pageNum = 1, pageSize = 10 } = this.pagination
        this.PAGINATION = { ...this.PAGINATION, total, pageSize, ...{ current: pageNum } }
        // 序号
        columns.map(i => {
          if (i.dataIndex === '_index') {
            i.customRender = (text, record, index) => {
              const { current, pageSize } = this.PAGINATION
              return (current - 1) * pageSize + index + 1
            }
            i.width = 80
            i.align = 'center'
          }
        })
      }
      this.handlerEll(columns)
    },
    // 处理表格长文字
    handlerEll (columns) {
      this.$nextTick(() => {
        columns.forEach(item => {
          if (!item.customRender && !item.tooltip) {
            item.customRender = (text) => {
              if (text === null || text === undefined) {
                return ''
              }
              return <a-tooltip placement="topLeft" title={text}><div class="ell">{text}</div></a-tooltip>
            }
          }
        })
        this.COLUMNS = columns
      })
    },
    // 处理分页、排序、筛选变化
    handleTableChange (pagination, filters, sorter) {
      // debugger
      const pager = { ...this.PAGINATION }
      const { current, pageSize } = pagination
      pager.current = current
      pager.pageSize = pageSize
      this.PAGINATION = pager

      const { order, field } = sorter
      let _filters = {}
      Object.keys(filters).forEach(key => {
        _filters[key] = filters[key].join(',')
      })
      let params = {
        pageNum: current,
        pageSize,
        ..._filters
      }
      if (field) {
        params[field] = order === 'ascend' ? 'asc' : 'desc'
      }
      this.$emit('change', params)
    }
  },
  render () {
    console.log(this.components)
    return (
      <div ref="table"
        class="standard-table"
        id="tableCommon">
        <a-table bordered={this.bordered}
          columns={this.COLUMNS}
          dataSource={this.dataSource}
          rowKey={this.rowKey}
          components={this.components}
          pagination={this.PAGINATION}
          rowSelection={this.rowSelection}
          onchange={this.handleTableChange.bind(this)} />
      </div>)
  }
}
