<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <!-- <a-button @click="login">登录</a-button>
      <a-button @click="logout">退出</a-button> -->
      <!-- <a-spin :spinning="spinning" size="large" /> -->
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
// eslint-disable-next-line
import zh_CN from 'ant-design-vue/lib/locale-provider/zh_CN'
import { mapState } from 'vuex'
import { AppDeviceEnquire } from '@/utils/mixin'
export default {
  mixins: [AppDeviceEnquire],
  data () {
    return {
      locale: Object.freeze(zh_CN)
    }
  },
  computed: {
    ...mapState(['spinning'])
  },
  beforeCreate () {
    this.$store.dispatch('router/GenerateRoutes') // 静态路由
    this.$store.dispatch('dict/getDict', 'contentTreeDict') // 获取目录树数据
    // this.$store.dispatch('router/GenerateDynamicRoutes') // 动态路由
  },
  methods: {
    // 登录
    login () {
      this.$axios.post('/apply/getApply?id=1').then(res => {
        console.log(res)
      })
    },
    // 登出
    logout () {

    }
  }
}
</script>
