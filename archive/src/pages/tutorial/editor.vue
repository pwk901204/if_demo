<template>
  <div class="tutorial-editor">
    <editor />
    <div class="btn-wrap">
      <a-button @click="getContent">获取内容</a-button>
      <a-button @click="setContent">设置内容</a-button>
      <a-button @click="showContent">显示内容</a-button>
    </div>
    <m-article :content="article" />
  </div>
</template>
<script>
import Editor from '@/components/Editor/Tinymce'
import MArticle from '@/components/Editor/MArticle'
export default {
  name: 'TutorialEdior',
  components: { Editor, MArticle },
  data () {
    return {
      article: '<p>今天周五！</p>'
    }
  },
  methods: {
    getContent () {
      console.log(window.tinymce.get('tiny').getContent())
    },
    setContent () {
      window.tinymce.get('tiny').setContent('<p>我是勤劳的小蜜蜂！</p>')
    },
    showContent () {
      const content = window.tinymce.get('tiny').getContent()
      this.article = content
    }
  }
}
</script>
<style lang="less">
.tutorial-editor {
  .btn-wrap {
    padding: 24px 0;
    button + button {
      margin-left: 24px;
    }
  }
}
</style>
