<template>
  <div class="component-m-article">
    <iframe frameborder="0" name="MArticle" :style="{'min-height': iframeHeight}" />
  </div>
</template>
<script>
const GLOBAL = {
  iframe: '',
  head: '',
  body: '',
  documentElement: '',
  counter: 0
}
export default {
  name: 'MArticle',
  props: {
    content: { required: true, type: String }
  },
  watch: {
    content: function (val) {
      this.renderIfrmae(val)
    }
  },
  data () {
    return {
      iframeHeight: '150px'
    }
  },
  mounted () {
    if (this.content) {
      this.renderIfrmae(this.content)
    }
  },
  methods: {
    renderIfrmae (content) {
      GLOBAL.iframe = window.frames.MArticle
      GLOBAL.head = GLOBAL.iframe.document.getElementsByTagName('head')[0]
      GLOBAL.body = GLOBAL.iframe.document.body
      GLOBAL.documentElement = GLOBAL.iframe.document.documentElement
      this.createLink('plugins/tinymce/skins/ui/oxide/content.min.css')
      this.createLink('plugins/tinymce/skins/content/default/content.css')
      GLOBAL.body.classList.add('mce-content-body')
      GLOBAL.body.innerHTML = content
      this.createScript()
      // 设置iframe的高度
      window.requestAnimationFrame(this.setIframeHeight)
    },
    // 创建样式
    createLink (href) {
      const existing = GLOBAL.iframe.document.getElementById(href)
      if (existing) {
        return
      }
      const style = document.createElement('link')
      style.href = href
      style.type = 'text/css'
      style.rel = 'stylesheet'
      style.id = href
      GLOBAL.head.appendChild(style)
    },
    // 创建脚本
    createScript () {
      const existing = GLOBAL.iframe.document.getElementById('AScript')
      if (existing) {
        return
      }
      const script = document.createElement('script')
      script.type = 'text/javascript'
      script.id = 'AScript'
      script.text = 'document.addEventListener && document.addEventListener("click", function(e) {for (var elm = e.target; elm; elm = elm.parentNode) {if (elm.nodeName === "A" && !(e.ctrlKey && !e.altKey)) {e.preventDefault();}}}, false);'
      GLOBAL.body.appendChild(script)
    },
    // 设置iframe的高度
    setIframeHeight () {
      const scrollHeight = GLOBAL.documentElement.scrollHeight
      const offsetHeight = GLOBAL.documentElement.offsetHeight
      const clientHeight = GLOBAL.documentElement.clientHeight
      const maxHeight = Math.max(scrollHeight, offsetHeight, clientHeight) + 'px'
      if (GLOBAL.counter < 100) {
        GLOBAL.counter++
        if (this.iframeHeight !== maxHeight) {
          this.iframeHeight = maxHeight
        }
        window.requestAnimationFrame(this.setIframeHeight)
      } else {
        GLOBAL.counter = 0
      }
    }
  }
}
</script>
<style lang="less">
.component-m-article {
  iframe {
    width: 100%;
    background-color: #fff;
    outline: 0;
    padding: 0;
  }
}
</style>
