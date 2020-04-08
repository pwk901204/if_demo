<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
// import VConsole from 'vconsole'
// import { ViewBox, XHeader } from 'vux'
// import '@/common/style/reset.less'
// import '@/common/style/common.less'

export default {
  name: 'App'
  // components: {
  //   ViewBox,
  //   XHeader
  // },
  // computed: {
  //   title () {
  //     let title = this.$route.meta.title
  //     if (this.$route.name === 'OrderDetail') {
  //       title = '工单编号：' + this.$route.params.id
  //     }
  //     return title
  //   },
  //   path () {
  //     return this.$route.path
  //   }
  // },
  // mounted () {
  //   // eslint-disable-next-line
  //   // new VConsole()
  // }
}
</script>
