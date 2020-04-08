<template>
  <div class="picturePreview">
    <img style="width:100%;heigth:100%" :src="src" />
  </div>
</template>
<script>
export default {
  name: 'Picture',
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
