<template>
  <div class="tutorial-table">
    <div class="page-search">
      <a-form class="m-form-inline max-label-7" :form="searchForm">
        <a-form-item label="规则编号">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="描述">
          <a-input placeholder="请输入" />
        </a-form-item>
        <a-form-item label="服务调用次数">
          <a-input placeholder="请输入" />
        </a-form-item>
        <template v-if="ADVANCED">
          <a-form-item label="状态状态状">
            <a-input placeholder="请输入" />
          </a-form-item>
          <a-form-item label="更新时间新时间">
            <a-input placeholder="请输入" />
          </a-form-item>
        </template>
        <query-button :form="searchForm" @search="onSearch" @toggle="()=>ADVANCED=!ADVANCED" />
      </a-form>
    </div>

    <m-table
      showRowSelection
      :pagination="PAGINATION"
      :columns="columns"
      :dataSource="dataSource"
      :selectedRows="selectedRows"
      @rowSelection="onRowSelection"
      @change="onTableChange"
    />
  </div>
</template>
<script>
import { globalMixin } from '@/mixins/global'

const statusMap = {
  0: { status: 'default', text: '关闭' },
  1: { status: 'processing', text: '运行中' },
  2: { status: 'success', text: '已上线' },
  3: { status: 'error', text: '异常' }
}

export default {
  name: 'TutorialTable',
  mixins: [globalMixin],
  data () {
    const columns = [
      { title: '#', dataIndex: '_index' },
      { title: '规则编号', dataIndex: 'no' },
      { title: '描述', dataIndex: 'description' },
      {
        title: '服务调用次数',
        dataIndex: 'callNo',
        sorter: true,
        needTotal: true,
        customRender: (text) => text + ' 次'
      },
      {
        title: '状态',
        dataIndex: 'status',
        customRender: (text) => <a-badge status={statusMap[text].status} text={statusMap[text].text} />
      },
      { title: '更新时间', dataIndex: 'updatedAt', sorter: true },
      {
        title: '操作',
        dataIndex: 'action',
        width: '150px',
        scopedSlots: { customRender: 'action' }
      }
    ]
    return {
      searchForm: this.$form.createForm(this),
      columns: columns,
      dataSource: [],
      selectedRows: []
    }
  },
  beforeMount () {
    // 获取列表数据
    this.axiosGet(this._getTableParams())
  },
  methods: {
    async axiosGet (params) {
      const res = await this.$axios.mock('/tutorial/list', params)
      this.dataSource = Object.freeze(res.rows)
      // 处理分页情况
      const { pageNo = 1, pageSize = 10 } = params
      this.PAGINATION = {
        total: res.total || 0,
        pageNo,
        pageSize
      }
    },
    // search
    onSearch () {

    },
    // pagination, filters or sorter changed
    onTableChange (changeParams) {
      this.axiosGet(this._getTableParams(changeParams))
    },
    // row selection
    onRowSelection (selectedRows) {
      this.selectedRows = selectedRows
    }
  }
}
</script>
