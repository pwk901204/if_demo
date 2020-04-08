<template>
  <div class="page-content Aifan">
    <!-- 页面头部 -->
    <page-header :breadcrumb="breadcrumb"
                 @refresh-page="refreshCall" />
    <!-- 页面主体 -->
    <router-view :key="activeDate" />
  </div>
</template>

<script>
// import PageHeader from '@/common/components/page/PageHeader'
export default {
  name: 'PageView',
  // components: { PageHeader },
  data () {
    return {
      activeDate: Date.now(),
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
    },
    // 刷新页面
    refreshCall () {
      this.activeDate = Date.now()
    }
  }
}
</script>
