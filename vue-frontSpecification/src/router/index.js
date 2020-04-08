import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/pages/login/Login'
import MenuView from '@/layouts/MenuView'
import PageView from '@/layouts/PageView'
import store from '../store/index'
Vue.use(VueRouter)
// eslint-disable-next-line
const router = new VueRouter({
  routes: [{
    path: '/login',
    name: '登录页',
    component: Login
  },
  {
    path: '/pages/valid',
    name: '表单校验(开发中)',
    component: () => import('@/pages/baseForm/valid/index')
  },
  {
    path: '/',
    name: '首页',
    component: MenuView,
    redirect: '/from',
    children: [{
      path: '/from',
      name: '表单页',
      icon: 'iconbiaodanye',
      iconClass: 'change',
      component: PageView,
      redirect: '/from/base',
      children: [{
        path: '/from/base',
        name: '基础表单',
        meta: { pathFile: 'pages/baseForm/table' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/baseForm/table/index')
      },
      {
        path: '/from/form',
        name: '分布表单',
        meta: { pathFile: 'pages/baseForm/form' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/baseForm/form/index')
      },
      {
        path: '/from/advanced',
        name: '高级表单',
        meta: { pathFile: 'pages/baseForm/advanced' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/baseForm/advanced/index')
      },
      {
        path: '/from/validAtd',
        name: '表单校验',
        icon: 'icontongyong',
        iconClass: 'change',
        meta: { pathFile: 'pages/baseForm/validAtd' },
        component: () => import('@/pages/baseForm/validAtd/index')
      }]
    },
    {
      path: '/pages/list',
      name: '列表页',
      icon: 'iconliebiaoye',
      iconClass: 'change',
      component: PageView,
      redirect: '/pages/list/base',
      children: [
        /* {
          path: '/pages/list/base',
          name: '基础列表',
          icon: 'icontongyong',
          iconClass: 'change',
          meta: { pathFile: 'pages/List/base' },
          component: () => import('@/pages/List/base')
        }, */
        {
          path: '/pages/list/baseList',
          name: '基础列表',
          icon: 'icontongyong',
          iconClass: 'change',
          meta: { pathFile: 'pages/List/baseList' },
          component: () => import('@/pages/List/baseList')
        },
        {
          path: '/pages/list/advanced',
          name: '高级列表',
          icon: 'icontongyong',
          meta: { pathFile: 'pages/List/advanced' },
          iconClass: 'change',
          component: () => import('@/pages/List/advanced')
        },
        {
          path: '/pages/list/searchlist',
          name: '查询列表',
          icon: 'icontongyong',
          meta: { pathFile: 'pages/List/searchList' },
          iconClass: 'change',
          component: () => import('@/pages/List/searchList')
        }]
    },
    {
      path: '/pages/error',
      name: '异常页',
      icon: 'iconyichangye',
      iconClass: 'change',
      redirect: '/pages/error/403',
      component: PageView,
      children: [{
        path: '/pages/error/403',
        name: '403',
        meta: { pathFile: 'pages/Error/403' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/common/components/exception/403')
      },
      {
        path: '/pages/error/404',
        name: '404',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Error/404' },
        iconClass: 'change',
        component: () => import('@/common/components/exception/404')
      },
      {
        path: '/pages/error/500',
        name: '500',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Error/500' },
        iconClass: 'change',
        component: () => import('@/common/components/exception/500')
      }]
    },
    {
      path: '/pages/chart',
      name: '可视化图表',
      icon: 'iconkeshihuatubiao',
      iconClass: 'change',
      redirect: '/pages/chart/pie',
      component: PageView,
      children: [{
        path: '/pages/chart/pie',
        name: '饼图',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Chart/pie' },
        iconClass: 'change',
        component: () => import('@/pages/Echart/pie')
      },
      {
        path: '/pages/chart/radar',
        name: '漏斗',
        meta: { pathFile: 'pages/Chart/radar' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/radar')
      },
      {
        path: '/pages/chart/gauge',
        name: '仪表盘',
        meta: { pathFile: 'pages/Chart/gauge' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/gauge')
      },
      {
        path: '/pages/chart/hot',
        name: '热力图',
        meta: { pathFile: 'pages/Chart/hot' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/hot')
      },
      {
        path: '/pages/chart/gx',
        name: '关系图',
        meta: { pathFile: 'pages/Chart/gx' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/gx')
      },
      {
        path: '/pages/chart/zhu',
        name: '柱状图',
        meta: { pathFile: 'pages/Chart/zhu' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/zhu')
      },
      {
        path: '/pages/Echart/worldmap',
        name: '世界地图',
        meta: { pathFile: 'pages/Chart/worldMap' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/worldMap')
      },
      {
        path: '/pages/Echart/chinaMap',
        name: '中国地图',
        meta: { pathFile: 'pages/Chart/chinaMap' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/chinaMap')
      },
      {
        path: '/pages/Echart/blendChart',
        name: '混合折线图',
        meta: { pathFile: 'pages/Chart/blendChart' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Echart/blendChart')
      }]
    },
    {
      path: '/pages/map',
      name: '地图',
      icon: 'iconiconset0396',
      iconClass: 'change',
      redirect: '/pages/map',
      component: PageView,
      children: [{
        path: '/pages/map/bmap',
        name: '百度地图',
        meta: { pathFile: 'pages/Map/bmap' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Map/BMap')
      },
      {
        path: '/pages/map/supermap',
        name: '超图',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Map/supermap' },
        iconClass: 'change',
        component: () => import('@/pages/Map/SuperMap')
      },
      {
        path: '/pages/map/iflymap',
        name: 'IFlyMap',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Map/iflymap' },
        iconClass: 'change',
        component: () => import('@/pages/Map/IFlyMap')
      }]
    },
    {
      path: '/pages/detail',
      name: '详情页',
      icon: 'iconxiangqingye',
      iconClass: 'change',
      component: PageView,
      redirect: '/pages/detail/base',
      children: [{
        path: '/pages/detail/base',
        name: '基础详情页',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Detail/base' },
        iconClass: 'change',
        component: () => import('@/pages/Detail/base')
      },
      {
        path: '/pages/detail/advanced',
        name: '高级详情页',
        meta: { pathFile: 'pages/Detail/advanced' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Detail/advanced')
      }]
    },
    {
      path: '/pages/result',
      name: '结果页',
      icon: 'iconjieguoye',
      redirect: '/pages/result/base',
      iconClass: 'change',
      component: PageView,
      children: [{
        path: '/pages/result/base',
        name: '成功',
        meta: { pathFile: 'pages/Result/base' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Result/base')
      },
      {
        path: '/pages/result/advanced',
        name: '失败',
        meta: { pathFile: 'pages/Result/advanced' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/Result/advanced')
      }]
    },
    {
      path: '/pages',
      name: '页面控件',
      icon: 'iconkongjian',
      iconClass: 'change',
      redirect: '/pages/map',
      component: PageView,
      children: [{
        path: '/pages/widget/treeselect',
        name: 'TreeSelect',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Widget/treeselect' },
        iconClass: 'change',
        component: () => import('@/pages/Widget/TreeSelect')
      },
      {
        path: '/pages/widget/tree',
        name: 'Tree',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Widget/tree' },
        iconClass: 'change',
        component: () => import('@/pages/Widget/Tree')
      },
      {
        path: '/pages/input/input',
        name: '输入框',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Input/input' },
        iconClass: 'change',
        component: () => import('@/pages/Input/Input')
      },
      {
        path: '/pages/button/button',
        name: '按钮',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Button/button' },
        iconClass: 'change',
        component: () => import('@/pages/Button/Button')
      },
      {
        path: '/pages/grid/grid',
        name: '栅格',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Grid/grid' },
        iconClass: 'change',
        component: () => import('@/pages/Grid/Grid')
      },
      {
        path: '/pages/layout/layout',
        name: '布局',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Layout/layout' },
        iconClass: 'change',
        component: () => import('@/pages/Layout/Layout')
      },
      {
        path: '/pages/breadcrumb/breadcrumb',
        name: '面包屑布局',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Breadcrumb/breadcrumb' },
        iconClass: 'change',
        component: () => import('@/pages/Breadcrumb/Breadcrumb')
      },
      {
        path: '/pages/icon/icon',
        name: '图标',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Icon/icon' },
        iconClass: 'change',
        component: () => import('@/pages/Icon/Icon')
      },
      {
        path: '/pages/autocomplete/autocomplete',
        name: '自动完成',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/AutoComplete/AutoComplete' },
        iconClass: 'change',
        component: () => import('@/pages/AutoComplete/AutoComplete')
      },
      {
        path: '/pages/cascader/cascader',
        name: '级联选择',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Cascader/Cascader' },
        iconClass: 'change',
        component: () => import('@/pages/Cascader/Cascader')
      },
      {
        path: '/pages/datepicker/datepicker',
        name: '日期选择框',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/DatePicker/DatePicker' },
        iconClass: 'change',
        component: () => import('@/pages/DatePicker/DatePicker')
      },
      {
        path: '/pages/upload/upload',
        name: '附件上传',
        icon: 'icontongyong',
        meta: { pathFile: 'pages/Upload/Upload' },
        iconClass: 'change',
        component: () => import('@/pages/Upload/Upload')
      }]
    },
    {
      path: '/pages/feedback',
      name: '组件二次封装',
      icon: 'iconiconset0396',
      iconClass: 'change',
      redirect: '/pages/feedback',
      component: PageView,
      children: [{
        path: '/pages/feedback/modal',
        name: '对话框',
        meta: { pathFile: 'pages/feedback/modal' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/feedback/Modal')
      },
      {
        path: '/pages/feedback/modalDrag',
        name: '可拖拽对话框',
        meta: { pathFile: 'pages/feedback/modalDrag' },
        icon: 'icontongyong',
        iconClass: 'change',
        component: () => import('@/pages/feedback/modalDrag')
      }]
    },
    // {
    //   path: '/index/fixedsider',
    //   name: 'dispatch-info',
    //   component: resolve =>
    //     require(['@/pages/Layout/Layout/fixedsider.vue'], resolve)
    // },
    // {
    //   path: '/index/fixedhead',
    //   name: 'dispatch-info',
    //   component: resolve =>
    //     require(['@/pages/Layout/Layout/fixedhead.vue'], resolve)
    // },
    // {
    //   path: '/index/sidelayout',
    //   name: 'dispatch-info',
    //   component: resolve =>
    //     require(['@/pages/Layout/Layout/sidelayout.vue'], resolve)
    // },
    // 异常页面
    {
      path: '*',
      component: () => import('@/common/components/exception/404.vue')
    }]
  }]
})
export default router
