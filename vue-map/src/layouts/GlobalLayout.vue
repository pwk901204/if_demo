<template>
  <div class="layout">
    <sider-menu
      v-if="layout === 'side'"
      :theme="theme"
      :menuData="menuData"
      :collapsed="collapsed"
      :collapsible="true"
    />
    <div class="layout-right" :style="getLayoutStyle">
      <!-- 头部 -->
      <global-header :menuData="menuData" :collapsed="collapsed" @toggleCollapse="toggleCollapse" />
      <!-- 内容区域 -->
      <div class="layout-content" :style="contentStyle">
        <slot></slot>
      </div>
      <!-- 底部 -->
      <global-footer />
    </div>
  </div>
</template>
<script>
import SiderMenu from '@/common/components/menu/SiderMenu'
import GlobalHeader from './GlobalHeader'
import GlobalFooter from './GlobalFooter'
let menuData = []
export default {
  name: 'GlobalLayout',
  components: {
    SiderMenu,
    GlobalHeader,
    GlobalFooter
  },
  data () {
    return {
      collapsed: false,
      menuData: Object.freeze(menuData),
      showSetting: false
    }
  },
  computed: {
    theme () {
      return this.$store.state.setting.theme
    },
    layout () {
      return this.$store.state.setting.layout
    },
    contentStyle () {
      const fixedHeader = this.$store.state.setting.fixedHeader
      let style = {}
      if (fixedHeader) {
        style.paddingTop = '64px'
      }
      return style
    },
    getLayoutStyle () {
      const { fixSiderbar, layout } = this.$store.state.setting
      if (fixSiderbar && layout !== 'head') {
        return {
          height: '100%',
          paddingLeft: this.collapsed ? '80px' : '256px'
        }
      }
      return null
    }
  },
  methods: {
    toggleCollapse () {
      this.collapsed = !this.collapsed
    }
  },
  beforeCreate () {
    const sidebar = this.$router.options.routes.find(item => item.path === '/').children
    menuData = JSON.parse(JSON.stringify(sidebar))
  }
}
</script>
