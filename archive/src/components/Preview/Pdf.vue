<template>
  <div class="pdfPreview">
    <iframe class="pdfIframe" :src="url"></iframe>
  </div>
</template>
<script>
const { NODE_ENV } = process.env
export default {
  name: 'pdfPreview',
  props: {
    src: {
      type: String,
      require: true
    }
  },
  data () {
    return {
      url: ''
    }
  },
  mounted () {
    this.loadFile(this.src)
  },
  methods: {
    loadFile (data) {
      console.log(NODE_ENV)
      this.url = NODE_ENV === 'production' ? '/back/plugins/pdf/web/viewer.html?file=' + encodeURIComponent('/common/downloadUrl?fileUrl=' + data) : '/plugins/pdf/web/viewer.html?file=' + encodeURIComponent('/api/common/downloadUrl?fileUrl=' + data)
    }
  }
}
</script>
<style lang="less">
.pdfIframe {
  width: 100%;
  height: 600px;
}
</style>
