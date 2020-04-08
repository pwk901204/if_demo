<template>
  <div class="card page-project-list"
       id="projectProcess">
    <div class="page-search">
      <a-form class="form-inline"
              :form="searchForm"
              @submit="handleSearch">

        <a-form-item label="时间范围">
          <a-range-picker v-decorator="['project']" />
        </a-form-item>
        <a-form-item label="采购状态">
          <a-select :options="approvalStateDict"
                    v-decorator="['approvalState']"
                    placeholder="请选择" />
        </a-form-item>
        <a-form-item label="完成状态">
          <a-select v-decorator="['multiple']"
                    mode="multiple"
                    :options="approvalStateDict"
                    placeholder="多选" />
        </a-form-item>
        <a-form-item class="search-buttons">
          <a-button type="primary"
                    html-type="submit">查询</a-button>
          <a-button @click="handleReset">重置</a-button>
        </a-form-item>
      </a-form>
    </div>
    <!-- 表格 -->
    <standard-table :pagination="PAGINATION"
                    :columns="columns"
                    :bordered=true
                    :dataSource="dataSource"
                    @change="onChange" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import GlobalMixin from '@/mixins/global'
import { columns } from './cloumns.js'

export default {
  name: 'ProjectList',
  mixins: [GlobalMixin],
  data () {
    const columnsData = columns(this.$createElement)
    return {
      columns: columnsData,
      searchForm: this.$form.createForm(this),
      dataSource: [],
      serchParams: {}// 搜索条件
    }
  },
  computed: {
    ...mapState({
      approvalStateDict: state => state.dict.approvalState
    })
  },
  beforeMount () {
    // 获取字典项
    this.$store.dispatch('dict/fetchDict', 'approvalState')
    // 获取列表
    this.fetchList(this._getTableParams(this.searchForm))
  },

  methods: {
    // 获取列表
    fetchList () {
      this.serchParams = { ...this.serchParams, projectId: this.$PROJECTID }// this.$PROJECTID
      let url = 'mock/project.json?t=' + new Date().getTime()
      this.$axios.mock(url, this.serchParams).then(res => {
        this.dataSource = res.list || []
        // 处理分页情况
        const { pageNum, pageSize } = this.serchParams
        this.PAGINATION = {
          total: res.total || 0,
          pageNum,
          pageSize
        }
      })
    },
    // 搜索
    handleSearch (e) {
      e.preventDefault()
      this.serchParams = this._getTableParams(this.searchForm, { pageNum: 1 })
      this.fetchList()
    },
    // 切换数据
    onChange (changeParams) {
      this.serchParams = { ...this.serchParams, ...changeParams }
      this.fetchList()
    },
    // 删除
    onDelete (record) {
    },
    // 查看
    showModal (data, flag) { },
    // 重置
    handleReset () {
      this.searchForm.resetFields()
      this.serchParams = this._getTableParams(this.searchForm)
      this.fetchList()
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
