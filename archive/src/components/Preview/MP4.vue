<template>
  <div class="mp4">
    <video style="width:100%;heigth:100%" controls>
      <source :src="src" type="video/mp4" />???????? HTML5 video ???
    </video>
  </div>
</template>
<script>
export default {
  name: 'MP4',
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
