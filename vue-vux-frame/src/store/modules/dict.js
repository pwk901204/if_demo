import axios from '@/common/ability/request'

export default {
  namespaced: true,
  state: {

  },

  mutations: {
    SET_DICT (state, { options, lxjp }) {
      state[lxjp] = options
    }
  },
  actions: {
    fetchDict ({ commit, state }, lxjp) {
      // if (lxjp in state && state[lxjp].length > 0) {
      //   return
      // }
      axios.post('/api/common/dict', { lxjp }).then(res => {
        const options = res.data || []
        commit('SET_DICT', { options, lxjp })
      }).catch(err => {
        console.log(err)
        commit('SET_DICT', { options: [], lxjp })
      })
    }
  }
}
