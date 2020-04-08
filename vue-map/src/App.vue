<template>
  <a-locale-provider :locale="locale">
    <div id="app" class="app-body">
      <a-spin :spinning="spinning" size="large" />
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
// import { mapActions } from 'vuex'
export default {
  data () {
    return {
      locale: zhCN
    }
  },
  mounted () {
    // 获取字典项
    this.$store.dispatch('dict/fetchPoint')
    this.$store.dispatch('dict/fetchMap')
    // 修复IE不跳转路由的问题
    // function checkIE () {
    //   return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
    // }
    // if (checkIE()) {
    //   window.addEventListener('hashchange', () => {
    //     var currentPath = window.location.hash.slice(1)
    //     if (this.$route.path !== currentPath) {
    //       this.$router.push(currentPath)
    //     }
    //   }, false)
    // }
  },
  computed: {
    spinning () {
      // console.log(this.$store.state.spinningcount)
      return this.$store.state.spinning
    }
  }
  // methods: {
  //   ...mapActions([
  //     // 'increment', // 将 `this.increment()` 映射为 `this.$store.dispatch('increment')`

  //     // `mapActions` 也支持载荷：
  //     'dict/fetchPoint' // 将 `this.incrementBy(amount)` 映射为 `this.$store.dispatch('incrementBy', amount)`
  //   ])
  // }
}
</script>
