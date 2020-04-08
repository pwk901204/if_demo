<template>
  <div class="clearfix">
    <a-upload :fileList="fileList"
              :remove="handleRemove"
              :beforeUpload="beforeUpload">
      <a-button>
        <a-icon type="upload" />Select File
      </a-button>
    </a-upload>
    <a-button type="primary"
              @click="handleUpload"
              :disabled="fileList.length === 0"
              :loading="uploading"
              style="margin-top: 16px">{{uploading ? 'Uploading' : 'Start Upload' }}</a-button>
  </div>
</template>
<script>
export default {
  data () {
    return {
      fileList: [],
      uploading: false
    }
  },
  methods: {
    handleRemove (file) {
      const index = this.fileList.indexOf(file)
      const newFileList = this.fileList.slice()
      newFileList.splice(index, 1)
      this.fileList = newFileList
    },
    beforeUpload (file) {
      this.fileList = [...this.fileList, file]
      return false
    },
    handleUpload () {
      let self = this
      const { fileList } = this
      const formData = new FormData()
      fileList.forEach(file => {
        formData.append('files[]', file)
      })
      this.uploading = true

      // You can use any AJAX library you like
      self.$axios.post('https://www.mocky.io/v2/5cc8019d300000980a055e76', {}).then(() => {
        self.fileList = []
        self.uploading = false
        self.$message.success('upload successfully.')
      }).catch(() => {
        self.uploading = false
        self.$message.error('upload failed.')
      })
    }
  }
}
</script>
