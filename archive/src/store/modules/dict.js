import axios from '@/utils/request'
const dict = {
  namespaced: true,
  state: {
    contentTreeDict: []
  },
  mutations: {
    SET_DICT: (state, { type, dict }) => {
      state[type] = dict
    }
  },
  actions: {
    async getDict ({ commit }, type) {
      const res = await axios.mock('/content/tree')
      commit('SET_DICT', {
        type,
        dict: res.data
      })
    }
  }
}

export default dict
