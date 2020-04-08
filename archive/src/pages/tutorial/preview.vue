<template>
  <div>
    <Previewlist
      class="preview-btn"
      v-for="(file,index) in file"
      :key="index"
      :type="file.fileType"
      :name="file.fileName"
      :url="file.fileUrl"
      :id="file.fileId"
      :width="file.width"
    >
      <a-button>{{file.fileName}}</a-button>
    </Previewlist>
  </div>
</template>
<script>
import Previewlist from '@/components/Preview/main'
const mp3 = require('@/assets/2.mp3')
const mp4 = require('@/assets/1.mp4')
export default {
  name: 'Preview',
  components: { Previewlist },
  data () {
    return {
      file: [
        {
          fileType: 'mp3',
          fileName: '音乐',
          fileUrl: mp3
        }, {
          fileType: 'png',
          fileName: '图片',
          fileUrl: 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3658389112,1498655840&fm=26&gp=0.jpg'
        }, {
          fileType: 'mp4',
          fileName: '视频',
          fileUrl: mp4
        }, {
          fileType: 'pdf',
          fileName: 'pdf文件',
          fileUrl: '@/assets/3.pdf',
          width: '800px'
        }, {
          fileType: 'docx',
          fileName: 'word文件',
          fileUrl: '@/assets/4.docx',
          fileId: 'fileId',
          width: '900px'
        }
      ]
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less">
.preview-btn {
  display: inline-block;
  margin: 20px;
}
</style>
