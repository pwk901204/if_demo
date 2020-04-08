<template>
  <div class="page-content">
    <!-- 页面头部 -->
    <page-header :breadcrumb="breadcrumb" />
    <!-- 页面主体 -->
    <a-spin :spinning="$store.state.spinning">
      <a-icon slot="indicator"
              type="loading"
              style="font-size: 24px"
              spin />
      <router-view />
    </a-spin>
  </div>
</template>

<script>
export default {
  name: 'PageView',
  data () {
    return {
      breadcrumb: []
    }
  },
  watch: {
    '$route': function () {
      this.getBreadcrumb()
    }
  },
  mounted () {
    this.getBreadcrumb()
  },
  methods: {
    getBreadcrumb () {
      this.breadcrumb = this.$route.matched
    }
  }
}
</script>
