/* eslint-disable */
import Vue from 'vue'
import '@babel/polyfill'
import App from './App.vue'
import router from './router'
import store from './store'
import request from '@/common/utils/request'

import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import StandardTable from '@/common/components/table'
import PageHeader from '@/common/components/page/PageHeader'
import VueDraggableResizable from 'vue-draggable-resizable'
import '@/common/style/reset.less'
import '@/common/style/common.less'
import './permission.js'
Vue.prototype.$axios = request
Vue.use(Antd)
Vue.component('StandardTable', StandardTable)
Vue.component('PageHeader', PageHeader)
Vue.component('vue-draggable-resizable', VueDraggableResizable)
Vue.config.productionTip = false
new Vue({
  router,
  store,
  render: function (h) {
    if ('-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style) {
      window.addEventListener('hashchange', () => {
        var currentPath = window.location.hash.slice(1)
        if (this.$route.path !== currentPath) {
          this.$router.push(currentPath)
        }
      }, false)
    }
    return h(App)
  }
}).$mount('#app')


