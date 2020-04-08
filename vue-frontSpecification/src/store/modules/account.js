import axios from '@/common/utils/request'
const user = {
  state: {
    token: '',
    avatar: '',
    role: '',
    group: ''
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLE: (state, roles) => {
      state.role = roles
    }
  },
  actions: {
    // 登录
    Login ({ commit }, values) {
      return new Promise((resolve, reject) => {
        axios.mock('mock/account.json', values).then(res => {
          resolve(res)
          commit('SET_AVATAR', res.avatar)
          commit('SET_ROLE', res.role)
        })
      })
    }
  }
}
export default user
