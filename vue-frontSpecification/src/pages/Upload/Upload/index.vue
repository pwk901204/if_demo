<template>
  <div class="page-form">
    <a-card title="1.点击上传">
      <click-upload></click-upload>
    </a-card>

    <a-card title="2.用户头像">
      <user-photo></user-photo>
      <br />
      <br />
      <a-alert message="点击上传用户头像，并使用 beforeUpload 限制用户上传的图片格式和大小。beforeUpload 的返回值可以是一个 Promise 以支持异步处理，如服务端校验等"
               type="success" />
    </a-card>

    <a-card title="3.已上传的文件列表">
      <uploaded-upload></uploaded-upload>
      <br />
      <br />
      <a-alert message="使用 defaultFileList 设置已上传的内容。"
               type="success" />
    </a-card>

    <a-card title="4.照片墙">
      <photo-wall></photo-wall>
    </a-card>

    <a-card title="5.完全控制的上传列表">
      <control-upload></control-upload>
      <br />
      <br />
      <a-alert message="使用 fileList 对列表进行完全控制，可以实现各种自定义功能，以下演示三种情况"
               type="success" />
      <a-alert message="1.上传列表数量的限制。"
               type="success" />
      <a-alert message="2.读取远程路径并显示链接"
               type="success" />
      <a-alert message="3.按照服务器返回信息筛选成功上传的文件"
               type="success" />
    </a-card>

    <a-card title="6.拖拽上传">
      <drap-drop></drap-drop>
      <br />
      <br />
      <a-alert message="把文件拖入指定区域，完成上传，同样支持点击上传。设置 multiple 后，在 IE10+ 可以一次上传多个文件。"
               type="success" />
    </a-card>

    <a-card title="7.图片列表样式">
      <photo-style></photo-style>
      <br />
      <br />
      <a-alert message="上传文件为图片，可展示本地缩略图。IE8/9 不支持浏览器本地缩略图展示（Ref），可以写 thumbUrl 属性来代替"
               type="success" />
    </a-card>

    <a-card title="8.手动上传">
      <hand-upload></hand-upload>
      <br />
      <br />
      <a-alert message="beforeUpload 返回 false 后，手动上传文件"
               type="success" />
    </a-card>

    <a-card title="9.文件夹上传">
      <folder-upload></folder-upload>
      <br />
      <br />
      <a-alert message="支持上传一个文件夹里的所有文件"
               type="success" />
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
import ClickUpload from './Components/ClickUpload' // 点击上传
import UserPhoto from './Components/UserPhoto' // 用户头像
import UploadedUpload from './Components/UploadedUpload' // 已上传的文件列表
import PhotoWall from './Components/PhotoWall' // 照片墙
import ControlUpload from './Components/ControlUpload' // 完全控制的上传列表
import DrapDrop from './Components/DrapDrop' // 拖拽上传
import PhotoStyle from './Components/PhotoStyle' // 图片列表样式
import HandUpload from './Components/HandUpload' // 手动上传
import FolderUpload from './Components/FolderUpload' // 文件夹上传
export default {
  name: 'AutoComplate', // 自动完成
  mixins: [GlobalMixin],
  components: {
    ClickUpload,
    UserPhoto,
    UploadedUpload,
    PhotoWall,
    ControlUpload,
    DrapDrop,
    PhotoStyle,
    HandUpload,
    FolderUpload
  },
  data () {
    return {
      userName: 'username'
    }
  },
  mounted () {

  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
