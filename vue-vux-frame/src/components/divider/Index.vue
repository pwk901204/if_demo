<template>
  <div class="ant-divider" :class="`ant-divider-${type}`"></div>
</template>
<script>
export default {
  name: 'Divider',
  props: { type: String, default: 'horizontal' }
}
</script>
<style lang="less">
.ant-divider {
  position: relative;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  list-style: none;
  font-size: 14px;
  font-variant: tabular-nums;
  line-height: 1.5;
  color: rgba(0, 0, 0, .65);
  background: #e8e8e8;

  font-feature-settings: "tnum";
}
.ant-divider-horizontal:before {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 1px;
  content: " ";
  -webkit-transform: scaleY(.5);
  transform: scaleY(.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
  color: #ebebeb;
  border-top: 1px solid #ebebeb;
}
.ant-divider-vertical:before {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  content: " ";
  transform: scaleX(.5);
  transform-origin: 0 0;
  color: #ebebeb;
  border-left: 1px solid #ebebeb;
}
</style>
