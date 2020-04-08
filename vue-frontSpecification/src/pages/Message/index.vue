<template>
  <div class="page-form">
    <a-card title="1.普通提示,信息提醒反馈">
      <a-button type="primary"
                @click="info1">Display normal message</a-button>
    </a-card>
    <a-card title="2.修改延时,自定义时长 10s，默认时长为 3s">
      <a-button @click="success1">Customized display duration</a-button>
    </a-card>
    <a-card title="3.加载中,进行全局 loading，异步自行移除">
      <a-button @click="success2">Display a loading indicator</a-button>
    </a-card>
    <a-card title="4.其他提示类型,包括成功、失败、警告">
      <div>
        <a-button @click="success3">Success</a-button>
        <a-button @click="error3">Error</a-button>
        <a-button @click="warning3">Warning</a-button>
      </div>
    </a-card>
    <a-card title="5.Promise 接口,可以通过 then 接口在关闭后运行 callback 。以上用例将在每个 message 将要结束时通过 then 显示新的 message">
      <a-button @click="success4">Display a sequence of message</a-button>
    </a-card>
    <a-card title="API">
      <a-table :columns="columns"
               :dataSource="data"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="全局方法">
      <a-table :columns="columnsEvent"
               :dataSource="dataEvent"
               :pagination="false"
               bordered></a-table>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
export default {
  name: 'DemoDropdown', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      columns: [{
        title: '参数',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '类型',
        dataIndex: 'type'
      },
      {
        title: '默认值',
        dataIndex: 'default'
      }],
      columnsEvent: [{
        title: '事件名称',
        dataIndex: 'parameter'
      },
      {
        title: '说明',
        dataIndex: 'intro'
      },
      {
        title: '类型',
        dataIndex: 'type'
      },
      {
        title: '默认值',
        dataIndex: 'default'
      }],
      data: [{
        parameter: 'content',
        intro: '提示内容',
        type: 'string| VNode |(h) => VNode',
        default: '-'
      }, {
        parameter: 'duration',
        intro: '自动关闭的延时，单位秒。设为 0 时不自动关闭',
        type: 'number',
        default: '3'
      }, {
        parameter: 'onClose',
        intro: '关闭时触发的回调函数',
        type: 'Function',
        default: '-'
      }, {
        parameter: 'icon',
        intro: '自定义图标',
        type: 'string| VNode |(h) => VNode',
        default: '-'
      }],
      dataEvent: [{
        parameter: 'duration',
        intro: '默认自动关闭延时，单位秒',
        type: 'number',
        default: '3'
      }, {
        parameter: 'getContainer',
        intro: '配置渲染节点的输出位置',
        type: '() => HTMLElement',
        default: '() => document.body'
      }, {
        parameter: 'maxCount',
        intro: '最大显示数, 超过限制时，最早的消息会被自动关闭',
        type: 'number',
        default: '-'
      }, {
        parameter: 'top',
        intro: '消息距离顶部的位置',
        type: 'string',
        default: '24px'
      }]
    }
  },
  mounted () { },
  methods: {
    info1 () {
      this.$message.info('This is a normal message')
    },
    success1 () {
      this.$message.success(
        'This is a prompt message for success, and it will disappear in 10 seconds',
        10
      )
    },
    success2 () {
      const hide = this.$message.loading('Action in progress..', 0)
      setTimeout(hide, 2500)
    },
    success3 () {
      this.$message.success('This is a message of success')
    },
    error3 () {
      this.$message.error('This is a message of error')
    },
    warning3 () {
      this.$message.warning('This is message of warning')
    },
    success4 () {
      this.$message
        .loading('Action in progress..', 2.5)
        .then(() => this.$message.success('Loading finished', 2.5))
        .then(() => this.$message.info('Loading finished is finished', 2.5))
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
