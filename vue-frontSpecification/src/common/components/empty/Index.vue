<template>
  <div class="ant-empty">
    <div class="ant-empty-image">
      <img :src="image" alt="暂无数据">
    </div>
    <p class="ant-empty-description">{{description}}</p>
  </div>
</template>

<script>
import emptyImg from './empty.svg'
export default {
  name: 'AEmpty',
  props: {
    image: {
      type: String,
      default: emptyImg
    },
    description: {
      type: String,
      default: '暂无数据'
    }
  }
}
</script>

<style lang="less">
.ant-empty {
  margin: 0 8px;
  text-align: center;
  font-size: 14px;
  line-height: 22px;
}
.ant-empty-image {
  height: 100px;
  margin-bottom: 8px;
  img {
    height: 100%;
  }
}
.ant-empty-description {
  margin: 0;
}
</style>
