<template>
  <a-table
    :bordered="bordered"
    :columns="columns2"
    :dataSource="dataSource"
    :rowKey="rowKey"
    :pagination="pagination2"
    :rowSelection="rowSelection"
    @change="handleTableChange"
  />
</template>

<script>
const cloneDeep = require('lodash.clonedeep')
export default {
  name: 'MTable',
  props: {
    columns: { type: Array, required: true },
    dataSource: { type: Array, required: true },
    pagination: { type: [Object, Boolean] },
    showRowSelection: { type: Boolean, default: false },
    bordered: { type: Boolean },
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
      columns2: [], // 列表项是否可选择
      selectedRowKeys: []
    }
  },
  watch: {
    pagination: {
      handler () {
        if (typeof this.pagination === 'boolean') {
          this.pagination2 = false
        } else {
          const { total = 0, pageNo = 1, pageSize = 10 } = this.pagination
          this.pagination2 = { ...this.pagination2, total, pageSize, ...{ current: pageNo } }
        }
      },
      deep: true
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
  beforeMount () {
    this.initTable()
  },
  methods: {
    // 初始化表格
    initTable () {
      const columns = cloneDeep(this.columns)
      const found = columns.find(item => item.dataIndex === '_index')
      if (found) {
        found.width = 80
        found.align = 'center'
      }
      // 列表不分页
      if (typeof this.pagination === 'boolean') {
        this.pagination2 = false
        // 序号
        if (found) {
          found.customRender = (text, record, index) => index + 1
        }
      } else {
        // 分页总条数
        const { total = 0, pageNo = 1, pageSize = 10 } = this.pagination
        this.pagination2 = { ...this.pagination2, total, pageSize, ...{ current: pageNo } }
        // 序号
        if (found) {
          found.customRender = (text, record, index) => {
            const { current, pageSize } = this.pagination2
            return (current - 1) * pageSize + index + 1
          }
        }
      }
      this.handlerEll(columns)
    },
    // 处理表格长文字
    handlerEll (columns) {
      columns.forEach(item => {
        if (!item.customRender && !item.tooltip) {
          item.customRender = (text) => {
            if (text === null || text === undefined) {
              return ''
            }
            return <a-tooltip title={text}><div class="ell">{text}</div></a-tooltip>
          }
        }
      })
      this.columns2 = columns
    },
    // 处理分页、排序、筛选变化
    handleTableChange (pagination, filters, sorter) {
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
      this.$emit('change', params)
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.$emit('rowSelection', selectedRows)
    }
  }
}
</script>
