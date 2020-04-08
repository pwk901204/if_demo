import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import createVuexLogger from 'createVuexLogger'

import app from './modules/app'
import router from './modules/router'
import dict from './modules/dict'

Vue.use(Vuex)

const plugins = [createPersistedState()]
if (process.env.NODE_ENV === 'development') {
  plugins.push(createVuexLogger())
}

export default new Vuex.Store({
  state: {
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
    }
  },
  actions: {
  },
  modules: {
    app,
    router,
    dict
  },
  plugins
})
