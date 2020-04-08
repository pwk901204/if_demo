/**
 * @name [经开-信息门户]
 * @author [shangao]
 */

// import BasicLayout from '@/layouts/BasicLayout'
// import RouteView from '@/layouts/RouteView'

export const asyncRouter = [
  {
    path: '/index',
    name: 'index',
    component: () => import('@/packages/jk-xxmh/pages/xxmh'),
    meta: { title: '首页' }
  }
]
