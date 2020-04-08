<template>
  <div class="page-view">
    <!-- 页面头部 -->
    <page-header :breadcrumb="breadcrumb" />
    <!-- 页面主体 -->
    <router-view class="page-container" />
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
      let breadcrumb = []
      this.$route.matched.forEach(item => {
        if (item.meta && item.meta.breadcrumb && item.meta.breadcrumb.length > 0) {
          breadcrumb = breadcrumb.concat(item.meta.breadcrumb)
        }
        breadcrumb.push({ name: item.name, path: item.path })
      })
      this.breadcrumb = Object.freeze(breadcrumb)
    }
  }
}
</script>
