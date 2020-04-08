// import request from '@/common/utils/request'
// import { message } from 'ant-design-vue'
const user = {
  state: {
    roles: [],
    flagRole: false,
    userInfo: {}
  },

  mutations: {
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_FLAG: (state, res) => {
      state.flagRole = res
    },
    SET_USERINFO: (state, res) => {
      state.userInfo = res
    }
  },

  actions: {
    // 登录
    userPower ({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        // request.post('/compila/auth/menuList', {}).then(res => {
        //   let list = res.data
        //   if (!list) {
        //     message.warn('该账号无任何权限')
        //     return
        //   }
        //   if (Array.isArray(list.children)) {
        //     if (list.children.length === 0) {
        //     } else {
        //       resolve(list.children)
        //       commit('SET_ROLES', list.children)
        //     }
        //   }
        // })
        let obj = [{
          path: '/pages/test',
          name: '表格',
          children: [{
            path: '/pages/test/1',
            name: '表格1'
          }, {
            path: '/pages/test/2',
            name: '表格2'
          }, {
            path: '/pages/test/3',
            name: '表格3'
          }, {
            path: '/pages/test/4',
            name: '表格4'
          }]
        }]
        // let router = [
        //   {
        //     path: '/table',
        //     title: '基础展示',
        //     icon: 'iconyichangye',
        //     iconClass: 'change',
        //     children: [
        //       {
        //         path: '/table/process',
        //         title: '表格'
        //       },
        //       {
        //         path: '/pages/form',
        //         title: '表单',
        //         icon: 'iconyichangye',
        //         iconClass: 'menuIcon'
        //       }
        //     ]
        //   }
        // ]
        commit('SET_ROLES', obj)
        resolve(true)
      })
    },
    // 获取用户信息
    GetuserInfo ({ commit }, data) {
      return new Promise((resolve, reject) => {
        // request.post('/compila/auth/getCurrentUserInfo').then(res => {
        //   if (res.data) {
        //     commit('SET_USERINFO', res.data)
        //     resolve(true)
        //   }
        // })
        resolve(true)
      })
    }
  }
}

export default user
