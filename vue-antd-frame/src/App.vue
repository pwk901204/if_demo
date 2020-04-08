<template>
  <a-config-provider :locale="locale">
    <div id="app"
         class="app-body">
      <router-view />
    </div>
  </a-config-provider>
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

  }
}
</script>
