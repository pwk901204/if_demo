// import router from '@/router'
import constantRouter from '@/router/router-config'
import { generatorRouter, generatorDynamicRouter } from '@/router/generator-routers'

// const framework = require('@/core/framework.json')

const permission = {
  namespaced: true,
  state: {
    routers: constantRouter
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.routers = constantRouter.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }) {
      generatorRouter().then(routers => {
        console.log(routers)
        // router.addRoutes(routers)
        commit('SET_ROUTERS', routers)
      })
    },
    GenerateDynamicRoutes ({ commit }) {
      generatorDynamicRouter().then(routers => {
        // router.addRoutes(routers)
        commit('SET_ROUTERS', routers)
      })
    }
  }
}

export default permission
