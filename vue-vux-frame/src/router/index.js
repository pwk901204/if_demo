import Vue from 'vue'
import Router from 'vue-router'
import TabbarView from '../layouts/TabbarView'
import PageView from '../layouts/PageView'
import Home from '@/pages/tabbar/Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/tabbar/home'
    },
    {
      path: '/tabbar',
      name: 'Tabbar',
      component: TabbarView,
      children: [
        {
          path: '/tabbar/home',
          nmae: 'Home',
          component: Home,
          meta: { title: '首页' }
        },
        {
          path: '/tabbar/my',
          nmae: 'My',
          component: () => import('@/pages/tabbar/My'),
          meta: { title: '个人中心', showHead: false }
        }
      ]
    },
    {
      path: '/demo',
      name: 'Demo',
      component: PageView,
      children: [
        {
          path: '/demo/form',
          name: 'Form',
          component: () => import('@/pages/demo/form/Index'),
          meta: { title: '表单' }
        },
        {
          path: '/demo/scroll',
          name: 'Scroll',
          component: () => import('@/pages/demo/scroll/Index'),
          meta: { title: '下拉刷新和上拉加载' }
        }
      ]
    }
  ]
  // routes: [{
  //   path: '/',
  //   name: 'Index',
  //   component: Index,
  //   meta: { title: 'Vux' }
  // }, {
  //   path: '/order',
  //   name: 'Order',
  //   component: () => import('@/pages/order/Order.vue'),
  //   meta: { title: '新建' }
  // }, {
  //   path: '/register',
  //   name: 'Register',
  //   component: () => import('@/pages/register/Register.vue'),
  //   meta: { title: '注册' }
  // }, {
  //   path: '/order/:id',
  //   name: 'OrderDetail',
  //   component: () => import('@/pages/order/Order.vue'),
  //   meta: { title: '详情' }
  // }, {
  //   path: '/scroller',
  //   name: 'Scroller',
  //   component: () => import('@/pages/scroller/Scroller.vue'),
  //   meta: { title: '滚动加载' }
  // }]
})
