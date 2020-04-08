
/**
 * @name [经开-电子阅览室]
 * @author [shangao]
 */

// import BasicLayout from '@/layouts/BasicLayout'
// import RouteView from '@/layouts/RouteView'

export const asyncRouter = [
  {
    path: '/index',
    name: 'index',
    component: () => import('@/packages/jk-yls/pages/index'),
    meta: { title: '首页' }
  }
]
