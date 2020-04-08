<template>
  <div ref="table"
       class="standard-table">
    <a-table :bordered="bordered"
             :columns="COLUMNS"
             :dataSource="dataSource"
             :rowKey="rowKey"
             :pagination="PAGINATION"
             :rowSelection="rowSelection"
             @change="handleTableChange" />
  </div>
</template>

<script>
const cloneDeep = require('lodash.clonedeep')
export default {
  name: 'StandardTable',
  // props: ['bordered', 'loading', 'columns', 'dataSource', 'rowKey', 'pagination', 'selectedRows'],
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
          // console.log(selectedRowKeys)
          that.selectedRowKeys = selectedRowKeys
          // console.log(this.selectedRowKeys)
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
          // this.selectedRowKeys = []
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
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].dataIndex === '_index') {
            columns[i].customRender = (text, record, index) => {
              return index + 1
            }
            columns[i].width = 80
            columns[i].align = 'center'
            break
          }
        }
      } else {
        // 分页总条数
        const { total = 0, pageNum = 1, pageSize = 10 } = this.pagination
        this.PAGINATION = { ...this.PAGINATION, total, pageSize, ...{ current: pageNum } }

        // 序号
        for (let i = 0; i < columns.length; i++) {
          if (columns[i].dataIndex === '_index') {
            columns[i].customRender = (text, record, index) => {
              const { current, pageSize } = this.PAGINATION
              return (current - 1) * pageSize + index + 1
            }
            columns[i].width = 80
            columns[i].align = 'center'
            break
          }
        }
      }

      // console.log(document.querySelector('.standard-table').offsetWidth)

      // this.COLUMNS = columns
      this.handlerEll(columns)
      // console.log(this.columns)
    },
    // 处理表格长文字
    handlerEll (columns) {
      this.$nextTick(() => {
        const tw = this.$refs.table.offsetWidth
        let setWidth = 0
        let num = columns.length
        columns.forEach(item => {
          if ('width' in item) {
            num--
            let w = item.width
            if (typeof w === 'number') {
              setWidth += w
            } else if (typeof w === 'string') {
              if (w.indexOf('px') > 0) {
                setWidth += Number(w.replace('px', ''))
              } else if (w.indexOf('%') > 0) {
                setWidth += parseInt(tw * Number(w.replace('%', '')) / 100)
              }
            }
          }
        })
        const average = parseInt(tw - setWidth) / num
        columns.forEach(item => {
          if (!item.customRender) {
            item.customRender = (text) => {
              if (text === null || text === undefined) {
                return ''
              }
              const w = (item.width || average) - 32
              const double = parseInt((w / 14)) * 2
              return <div title={text}>{text.length > double ? text.substr(0, double - 2) + '...' : text}</div>
            }
          }
        })
        // console.log(columns)
        this.COLUMNS = columns
        // console.log(average)
      }, 100)
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
  }
}
</script>
