import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
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
      if (spinning === true) {
        state.spinningcount++
        if (state.spinningcount > 0) {
          state.spinning = spinning
        }
      } else {
        state.spinningcount--
        if (state.spinningcount === 0) {
          state.spinning = spinning
        }
      }
    },
    INIT_SPINNIN (state) {
      state.spinningcount = 0
      state.spinning = false
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
  plugins: [createPersistedState()]
})
