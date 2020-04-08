<template>
  <div class="exception">
    <div class="img">
      <img :src="config[type].img" />
    </div>
  </div>
</template>

<script>
import Config from './typeConfig'

export default {
  name: 'ExceptionPage',
  props: ['type'],
  data () {
    return {
      config: Config
    }
  },
  computed: {
    StyleHeight () {
      let style = {}
      style.height = window.screen.availHeight - 240 + 'px'
      return style
    }
  }
}
</script>

<style lang="less">
.exception {
  height: 100%;
  align-items: center;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  .img {
    display: inline-block;
    padding-right: 52px;
    zoom: 1;
    img {
      // width: 550px;
      height: 100%;
    }
  }
  .content {
    display: inline-block;
    flex: auto;
    h1 {
      color: #434e59;
      font-size: 72px;
      font-weight: 600;
      line-height: 72px;
      margin-bottom: 24px;
    }
    .desc {
      color: rgba(0, 0, 0, 0.45);
      font-size: 20px;
      line-height: 28px;
      margin-bottom: 16px;
    }
  }
}
</style>
