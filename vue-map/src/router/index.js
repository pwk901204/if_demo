import Vue from 'vue'
import VueRouter from 'vue-router'
import MenuView from '@/layouts/MenuView'
import PageView from '@/layouts/PageView'
import store from '../store/index'

Vue.use(VueRouter)

const router = new VueRouter({
  mode: 'hash',
  routes: [
    {
      path: '/',
      name: '地图管理系统',
      component: MenuView,
      icon: 'none',
      redirect: '/system/map',
      children: [
        {
          path: '/system',
          name: '地图设置',
          icon: 'setting',
          component: PageView,
          redirect: '/system/map',
          children: [
            {
              path: '/system/map',
              name: '地图管理',
              icon: 'none',
              component: () => import('@/pages/system/map/list')
            },
            {
              path: '/system/point',
              name: '点位类型',
              icon: 'none',
              component: () => import('@/pages/system/point/list')
            }
          ]
        },
        {
          path: '/config',
          name: '点位管理',
          icon: 'hdd',
          component: PageView,
          redirect: '/config/point',
          children: [
            {
              path: '/config/point',
              name: '标记点位',
              icon: 'none',
              component: () => import('@/pages/config/point/map-point')
            },
            {
              path: '/config/route',
              name: '规划路径',
              icon: 'none',
              component: () => import('@/pages/config/route/map-path')
            }
          ]
        },
        {
          path: '/preview',
          name: '地图预览',
          icon: 'dribbble',
          component: () => import('@/pages/preview/index')
        }
      ]
    },
    // 异常页面
    {
      path: '*',
      component: () => import('@/common/components/exception/404.vue')
    }
  ],
  // scroll to page top
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
// 添加页面title
router.beforeEach((to, from, next) => {
  if ((typeof to.name !== 'undefined')) document.title = `${to.name} - ${store.state.setting.systemName}`
  next()
})
router.afterEach((to, from) => {
  store.commit('INIT_SPINNIN')
})

export default router
