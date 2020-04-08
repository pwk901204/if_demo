import axios from '@/common/utils/request'

export default {
  namespaced: true,
  state: {
    approvalState: []
  },
  mutations: {
    SET_DICT (state, { options, lxjp }) {
      state[lxjp] = options
    }
  },
  actions: {
    fetchDict ({ commit, state }, lxjp) {
      if (lxjp in state && state[lxjp].length > 0) {
        return
      }
      axios.mock('mock/approvalState.json').then(res => {
        const options = res.data || []
        commit('SET_DICT', { options, lxjp })
      }).catch(err => {
        console.log(err)
        commit('SET_DICT', { options: [], lxjp })
      })
    }
  }
}
