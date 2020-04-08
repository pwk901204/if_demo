<template>
  <div class="common-message">
    <a-tabs :defaultActiveKey="type" @change="changeTabs">
      <a-tab-pane :tab="notice" key="1"></a-tab-pane>
      <a-tab-pane :tab="info" key="2"></a-tab-pane>
      <a-tab-pane :tab="welldo" key="3"></a-tab-pane>
    </a-tabs>

    <m-table
      :pagination="PAGINATION"
      :columns="columns"
      :dataSource="dataSource"
      @change="onTableChange"
    />
  </div>
</template>
<script>
import toDetail from '@/mixins/toDetail' // 引入mixin文件
import { globalMixin } from '@/mixins/global'
export default {
  name: 'TutorialTable',
  mixins: [globalMixin, toDetail],
  data () {
    const columns = [
      { title: '序号', dataIndex: '_index' },
      {
        title: '内容',
        align: 'center',
        dataIndex: 'description',
        customRender: (text, record) => {
          var html = <a href="javascript:void(0)" class="ell" onclick={() => this.JumpToDetail(this.type, record)}>{text}</a>
          if (record.isreaded) {
            html = <a href="javascript:void(0)" class="ell hasRead" onclick={() => this.JumpToDetail(this.type, record)}>{text}</a>
          }
          return html
        }
      },
      { title: '时间', dataIndex: 'updatedAt', width: 300, align: 'center' }
    ]
    return {
      searchForm: this.$form.createForm(this),
      columns: columns,
      dataSource: [],
      notice: '通知（1）',
      info: '待办（2）',
      welldo: '已办（3）',
      type: ''
    }
  },
  beforeMount () {
    // 获取列表数据
    this.type = this.$route.query.type
    this.axiosGet(this._getTableParams())
  },
  methods: {
    async axiosGet (params) {
      params.type = this.type
      const res = await this.$axios.mock('/tutorial/list', params)
      // this.notice = '通知（' + res.num1 + ')'
      // this.info = '待办(' + res.num2 + ')'
      // this.welldo = '已办（' + res.num3 + ')'
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
    // 头部类型改变
    changeTabs (key) {
      console.log(key)
      this.type = key
      this.axiosGet(this._getTableParams()) // 重新获取列表值
    }
  }
}
</script>
<style>
.hasRead {
  color: #666;
}
</style>
