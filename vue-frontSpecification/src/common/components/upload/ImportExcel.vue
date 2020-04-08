<template>
  <div class="modal-import-excel" style="display: inline-block;">
    <a-button @click="showModal" type="primary">{{name}}</a-button>
    <!-- 弹框 -->
    <a-modal
      destroyOnClose
      :maskClosable="false"
      :title=name
      okText="导入"
      v-model="visible"
      :confirmLoading="uploading"
      @ok="handleImport"
    >
      <a-form :form="form">
        <a-form-item label="Excel文件" :labelCol="{span: 6}" :wrapperCol="{span: 14}">
          <a-upload
            :accept="accept"
            :remove="handleRemove"
            :beforeUpload="beforeUpload"
            @change="handleChange"
          >
            <div v-if="file==''">
              <a-button>
                <a-icon type="upload"/>上传
              </a-button>
            </div>
          </a-upload>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'ImportExcel',
  props: {
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    },
    accept: {
      type: String,
      default: 'application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
  },
  data () {
    return {
      visible: false,
      form: this.$form.createForm(this),
      fileList: [],
      file: '',
      uploading: false
    }
  },
  methods: {
    showModal (visible) {
      this.visible = !!visible
      this.file = ''
    },
    beforeUpload (file) {
      this.file = file
      return false
    },
    // 文件上传
    handleChange ({ file }) {
      this.file = file
    },
    // 移除文件
    handleRemove () {
      this.file = ''
    },
    // 上传请求
    handleImport () {
      if (this.file === '') {
        this.$message.warning('请上传Excel文件！')
        return
      }
      const formData = new FormData()
      formData.append('file', this.file)
      this.uploading = true
      // 打包URL配置
      if (process.env.NODE_ENV === 'production') {
        this.url = this.url.replace('', '')
      }
      axios.request({
        url: this.url,
        method: 'post',
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then(res => {
        this.uploading = false
        const { data } = res
        this.uploading = false
        if (data.flag) {
          this.$emit('success')
          this.$message.success('上传成功！')
          this.showModal(false)
        } else {
          this.$message.error(data.data || data.desc)
        }
      }).catch(err => {
        console.log(err)
      })
    }
  }
}
</script>
