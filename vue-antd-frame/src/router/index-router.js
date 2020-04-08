import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/pages/Login/Login'
import MenuView from '@/layouts/MenuView'
import PageView from '@/layouts/PageView'
import RouteView from '@/layouts/RouteView'
Vue.use(VueRouter)
export const router = () => {
  return new Promise((resolve, reject) => {
    let res = [{
      path: '/pages/test/1',
      name: '表格1',
      component: () => import('@/pages/test')
    }, {
      path: '/pages/test/2',
      name: '表格2',
      component: () => import('@/pages/test')
    }, {
      path: '/pages/test/3',
      name: '表格3',
      component: () => import('@/pages/test')
    }, {
      path: '/pages/test/4',
      name: '表格4',
      component: () => import('@/pages/test')
    }]

    let data = [
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
              },
              {
                path: '/pages/test',
                name: '表单',
                component: RouteView,
                redirect: '/pages/test/1',
                children: res
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
    ]
    console.log(data)
    resolve(new VueRouter({
      routes: data,
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
    }))
  })
}
