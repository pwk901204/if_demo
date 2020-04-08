<template>
  <a-upload
    :action="action"
    accept="image/*"
    :fileList="fileList"
    listType="picture-card"
    :remove="handleRemove"
    @preview="handlePreview"
    @change="handleChange"
    :beforeUpload="beforeUpload"
  >
    <div v-if="fileList.length < 1">
      <a-icon type="plus"/>
      <div class="ant-upload-text">上传图片</div>
    </div>
  </a-upload>
</template>

<script>
export default {
  name: 'UploadPicture',
  props: ['value', 'action'],
  data () {
    return {
      fileList: []
      // action: process.env.NODE_ENV === 'production' ? '/file/fileImage' : '/file/fileImage'
    }
  },
  watch: {
    value (imgUrl) {
      if (imgUrl) {
        this.fileList = [{
          uid: '1',
          name: 'xxx.png',
          status: 'done',
          url: imgUrl
        }]
      } else {
        this.fileList = []
      }
    }
  },
  methods: {
    handleRemove (e) {
      this.fileList = []
      this.$emit('change', '')
    },
    handlePreview (file) {
      const h = this.$createElement
      this.$info({
        class: 'modal-preview',
        centered: true,
        width: 'auto',
        content: h('img', {
          attrs: {
            src: this.value
          }
        }),
        okText: '关闭'
      })
    },
    handleChange ({ file, fileList, event }) {
      this.fileList = fileList
      if (file.status === 'done') {
        this.$emit('change', file.response.result)
      }
    },
    beforeUpload (file) {
      const isImg = file.type.includes('image/')
      if (!isImg) {
        this.$message.error('仅能上传图片文件!')
        return
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('图片大于2MB，无法上传!')
      }
    }
  }
}
</script>

<style lang="less">
.modal-preview {
  .anticon-info-circle {
    display: none;
  }
  .ant-modal-confirm-content {
    margin-left: 0;
  }
}
</style>
