import router from './router'
import store from './store'
import NProgress from 'nprogress' // 加载进度条
import 'nprogress/nprogress.css' // 加载进度条样式
import { notification } from 'ant-design-vue'
router.beforeEach((to, from, next) => {
  if (to.meta && (typeof to.meta.title !== 'undefined')) document.title = to.meta.title + `-科大讯飞`
  NProgress.start() // 进度开始
  if (store.getters.roles.length === 0) {
    store.dispatch('userPower').then(res => {
      // 获取用户信息
      store.dispatch('GetuserInfo').then(res => {
        const redirect = decodeURIComponent(from.query.redirect || to.path)
        if (to.path === redirect) {
          next({ ...to, replace: true })
        } else {
          // 跳转到目的路由
          next({ path: redirect })
        }
      })
    }).catch(() => {
      notification.error({
        message: '错误',
        description: '请求用户信息失败，请重试'
      })
    })
  } else {
    next()
  }
})

router.afterEach((to) => {
  NProgress.done()
})
