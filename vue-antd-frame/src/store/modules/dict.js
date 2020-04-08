import request from '@/common/utils/request'
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
      return new Promise((resolve, reject) => {
        // axios.post('/base/getDict', { lxjp }).then(res => {
        request.mock('mock/approvalState.json').then(res => {
          const options = res.data || []
          commit('SET_DICT', { options, lxjp })
          resolve(options)
        }).catch(err => {
          reject(err)
          commit('SET_DICT', { options: [], lxjp })
        })
      })
    }
  }
}
