<template>
  <a-layout-sider :class="[theme, 'sider-pro', fixSiderbar]"
                  width="200px"
                  :collapsible="collapsible"
                  v-model="collapsed"
                  :trigger="null">
    <i class="iconfont iconshouqi" @click="toggleCollapse"></i>
   <!--  <a-icon class="iconfont iconshouqi"
            :type="collapsed ? 'menu-unfold' : 'menu-fold'"
            @click="toggleCollapse" /> -->
    <i-menu id="menu"
            :theme="theme"
            :collapsed="collapsed"
            :menuData="menuData"
            @select="onSelect" />
  </a-layout-sider>
</template>

<script>
import IMenu from './menu'
export default {
  name: 'SiderMenu',
  components: { IMenu },
  props: {
    collapsible: {
      type: Boolean,
      required: false,
      default: false
    },
    collapsed: {
      type: Boolean,
      required: false,
      default: false
    },
    menuData: {
      type: Array,
      required: true
    },
    theme: {
      type: String,
      required: false,
      default: 'dark'
    }
  },
  data () {
    return {
    }
  },
  computed: {
    fixSiderbar () {
      return this.$store.state.setting.fixSiderbar ? 'fixed-sidebar' : ''
    },
    systemName () {
      return this.$store.state.setting.systemName
    }
  },
  methods: {
    onSelect (obj) {
      this.$emit('menuSelect', obj)
    },
    toggleCollapse () {
      this.$emit('toggleCollapse')
    }
  }
}
</script>

<style lang="less">
.shadow {
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
}
.sider-pro {
  z-index: 10;
  min-height: 100vh;
  &.light {
    background-color: #fff;
  }
  &.dark {
    background-color: #001529;
  }
  &.fixed-sidebar {
    position: fixed;
    top: 70px;
    left: 0;
    .ant-menu-root {
      height: calc(100vh - 64px);
      overflow-y: auto;
    }
  }
  .logo {
    line-height: 64px;
    position: relative;
    overflow: hidden;
    height: 64px;
    padding-left: 24px;
    -webkit-transition: all 0.3s;
    transition: all 0.3s;
    &.light {
      background-color: #fff;
      h1 {
        color: #1890ff;
      }
    }
    &.dark {
      background-color: #002140;
      h1 {
        color: #fff;
      }
    }
    h1 {
      font-family: "Myriad Pro", "Helvetica Neue", Arial, Helvetica, sans-serif;
      font-size: 20px;
      font-weight: 600;
      line-height: 32px;
      display: inline-block;
      height: 32px;
      margin: 0 0 0 12px;
      vertical-align: middle;
      color: #fff;
    }
  }
  .change {
    margin-right: 10px;
  }
  .ant-menu.ant-menu-dark .ant-menu-item-selected,
  .ant-menu-submenu-popup.ant-menu-dark .ant-menu-item-selected {
    background-color: #44aeff;
  }
  .iconshouqi{
    cursor: pointer;
    color: #ffffff;
    overflow:hidden;
    margin-left: 24px;
  }
}
.ant-layout-sider-children{
  padding-top: 20px !important;
}
.ant-layout-sider-collapsed .ant-menu-submenu-title span span{
  opacity: 0
}
.ant-layout-sider-collapsed .iconshouqi{
  margin-left: 32px;
}
</style>
