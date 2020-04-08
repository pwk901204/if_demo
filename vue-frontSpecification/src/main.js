/* eslint-disable */
import Vue from 'vue'
import '@babel/polyfill'
import App from './App.vue'
import router from './router'
import store from './store'
// import GlobalMixin from '@/mixins/global'
import request from '@/common/utils/request'
import Viser from 'viser-vue'
import Antd from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css'
import StandardTable from '@/common/components/table/StandardTable'
import PageHeader from '@/common/components/page/PageHeader'
import AEmpty from '@/common/components/empty/Index'
import echarts from 'echarts'
// import StandardForm from '@/common/components/form/StandardForm'

import '@/common/style/reset.less'
import '@/common/style/common.less'


Vue.prototype.$axios = request
Vue.prototype.$echarts = echarts
Vue.use(Viser)
Vue.use(Antd)

Vue.component('StandardTable', StandardTable)
Vue.component('PageHeader', PageHeader)
Vue.component('AEmpty', AEmpty)

// Vue.mixin(GlobalMixin)
Vue.config.productionTip = false


import Validator from './pages/baseForm/valid/valid'
Vue.use(Validator);

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
