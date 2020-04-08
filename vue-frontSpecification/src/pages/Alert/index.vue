<template>
  <div class="page-form">
    <a-card title="1.顶部公告,页面顶部通告形式，默认有图标且type 为 'warning'">
      <div>
        <a-alert message="Warning text"
                 banner />
        <br />
        <a-alert message="Very long warning text warning text text text text text text text"
                 banner
                 closable />
        <br />
        <a-alert :showIcon="false"
                 message="Warning text without icon"
                 banner />
        <br />
        <a-alert type="error"
                 message="Error text"
                 banner />
      </div>
    </a-card>
    <a-card title="2.基本,最简单的用法，适用于简短的警告提示">
      <a-alert message="Success Text"
               type="success" />
    </a-card>
    <a-card title="3.可关闭的警告提示,显示关闭按钮，点击可关闭警告提示">
      <div>
        <a-alert message="Warning Text Warning Text Warning TextW arning Text Warning Text Warning TextWarning Text"
                 type="warning"
                 closable
                 @close="onClose" />
        <a-alert message="Error Text"
                 description="Error Description Error Description Error Description Error Description Error Description Error Description"
                 type="error"
                 closable
                 @close="onClose" />
      </div>
    </a-card>
    <a-card title="4.自定义关闭,可以自定义关闭，自定义的文字会替换原先的关闭 Icon">
      <a-alert message="Info Text"
               type="info"
               closeText="Close Now" />
    </a-card>
    <a-card title="5.含有辅助性文字介绍,含有辅助性文字介绍的警告提示">
      <div>
        <a-alert message="Success Text"
                 type="success">
          <p slot="description">
            Success Description <span style="color: red">Success</span> Description Success Description
          </p>
        </a-alert>
        <a-alert message="Info Text"
                 description="Info Description Info Description Info Description Info Description"
                 type="info" />
        <a-alert message="Warning Text"
                 description="Warning Description Warning Description Warning Description Warning Description"
                 type="warning" />
        <a-alert message="Error Text"
                 description="Error Description Error Description Error Description Error Description"
                 type="error" />
      </div>
    </a-card>
    <a-card title="6.图标,可口的图标让信息类型更加醒目">
      <div>
        <a-alert message="Success Tips"
                 type="success"
                 showIcon />
        <a-alert message="Informational Notes"
                 type="info"
                 showIcon />
        <a-alert message="Warning"
                 type="warning"
                 showIcon />
        <a-alert message="Error"
                 type="error"
                 showIcon />
        <a-alert message="Success Tips"
                 description="Detailed description and advices about successful copywriting."
                 type="success"
                 showIcon />
        <a-alert message="Informational Notes"
                 description="Additional description and informations about copywriting."
                 type="info"
                 showIcon />
        <a-alert message="Warning"
                 description="This is a warning notice about copywriting."
                 type="warning"
                 showIcon />
        <a-alert message="Error"
                 description="This is an error message about copywriting."
                 type="error"
                 showIcon />
      </div>
    </a-card>
    <a-card title="7.四种样式,共有四种样式 success、info、warning、error">
      <div>
        <a-alert message="Success Text"
                 type="success" />
        <a-alert message="Info Text"
                 type="info" />
        <a-alert message="Warning Text"
                 type="warning" />
        <a-alert message="Error Text"
                 type="error" />
      </div>
    </a-card>
    <a-card title="8.平滑地卸载,平滑、自然的卸载提示">
      <div>
        <a-alert v-if="visible"
                 message="Alert Message Text"
                 type="success"
                 closable
                 :afterClose="handleClose" />
      </div>
    </a-card>
    <a-card title="API">
      <a-table :columns="columns"
               :dataSource="data"
               :pagination="false"
               bordered></a-table>
    </a-card>
    <a-card title="事件">
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
      visible: true,
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
        title: '回调参数',
        dataIndex: 'callback'
      }],
      data: [{
        parameter: 'afterClose',
        intro: '关闭动画结束后触发的回调函数',
        type: '() => void',
        default: '-'
      }, {
        parameter: 'banner',
        intro: '是否用作顶部公告',
        type: 'boolean',
        default: 'false'
      }, {
        parameter: 'closable',
        intro: '默认不显示关闭按钮',
        type: 'boolean',
        default: '无'
      }, {
        parameter: 'closeText',
        intro: '自定义关闭按钮',
        type: 'string|slot',
        default: '无'
      }, {
        parameter: 'description',
        intro: '警告提示的辅助性文字介绍',
        type: 'string|slot',
        default: '无'
      }, {
        parameter: 'icon',
        intro: '自定义图标，showIcon 为 true 时有效',
        type: 'vnode | slot',
        default: '-'
      }, {
        parameter: 'message',
        intro: '警告提示内容',
        type: 'string|slot',
        default: '无'
      }, {
        parameter: 'showIcon',
        intro: '是否显示辅助图标',
        type: 'boolean',
        default: 'false，banner 模式下默认值为 true'
      }, {
        parameter: 'type',
        intro: '指定警告提示的样式，有四种选择 success、info、warning、error',
        type: 'string',
        default: 'info，banner 模式下默认值为 warning'
      }],
      dataEvent: [{
        parameter: 'close',
        intro: '菜单显示状态改变时调用，参数为 visible',
        callback: '(e: MouseEvent) => void'
      }]
    }
  },
  mounted () { },
  methods: {
    onClose (e) {
      console.log(e, 'I was closed.')
    },
    handleClose () {
      this.visible = false
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
