<template>
  <div class="model">
    <a-card title="对话框示例">
      <a-button type="primary"
                @click="showModal">对话框</a-button>
      <a-modal title="Basic Modal"
               v-model="visible"
               @ok="handleOk">
        <p>Hi,第一个简单的对话框</p>
      </a-modal>
      <a-button @click="showConfirm">
        延迟关闭
      </a-button>
      <a-button @click="showConfirm1">
        确定对话框
      </a-button>
      <a-button @click="showDeleteConfirm"
                type="dashed">
        删除对话框
      </a-button>
      <a-button @click="showPropsConfirm"
                type="dashed">
        禁用对话框按钮
      </a-button>
      <a-button @click="info">单个按钮</a-button>
      <a-button @click="countDown">手动更新对话框内容和关闭对话框</a-button>
      <a-button type="primary"
                @click="() => setModal1Visible(true)">自定义位置</a-button>
      <a-modal title="20px to Top"
               style="top: 20px;"
               :visible="modal1Visible"
               @ok="() => setModal1Visible(false)"
               @cancel="() => setModal1Visible(false)">
        <p>some contents...</p>
        <p>some contents...</p>
        <p>some contents...</p>
      </a-modal>
    </a-card>
    <a-card title="api">
      <table class="ant-table-body">
        <thead class="ant-table-thead">
          <tr>
            <th>参数</th>
            <th>说明</th>
            <th>类型</th>
            <th>默认值</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <tr>
            <td>afterClose</td>
            <td>Modal 完全关闭后的回调</td>
            <td>function</td>
            <td>无</td>
          </tr>
          <tr>
            <td>bodyStyle</td>
            <td>Modal body 样式</td>
            <td>object</td>
            <td>{}</td>
          </tr>
          <tr>
            <td>cancelText</td>
            <td>取消按钮文字</td>
            <td>string| slot</td>
            <td>取消</td>
          </tr>
          <tr>
            <td>centered</td>
            <td>垂直居中展示 Modal</td>
            <td>Boolean</td>
            <td><code>false</code></td>
          </tr>
          <tr>
            <td>closable</td>
            <td>是否显示右上角的关闭按钮</td>
            <td>boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>confirmLoading</td>
            <td>确定按钮 loading</td>
            <td>boolean</td>
            <td>无</td>
          </tr>
          <tr>
            <td>destroyOnClose</td>
            <td>关闭时销毁 Modal 里的子元素</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>footer</td>
            <td>底部内容，当不需要默认底部按钮时，可以设为 <code>:footer="null"</code></td>
            <td>string|slot</td>
            <td>确定取消按钮</td>
          </tr>
          <tr>
            <td>forceRender</td>
            <td>强制渲染 Modal</td>
            <td>boolean</td>
            <td>false</td>
          </tr>
          <tr>
            <td>getContainer</td>
            <td>指定 Modal 挂载的 HTML 节点</td>
            <td>(instance): HTMLElement</td>
            <td>() =&gt; document.body</td>
          </tr>
          <tr>
            <td>keyboard</td>
            <td>是否支持键盘 esc 关闭</td>
            <td>boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>mask</td>
            <td>是否展示遮罩</td>
            <td>Boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>maskClosable</td>
            <td>点击蒙层是否允许关闭</td>
            <td>boolean</td>
            <td>true</td>
          </tr>
          <tr>
            <td>maskStyle</td>
            <td>遮罩样式</td>
            <td>object</td>
            <td>{}</td>
          </tr>
          <tr>
            <td>okText</td>
            <td>确认按钮文字</td>
            <td>string|slot</td>
            <td>确定</td>
          </tr>
          <tr>
            <td>okType</td>
            <td>确认按钮类型</td>
            <td>string</td>
            <td>primary</td>
          </tr>
          <tr>
            <td>okButtonProps</td>
            <td>ok 按钮 props, 遵循 jsx<a href="https://github.com/vuejs/babel-plugin-transform-vue-jsx#difference-from-react-jsx">规范</a></td>
            <td>{props: <a href="/components/button/#API">ButtonProps</a>, on: {}}</td>
            <td>-</td>
          </tr>
          <tr>
            <td>cancelButtonProps</td>
            <td>cancel 按钮 props, 遵循 jsx<a href="https://github.com/vuejs/babel-plugin-transform-vue-jsx#difference-from-react-jsx">规范</a></td>
            <td>{props: <a href="/components/button/#API">ButtonProps</a>, on: {}}</td>
            <td>-</td>
          </tr>
          <tr>
            <td>title</td>
            <td>标题</td>
            <td>string|slot</td>
            <td>无</td>
          </tr>
          <tr>
            <td>visible(v-model)</td>
            <td>对话框是否可见</td>
            <td>boolean</td>
            <td>无</td>
          </tr>
          <tr>
            <td>width</td>
            <td>宽度</td>
            <td>string|number</td>
            <td>520</td>
          </tr>
          <tr>
            <td>wrapClassName</td>
            <td>对话框外层容器的类名</td>
            <td>string</td>
            <td>-</td>
          </tr>
          <tr>
            <td>zIndex</td>
            <td>设置 Modal 的 <code>z-index</code></td>
            <td>Number</td>
            <td>1000</td>
          </tr>
        </tbody>
      </table>
      <table class="ant-table-body">
        <thead class="ant-table-thead">
          <tr>
            <th>事件名称</th>
            <th>说明</th>
            <th>回调参数</th>
          </tr>
        </thead>
        <tbody class="ant-table-tbody">
          <tr>
            <td>cancel</td>
            <td>点击遮罩层或右上角叉或取消按钮的回调</td>
            <td>function(e)</td>
          </tr>
          <tr>
            <td>ok</td>
            <td>点击确定回调</td>
            <td>function(e)</td>
          </tr>
        </tbody>
      </table>
    </a-card>
  </div>
</template>
<script>
export default {
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
    },

    showConfirm () {
      this.$confirm({
        title: 'Do you want to delete these items?',
        content: 'When clicked the OK button, this dialog will be closed after 1 second',
        onOk () {
          return new Promise((resolve, reject) => {
            setTimeout(Math.random() > 0.5 ? resolve : reject, 1000)
          }).catch(() => console.log('Oops errors!'))
        },
        onCancel () { }
      })
    },

    showConfirm1 () {
      this.$confirm({
        title: 'Do you Want to delete these items?',
        content: h => <div style="color:red;">Some descriptions</div>,
        onOk () {
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        },
        class: 'test'
      })
    },

    showDeleteConfirm () {
      this.$confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
        onOk () {
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },
    showPropsConfirm () {
      this.$confirm({
        title: 'Are you sure delete this task?',
        content: 'Some descriptions',
        okText: 'Yes',
        okType: 'danger',
        okButtonProps: {
          props: { disabled: true }
        },
        cancelText: 'No',
        onOk () {
          console.log('OK')
        },
        onCancel () {
          console.log('Cancel')
        }
      })
    },

    info () {
      const h = this.$createElement
      this.$info({
        title: 'This is a notification message',
        content: h('div', {}, [
          h('p', 'some messages...some messages...'),
          h('p', 'some messages...some messages...')
        ]),
        onOk () { }
      })
    },
    countDown () {
      let secondsToGo = 5
      const modal = this.$success({
        title: 'This is a notification message',
        content: `This modal will be destroyed after ${secondsToGo} second.`
      })
      const interval = setInterval(() => {
        secondsToGo -= 1
        modal.update({
          content: `This modal will be destroyed after ${secondsToGo} second.`
        })
      }, 1000)
      setTimeout(() => {
        clearInterval(interval)
        modal.destroy()
      }, secondsToGo * 1000)
    },
    setModal1Visible (modal1Visible) {
      this.modal1Visible = modal1Visible
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

table th,
table td {
  border-right: 1px solid #e8e8e8;
}

table {
  border: 1px solid #e8e8e8;
  margin-bottom: 20px;
}

.ant-table-thead > tr > th {
  background: #fafafa;
}
</style>
