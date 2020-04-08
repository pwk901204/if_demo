import Vue from 'vue'
import Vuex from 'vuex'
// import createPersistedState from 'vuex-persistedstate'
import account from './modules/account'
import setting from './modules/setting'
import dict from './modules/dict'

Vue.use(Vuex)
// eslint-disable-next-line
export default new Vuex.Store({
  state: {
    homePage: '', // 首页地址
    spinning: false,
    spinningcount: 0
  },
  mutations: {
    // 全局loading
    SET_SPINNING (state, spinning) {
      state.spinning = spinning
    },
    setHomePage (state, homePage) {
      state.homePage = homePage
    }
  },
  actions: {

  },
  modules: {
    account,
    setting,
    dict
  },
  getters: {
    roles: state => state.account.roles,
    userInfo: state => state.account.userInfo,
    flagRole: state => state.account.flagRole
  }
  // plugins: [createPersistedState()]
})
