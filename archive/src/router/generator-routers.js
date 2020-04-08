// eslint-disable-next-line
// import * as loginService from '@/api/login'
// eslint-disable-next-line
import axios from '../utils/request'
import router from '@/router'
import BasicLayout from '@/layouts/BasicLayout'
import RouteView from '@/layouts/RouteView'

// const _import = require('./router/_import_' + process.env.NODE_ENV)
// console.log(_import)

const framework = require('@/core/framework.json')
// console.log(framework)
// import { BasicLayout, RouteView } from '@/layouts'

// 前端路由表
const constantRouterComponents = {
  // 基础页面 layout 必须引入
  BasicLayout: BasicLayout,
  RouteView: RouteView,
  // '/': BasicLayout,
  // 你需要动态引入的页面组件
  '/': BasicLayout,
  '/yls': () => import('@/packages/jk-yls/pages/index'),
  '/xxmh': () => import('@/packages/jk-xxmh/pages/xxmh')
}

// 前端未找到页面路由（固定不用改）
const notFoundRouter = {
  path: '*', redirect: '/404', hidden: true
}

// 根级菜单
const rootRouter = {
  // key: '',
  name: 'index',
  path: '/',
  component: BasicLayout,
  // redirect: '/dashboard',
  meta: {
    title: '首页'
  },
  children: []
}

function addRoot (root, list) {
  for (let i = 0; i < list.length; i++) {
    const item = list[i]
    item.path = `/${root}${item.path}`
    item.name = `${root}-${item.name}`
    const component = item.component
    if (component in constantRouterComponents) {
      item.component = constantRouterComponents[component]
    } else {
      const path = `${item.component}.vue`
      item.component = () => import(`@/${path}`)
    }
    if (item.children && item.children.length > 0) {
      item.children = addRoot(root, item.children)
    }
  }
}

/**
 * 静态生成菜单
 */
export const generatorRouter = () => {
  return new Promise((resolve) => {
    const data = JSON.parse(JSON.stringify(framework.data))
    const all = []
    for (const key in data) {
      const project = {
        path: `/${key}`,
        name: key,
        component: BasicLayout,
        children: [],
        meta: { title: data[key].name }
      }
      const routers = data[key].routers
      addRoot(key, routers)
      project.children = routers
      all.push(project)
      router.addRoutes([project])
    }
    resolve(all)
  })
}

/**
 * 动态生成菜单
 */
export const generatorDynamicRouter = () => {
  return new Promise((resolve, reject) => {
    axios.mock('/mock/nav.json').then(res => {
      console.log('res', res)
      const { list } = res
      const menuNav = []
      const childrenNav = []
      //      后端数据, 根级树数组,  根级 PID
      listToTree(list, childrenNav, 0)
      rootRouter.children = childrenNav
      menuNav.push(rootRouter)
      // console.log('menuNav', menuNav)
      const routers = generator(menuNav)
      routers.push(notFoundRouter)
      // console.log('routers', routers)
      resolve(routers)
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * 格式化树形结构数据 生成 vue-router 层级路由表
 *
 * @param routerMap
 * @param parent
 * @returns {*}
 */
export const generator = (routerMap, parent) => {
  return routerMap.map(item => {
    const { title, hideChildren, hiddenHeaderContent, target, icon } = item.meta || {}
    // console.log(constantRouterComponents[item.path])
    const currentRouter = {
      // 如果路由设置了 path，则作为默认 path，否则 路由地址 动态拼接生成如 /dashboard/workplace
      path: item.path,
      // 路由名称，建议唯一
      name: item.name,
      // 该路由对应页面的 组件 :方案1
      // component: constantRouterComponents[item.component || item.key],
      // 该路由对应页面的 组件 :方案2 (动态加载)
      component: (constantRouterComponents[item.path]) || BasicLayout,

      // meta: 页面标题, 菜单图标, 页面权限(供指令权限用，可去掉)
      meta: {
        title: title,
        icon: icon || undefined,
        hiddenHeaderContent: hiddenHeaderContent,
        target: target,
        permission: item.name
      }
    }
    // 是否设置了隐藏菜单
    // if (show === false) {
    //   currentRouter.hidden = true
    // }
    // 是否设置了隐藏子菜单
    if (hideChildren) {
      currentRouter.hideChildrenInMenu = true
    }
    // 为了防止出现后端返回结果不规范，处理有可能出现拼接出两个 反斜杠
    // if (!currentRouter.path.startsWith('http')) {
    //   currentRouter.path = currentRouter.path.replace('//', '/')
    // }
    // 重定向
    item.redirect && (currentRouter.redirect = item.redirect)
    // 是否有子菜单，并递归处理
    if (item.children && item.children.length > 0) {
      // Recursion
      currentRouter.children = generator(item.children, currentRouter)
    }
    return currentRouter
  })
}

/**
 * 数组转树形结构
 * @param list 源数组
 * @param tree 树
 * @param parentId 父ID
 */
const listToTree = (list, tree, parentId) => {
  list.forEach(item => {
    // 判断是否为父级菜单
    if (item.parentId === parentId) {
      const child = {
        ...item,
        key: item.key || item.name,
        children: []
      }
      // 迭代 list， 找到当前菜单相符合的所有子菜单
      listToTree(list, child.children, item.id)
      // 删掉不存在 children 值的属性
      if (child.children.length <= 0) {
        delete child.children
      }
      // 加入到树中
      tree.push(child)
    }
  })
}
