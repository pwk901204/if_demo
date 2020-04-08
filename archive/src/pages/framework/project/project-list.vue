<template>
  <div class="framework-project-list">
    <div class="page-search">
      <a-form class="m-form-inline">
        <a-form-item label="立项状态">
          <!-- 切换项目 -->
          <a-select
            :options="projectDict"
            v-model="porjectVal"
            placeholder="请选择"
            @change="onProjectChange"
          />
        </a-form-item>
      </a-form>
    </div>
    <m-table rowKey="path" :columns="columns" :dataSource="dataSource" />
  </div>
</template>
<script>
// 框架模块
const framework = require('@/core/framework.json')
export default {
  name: 'FrameworkProjectList', // 项目管理列表
  data () {
    const columns = [
      {
        title: '页面',
        dataIndex: 'meta',
        customRender: (text, record, index) => {
          let name = record.name
          if (text && text.title) {
            name = text.title
          }
          return name
        }
      },
      {
        title: '访问路径',
        dataIndex: 'path',
        customRender: (text, record) => `/${this.porjectVal}${text}`
      },
      { title: '页面地址', dataIndex: 'component' }
      // {
      //   title: '操作',
      //   width: '150px',
      //   dataIndex: 'action',
      //   scopedSlots: { customRender: 'action' }
      // }
    ]
    return {
      columns: Object.freeze(columns),
      dataSource: [],
      projectDict: [],
      porjectVal: ''
    }
  },
  mounted () {
    this.axiosProjectGet()
  },
  methods: {
    // 切换项目
    onProjectChange (val) {
      this.dataSource = Object.freeze(framework.data[val].routers)
    },

    axiosProjectGet () {
      const data = framework.data
      const projectDict = []
      for (const key in data) {
        projectDict.push({ value: key, label: data[key].name, title: data[key].name })
      }

      this.projectDict = Object.freeze(projectDict)

      const first = projectDict[0].value
      this.porjectVal = first
      this.dataSource = Object.freeze(framework.data[first].routers)
    }
  }
}
</script>
