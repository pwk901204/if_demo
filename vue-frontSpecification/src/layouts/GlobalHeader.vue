<template>
  <div class="layout-header"
       :class="[fixedHeader]"
       :style="{width: '100%',height:'70px'}">
    <div class="header-left">
      <span class="iconfont iconLOGO"></span>
      <p>应用研发部视觉规范-Web</p>
    </div>
    <div class="header-right">
      <header-notice class="header-item" />
      <header-avatar class="header-item" />
    </div>
  </div>
</template>

<script>
import HeaderNotice from './HeaderNotice'
import HeaderAvatar from './HeaderlAvatar'

export default {
  name: 'GlobalHeader',
  components: { HeaderNotice, HeaderAvatar },
  computed: {
    layout () {
      return this.$store.state.setting.layout
    },
    theme () {
      return this.layout === 'side' ? 'light' : this.$store.state.setting.theme
    },
    fixedHeader () {
      return this.$store.state.setting.fixedHeader ? 'fixed-header' : ''
    }
  },
  methods: {
    // 退出登录
    handleLogout () {
      this.$router.push('/login')
    }
  }
}
</script>
<style  lang="less">
.layout-header {
  color: #fff;
  background: url(../assets/layOut.jpg) center center no-repeat !important;
  background-size: cover !important;
  .header-left {
    height: 100%;
    span {
      font-size: 30px;
    }
    p {
      font-weight: bold;
    }
    width: 300px;
    font-size: 22px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
