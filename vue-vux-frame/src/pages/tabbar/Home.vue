<template>
  <div class="page-home">
    <div class="logo-wrap">
      <img class="logo" src="../../assets/logo.png" alt="logo" />
    </div>
    <group title="演示 Demo">
      <cell title="表单 Form" link="/demo/form"></cell>
      <cell title="表单编辑 Form" link="/demo/form?id=123456"></cell>
      <cell title="下拉刷新和上拉加载 Scroll" link="/demo/scroll"></cell>
    </group>
  </div>
</template>
<script>
import { Group, Cell } from 'vux'
export default {
  name: 'Home', // 首页
  components: {
    Group, Cell
  }
}
</script>
<style lang="less">
.page-home {
  background: #fff;
  .logo-wrap {
    text-align: center;
  }
  .logo {
    width: 160px;
    height: auto;
  }
}
</style>
