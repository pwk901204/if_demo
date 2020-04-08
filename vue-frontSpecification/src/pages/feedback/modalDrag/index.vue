<template>
  <div class="model">
    <a-card title="可拖拽对话框示例">
      <a-button
        type="primary"
        @click="showModal"
      >可拖拽对话框</a-button>
      <modal
        :zIndex="100"
        title="简单的可拖拽弹窗"
        :visible="visible"
        :width="500"
        @ok="handleOk"
        @cancel="handleOk"
      >
        <p>Hi,第一个简单的可拖拽对话框</p>
      </modal>
    </a-card>
    <div class="info">
      <h2>使用说明：</h2>
      <p>这里的可拖拽弹窗是基于antd的弹窗改良优化的，其中使用方法和官方示例的使用方法保持一致（部分参数还没加入，项目中可自行在组件内增加），具体步骤如下：</p>
      <p>1、在页面里面引入二次封装的modelDrag.js，并调用；</p>
      <p>2、将原有的antd的弹窗替换成封装后的弹窗（a-modal => modal）；</p>
      <p>注意：<br>多次弹窗的层级，z-index必要时需要设置；<br>自定义底部按钮仍在优化中...</p>
    </div>
  </div>
</template>
<script>
import Modal from '@/components/modalDrag/Modaldrag'
export default {
  components: { Modal },
  data () {
    return {
      visible: false,
      modal1Visible: false
    }
  },
  methods: {
    showModal () {
      this.visible = true
    },
    handleOk (e) {
      console.log(e)
      this.visible = false
    }
  }
}

</script>
<style scoped>
.model {
  padding: 10px;
  background: #fff;
}

.ant-table-body {
  width: 100%;
}

.ant-btn {
  margin: 10px 15px;
}

.model .ant-card {
  margin-bottom: 10px;
}

.info {
  margin-top: 20px;
}
</style>
