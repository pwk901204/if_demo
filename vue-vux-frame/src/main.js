// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import App from './App'
import router from './router'
import store from './store'

// ant-design iocn
// import { AntDesignOutline, DashboardOutline } from '@ant-design/icons'
// import AntdIcon from '@ant-design/icons-vue'
// AntdIcon.add(AntDesignOutline, DashboardOutline)
// Vue.use(AntdIcon)
import 'vux/src/styles/1px.less'
import './common/style/reset.less'
import './common/style/common.less'
import request from '@/common/ability/request'
import validate from '@/common/ability/validate'

import Empty from './components/empty/Index'
import Divider from './components/divider/Index'

Vue.component('empty', Empty)
Vue.component('divider', Divider)
// import './directive.js' // 自定义指令
// import Ability from './common/ability/ability'

// Vue.prototype.ABILITY = Ability
Vue.prototype.$axios = request
Vue.prototype.$validate = validate
FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
