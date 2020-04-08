<template>
  <div class="layout-header" :class="[fixedHeader]" :style="{width: getHeadWidth}">
    <a-icon
      class="trigger"
      v-if="layout === 'side'"
      :type="collapsed ? 'menu-unfold' : 'menu-fold'"
      @click="toggleCollapse"
    />
    <div class="header-right">
      <header-avatar class="header-item" />
    </div>
  </div>
</template>

<script>
import HeaderAvatar from './HeaderlAvatar'

export default {
  name: 'GlobalHeader',
  components: { HeaderAvatar },
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
