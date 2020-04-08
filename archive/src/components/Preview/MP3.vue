<template>
  <div class="mp3">
    <audio style="width:100%;heigth:100%" controls>
      <source :src="src" type="audio/mpeg" />您的浏览器不支持 audio 元素。
    </audio>
  </div>
</template>
<script>
export default {
  name: 'MP3',
  props: {
    src: {
      type: String,
      require: true
    }
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
  }
}
</script>
