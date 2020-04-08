export default {
  namespaced: true,
  state: {
    user: {}, // 用户信息
    menus: [] // 用户菜单
  },
  mutations: {
    SET_USER (state, user) {
      state.user = user
    },
    SET_MENUS (state, menus) {
      state.menus = menus
    }
  },
  actions: {
    setUser ({ commit }, user) {
      commit('SET_USER', user)
    },

    setMenus ({ commit }, menus) {
      commit('SET_MENUS', menus)
    }
  }
}
