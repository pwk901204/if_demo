<template>
  <div class="ant-empty">
    <div class="ant-empty-image">
      <img src="./empty.svg" alt="暂无数据" />
    </div>
    <div class="ant-empty-description">{{description}}</div>
  </div>
</template>
<script>
export default {
  name: 'Empty',
  props: {
    description: { type: String, default: '暂无数据' }
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
}
.ant-empty-image img {
  height: 100%;
}
.ant-empty-description {
  margin: 0;
}
</style>
