import Vue from 'vue'
// import VueStorage from 'vue-ls'
// import config from '@/config/defaultSettings'

// base library
import '@/core/antd'
import request from '@/utils/request'
// import Viser from 'viser-vue'
// ext library
// import VueClipboard from 'vue-clipboard2'
// import MultiTab from '@/components/MultiTab'
import QueryButton from '@/components/QueryButton'
import MTable from '@/components/Table'
// import PermissionHelper from '@/utils/helper/permission'
// import './directives/action'
Vue.prototype.$axios = request
// VueClipboard.config.autoSetContainer = true

// Vue.use(Viser)
// Vue.use(MultiTab)
Vue.use(QueryButton)
Vue.use(MTable)
// Vue.use(VueStorage, config.storageOptions)
// Vue.use(VueClipboard)
// Vue.use(PermissionHelper)
