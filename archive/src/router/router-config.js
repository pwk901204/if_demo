/**
 * @name [档案项目]
 * @author [shangao]
 */

import BasicLayout from '../layouts/BasicLayout'
// import RouteView from '@/layouts/RouteView'
// import { asyncRouter as packageRouter } from '@/packages/jk-xxmh/router'

// 异步路由
const asyncRouter = [
  // {
  //   path: '/common',
  //   name: 'Common',
  //   component: BasicLayout,
  //   meta: { title: '公用模块' },
  //   children: [
  {
    path: '/common',
    name: 'Common',
    component: BasicLayout,
    // redirect: '/exception/403',
    meta: { title: '公用模块', icon: 'global' },
    children: [
      {
        path: '/exception/403',
        name: 'Exception403',
        component: () => import(/* webpackChunkName: "exception" */ '@/pages/exception/403'),
        meta: { title: '403' }
      },
      {
        path: '/exception/404',
        name: 'Exception404',
        component: () => import(/* webpackChunkName: "exception" */ '@/pages/exception/404'),
        meta: { title: '404' }
      },
      {
        path: '/exception/500',
        name: 'Exception500',
        component: () => import(/* webpackChunkName: "exception" */ '@/pages/exception/500'),
        meta: { title: '500' }
      },
      {
        path: '/common/message',
        name: 'Message',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/common/message'),
        meta: { title: '查看更多' }
      }
    ]
  }
  //   ]
  // }
]

// 基础路由
const constantRouter = [
  {
    path: '/tutorial',
    name: 'Tutorial',
    component: BasicLayout,
    meta: { title: '教程', icon: 'book' },
    children: [
      {
        path: '/tutorial/table',
        name: 'Table',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/tutorial/tutorial-list'),
        meta: { title: '基础表格' }
      },
      {
        path: '/tutorial/tree',
        name: 'Tree',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/tutorial/tree'),
        meta: { title: '可编辑tree' }
      },
      {
        path: '/tutorial/IMOnline',
        name: 'IMOnline',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/tutorial/IMOnline'),
        meta: { title: 'IM聊天' }
      },
      {
        path: '/tutorial/contentTree',
        name: 'ContentTree',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/tutorial/contentTree'),
        meta: { title: '目录树' }
      },
      {
        path: '/tutorial/editor',
        name: 'Editor',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/tutorial/editor'),
        meta: { title: '富文本编辑器' }
      },
      {
        path: '/tutorial/preview',
        name: 'Preview',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/tutorial/preview'),
        meta: { title: '文件预览' }
      },
      {
        path: '/tutorial/iconFont',
        name: 'IconFont',
        component: () => import(/* webpackChunkName: "tutorial" */ '@/pages/tutorial/icon-font'),
        meta: { title: 'IconFont' }
      }
    ]
  },
  {
    path: '/framework',
    name: 'Framework',
    component: BasicLayout,
    meta: { title: '框架', icon: 'sketch' },
    children: [
      {
        path: '/framework/project',
        name: 'Project',
        component: () => import(/* webpackChunkName: "framework" */ '@/pages/framework/project/project-list'),
        meta: { title: '项目列表' }
      },
      {
        path: '/framework/role',
        name: 'Role',
        component: () => import(/* webpackChunkName: "framework" */ '@/pages/framework/role/role-list'),
        meta: { title: '角色列表' }
      }
    ]
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "exception" */ '@/pages/exception/404')
  }
]

// 没有权限控制
// const routes = constantRouter.concat(asyncRouter, packageRouter)
const routes = constantRouter.concat(asyncRouter)

export default routes
