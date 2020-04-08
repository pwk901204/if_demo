import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/pages/Login/Login'
import MenuView from '@/layouts/MenuView'
import PageView from '@/layouts/PageView'
// import RouteView from '@/layouts/RouteView'

Vue.use(VueRouter)

const router = new VueRouter({
  routes: [
    {
      path: '/login',
      name: '登录页',
      component: Login
    },
    {
      path: '/',
      name: 'vue-antd',
      component: MenuView,
      redirect: '/table',
      children: [
        {
          path: '/table',
          name: '基础展示',
          icon: 'iconyichangye',
          iconClass: 'change',
          component: PageView,
          redirect: '/table/process',
          children: [
            {
              path: '/table/process',
              name: '表格',
              component: () => import('@/pages/table/index')
            },
            {
              path: '/pages/form',
              name: '表单',
              icon: 'iconyichangye',
              iconClass: 'menuIcon',
              component: () => import('@/pages/form/index')
            }
          ]
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
      return {
        x: 0,
        y: 0
      }
    }
  }
})
export default router
