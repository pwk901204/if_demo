<template>
  <div class="logo">
    <!-- <router-link :to="{name:'/index'}"> -->
    <LogoSvg alt="logo" />
    <h1 v-if="showTitle">{{ title }}</h1>
    <!-- </router-link> -->
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    title: { type: String, default: '档案管理系统' },
    showTitle: { type: Boolean, default: true }
  }
}
</script>
