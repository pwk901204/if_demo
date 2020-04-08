<template>
  <a-locale-provider :locale="locale">
    <div id="app"
         class="app-body">
      <a-spin :spinning="spinning"
              size="large" />
      <router-view />
    </div>
  </a-locale-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
export default {
  data () {
    return {
      locale: zhCN
    }
  },
  computed: {
    spinning () {
      return this.$store.state.spinning
    }
  }
}
</script>
