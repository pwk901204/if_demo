<template>
  <label class="ant-upload ant-upload-select ant-upload-select-picture-card">
    <img v-if="avatar" :src="avatar" alt="avatar" class="avatar">
    <input type="file" id="input" accept="image/*" style="display: none;" @change="handleChange">
    <span v-if="!avatar" role="button" class="ant-upload ant-upload-btn">
      <a-icon type="plus"/>
      <div class="ant-upload-text">上传图片</div>
    </span>
    <a-modal
      title="裁剪"
      :visible="visible"
      :maskClosable="false"
      okText="裁剪"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <div class="img-container">
        <img id="croppedImage" :src="imgSrc">
      </div>
    </a-modal>
  </label>
  <!-- <a-upload
    action="/file/fileImage"
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
  </a-upload>-->
</template>

<script>
import axios from 'axios'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'

// console.log(Cropper)

let cropper

export default {
  name: 'UploadPicture',
  props: ['value'],
  data () {
    return {
      // fileList: [],
      visible: false,
      imgSrc: '',
      avatar: ''
    }
  },
  watch: {
    value (imgUrl) {
      this.avatar = imgUrl
      // if (imgUrl) {
      //   this.avatar = imgUrl
      //   // this.fileList = [{
      //   //   uid: '1',
      //   //   name: 'xxx.png',
      //   //   status: 'done',
      //   //   thumbUrl: imgUrl,
      //   //   url: imgUrl
      //   // }]
      // } else {
      //   this.avatar = ''
      // }
    }
  },
  // mounted() {
  //   this.imgSrc = this.imgUrl
  // },
  methods: {
    // handleRemove (e) {
    //   this.fileList = []
    //   this.$emit('change', '')
    // },
    // handlePreview (file) {
    //   const h = this.$createElement
    //   this.$info({
    //     class: 'modal-preview',
    //     centered: true,
    //     content: h('img', {
    //       attrs: {
    //         src: this.value
    //       }
    //     }),
    //     okText: '关闭'
    //   })
    // },
    // handleChange ({ file, fileList, event }) {
    //   this.fileList = fileList
    //   if (file.status === 'done') {
    //     this.$emit('change', file.response.data)
    //   }
    // },
    // beforeUpload (file) {
    //   const isImg = file.type.includes('image/')
    //   if (!isImg) {
    //     this.$message.error('仅能上传图片文件!')
    //     return
    //   }
    //   const isLt2M = file.size / 1024 / 1024 < 2
    //   if (!isLt2M) {
    //     this.$message.error('图片大于2MB，无法上传!')
    //     return
    //   }
    // },
    handleChange (e) {
      const files = e.target.files
      if (!files[0].type.includes('image/')) {
        this.$message.error('仅能上传图片文件!')
        return
      }
      const isLt2M = files[0].size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('上传图片大小超过限制：2MB')
        return
      }
      const done = (url) => {
        document.getElementById('input').value = ''
        this.imgSrc = url
        this.visible = true
        this.$nextTick(() => {
          const image = document.getElementById('croppedImage')
          cropper = new Cropper(image, {
            viewMode: 2
            // aspectRatio: 2.2875/1
          })
        })
      }
      if (files && files.length > 0) {
        const file = files[0]
        if (URL) {
          done(URL.createObjectURL(file))
        } else if (FileReader) {
          let reader = new FileReader()
          reader.onload = () => {
            done(reader.result)
          }
          reader.readAsDataURL(file)
        }
      }
    },
    handleOk () {
      const canvas = cropper.getCroppedCanvas({ maxWidth: 4096, maxHeight: 4096 })
      this.avatar = canvas.toDataURL()
      this.$store.commit('setSpinning', true)
      canvas.toBlob((blob) => {
        let formData = new FormData()
        formData.append('file', blob, 'avatar.jpg')
        let url = process.env.NODE_ENV === 'production' ? '/api/file/fileImage' : '/file/fileImage'
        axios.request({
          url: url,
          method: 'post',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(res => {
          this.$store.commit('setSpinning', false)
          if (res.data.flag) {
            this.$emit('change', res.data.data)
            this.visible = false
          } else {
            this.$message.error(res.data.data)
          }
        }).catch(err => {
          this.$store.commit('setSpinning', false)
          console.log(err)
        })
      })
    },
    handleCancel () {
      this.visible = false
      cropper.destroy()
      cropper = null
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
