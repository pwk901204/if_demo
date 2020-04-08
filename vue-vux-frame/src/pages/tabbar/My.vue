<template>
  <div class="page-my">
    <div class="top">
      <x-header class="page-layout-header" :left-options="leftOptions">个人中心</x-header>
      <img class="bg" src="../../assets/my/bg-head.png" alt="bg" />
      <div class="panel-divider"></div>
      <group>
        <cell title="设置" is-link>
          <span slot="icon" class="iconfont icon-setting"></span>
        </cell>
      </group>
    </div>
    <div class="btns plr_15">
      <x-button type="primary">退出登录</x-button>
    </div>
  </div>
</template>
<script>
import { XHeader, Group, Cell, XButton } from 'vux'
export default {
  name: 'My', // 个人中心
  components: {
    XHeader, Group, Cell, XButton
  },
  data () {
    return {
      leftOptions: { showBack: false }
    }
  }
}
</script>
<style lang="less">
.page-my {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: #fff;
  .bg {
    width: 100%;
    height: auto;
    line-height: 1;
  }
  .vux-header {
    background: none !important;
  }
  .panel-divider {
    margin-top: -5px;
  }
  .vux-no-group-title {
    margin-top: 0;
  }
  .btns {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: center;
  }
}
</style>
