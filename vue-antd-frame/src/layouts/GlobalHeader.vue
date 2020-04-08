<template>
  <div class="layout-header"
       :class="[fixedHeader]"
       :style="{width: getHeadWidth}">
    <!-- <div :class="['global-header-wide', layout]"> -->
    <!-- <router-link v-if="layout === 'head'" to="/" :class="['logo',theme]">
        <img width="32" src="@/assets/logo.png">
        <h1>{{systemName}}</h1>
    </router-link>-->
    <!-- <div v-if="layout === 'head'" class="global-header-menu">
        <i-menu
          style="height: 64px; line-height: 64px;"
          :theme="theme"
          mode="horizontal"
          :menuData="menuData"
          @select="onSelect"
        />
    </div>-->
    <a-icon class="trigger"
            v-if="layout === 'side'"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggleCollapse" />
    <div class="header-right">
      <!-- <header-avatar class="header-item" /> -->
      <span class="user-name">项目经理！</span>
      <span class="logout"
            @click="handleLogout">
        <a-tooltip placement="topRight"
                   title='退出登陆'>
          <a-icon type="logout" />
        </a-tooltip>
      </span>
    </div>
    <!-- </div> -->
  </div>
</template>

<script>
// import HeaderAvatar from './HeaderlAvatar'
export default {
  name: 'GlobalHeader',
  components: {},
  props: ['collapsed', 'menuData'],
  computed: {
    layout () {
      return this.$store.state.setting.layout
    },
    theme () {
      return this.layout === 'side' ? 'light' : this.$store.state.setting.theme
    },
    fixedHeader () {
      return this.$store.state.setting.fixedHeader ? 'fixed-header' : ''
    },
    getHeadWidth () {
      const { isMobile, fixedHeader, layout } = this.$store.state.setting
      if (isMobile || !fixedHeader || layout === 'head') {
        return '100%'
      }
      return this.collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)'
    },
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    toggleCollapse () {
      this.$emit('toggleCollapse')
    },
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    // 退出登录
    handleLogout () {
      this.$router.push('/login')
    }
  }
}
</script>
