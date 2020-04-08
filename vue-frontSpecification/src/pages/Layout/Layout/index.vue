<template>
  <div class="page-form">
    <a-card title="1.基本结构">
      <div id="components-layout-demo-basic">
        <a-layout>
          <a-layout-header>Header</a-layout-header>
          <a-layout-content>Content</a-layout-content>
          <a-layout-footer>Footer</a-layout-footer>
        </a-layout>

        <a-layout>
          <a-layout-header>Header</a-layout-header>
          <a-layout>
            <a-layout-sider>Sider</a-layout-sider>
            <a-layout-content>Content</a-layout-content>
          </a-layout>
          <a-layout-footer>Footer</a-layout-footer>
        </a-layout>

        <a-layout>
          <a-layout-header>Header</a-layout-header>
          <a-layout>
            <a-layout-content>Content</a-layout-content>
            <a-layout-sider>Sider</a-layout-sider>
          </a-layout>
          <a-layout-footer>Footer</a-layout-footer>
        </a-layout>

        <a-layout>
          <a-layout-sider>Sider</a-layout-sider>
          <a-layout>
            <a-layout-header>Header</a-layout-header>
            <a-layout-content>Content</a-layout-content>
            <a-layout-footer>Footer</a-layout-footer>
          </a-layout>
        </a-layout>
      </div>
    </a-card>

    <a-card title="2.自定义触发器">
      <a-layout id="components-layout-demo-custom-trigger">
        <a-layout-sider :trigger="null" collapsible v-model="collapsed">
          <div class="logo" />
          <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['1']">
            <a-menu-item key="1">
              <a-icon type="user" />
              <span>nav 1</span>
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="video-camera" />
              <span>nav 2</span>
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="upload" />
              <span>nav 3</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header style="background: #fff; padding: 0">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
            />
          </a-layout-header>
          <a-layout-content
            :style="{
              margin: '24px 16px',
              padding: '24px',
              background: '#fff',
              minHeight: '280px'
            }"
          >
            Content
          </a-layout-content>
        </a-layout>
      </a-layout>
    </a-card>

    <a-card title="3.顶部-侧边布局-通栏 ">
      <a-layout id="components-layout-demo-top-side-2">
        <a-layout-header class="header">
          <div class="logo" />
          <a-menu
            theme="dark"
            mode="horizontal"
            :defaultSelectedKeys="['2']"
            :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="1">nav 1</a-menu-item>
            <a-menu-item key="2">nav 2</a-menu-item>
            <a-menu-item key="3">nav 3</a-menu-item>
          </a-menu>
        </a-layout-header>
        <a-layout>
          <a-layout-sider width="200" style="background: #fff">
            <a-menu
              mode="inline"
              :defaultSelectedKeys="['1']"
              :defaultOpenKeys="['sub1']"
              :style="{ height: '100%', borderRight: 0 }"
            >
              <a-sub-menu key="sub1">
                <span slot="title"><a-icon type="user" />subnav 1</span>
                <a-menu-item key="1">option1</a-menu-item>
                <a-menu-item key="2">option2</a-menu-item>
                <a-menu-item key="3">option3</a-menu-item>
                <a-menu-item key="4">option4</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub2">
                <span slot="title"><a-icon type="laptop" />subnav 2</span>
                <a-menu-item key="5">option5</a-menu-item>
                <a-menu-item key="6">option6</a-menu-item>
                <a-menu-item key="7">option7</a-menu-item>
                <a-menu-item key="8">option8</a-menu-item>
              </a-sub-menu>
              <a-sub-menu key="sub3">
                <span slot="title"><a-icon type="notification" />subnav 3</span>
                <a-menu-item key="9">option9</a-menu-item>
                <a-menu-item key="10">option10</a-menu-item>
                <a-menu-item key="11">option11</a-menu-item>
                <a-menu-item key="12">option12</a-menu-item>
              </a-sub-menu>
            </a-menu>
          </a-layout-sider>
          <a-layout style="padding: 0 24px 24px">
            <a-breadcrumb style="margin: 16px 0">
              <a-breadcrumb-item>Home</a-breadcrumb-item>
              <a-breadcrumb-item>List</a-breadcrumb-item>
              <a-breadcrumb-item>App</a-breadcrumb-item>
            </a-breadcrumb>
            <a-layout-content
              :style="{
                background: '#fff',
                padding: '24px',
                margin: 0,
                minHeight: '280px'
              }"
            >
              Content
            </a-layout-content>
          </a-layout>
        </a-layout>
      </a-layout>
    </a-card>

    <a-card title="4.顶部-侧边布局">
      <a-layout id="components-layout-demo-top-side">
        <a-layout-header class="header">
          <div class="logo" />
          <a-menu
            theme="dark"
            mode="horizontal"
            :defaultSelectedKeys="['2']"
            :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="1">nav 1</a-menu-item>
            <a-menu-item key="2">nav 2</a-menu-item>
            <a-menu-item key="3">nav 3</a-menu-item>
          </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>List</a-breadcrumb-item>
            <a-breadcrumb-item>App</a-breadcrumb-item>
          </a-breadcrumb>
          <a-layout style="padding: 24px 0; background: #fff">
            <a-layout-sider width="200" style="background: #fff">
              <a-menu
                mode="inline"
                :defaultSelectedKeys="['1']"
                :defaultOpenKeys="['sub1']"
                style="height: 100%"
              >
                <a-sub-menu key="sub1">
                  <span slot="title"><a-icon type="user" />subnav 1</span>
                  <a-menu-item key="1">option1</a-menu-item>
                  <a-menu-item key="2">option2</a-menu-item>
                  <a-menu-item key="3">option3</a-menu-item>
                  <a-menu-item key="4">option4</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub2">
                  <span slot="title"><a-icon type="laptop" />subnav 2</span>
                  <a-menu-item key="5">option5</a-menu-item>
                  <a-menu-item key="6">option6</a-menu-item>
                  <a-menu-item key="7">option7</a-menu-item>
                  <a-menu-item key="8">option8</a-menu-item>
                </a-sub-menu>
                <a-sub-menu key="sub3">
                  <span slot="title"
                    ><a-icon type="notification" />subnav 3</span
                  >
                  <a-menu-item key="9">option9</a-menu-item>
                  <a-menu-item key="10">option10</a-menu-item>
                  <a-menu-item key="11">option11</a-menu-item>
                  <a-menu-item key="12">option12</a-menu-item>
                </a-sub-menu>
              </a-menu>
            </a-layout-sider>
            <a-layout-content
              :style="{ padding: '0 24px', minHeight: '280px' }"
            >
              Content
            </a-layout-content>
          </a-layout>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer>
      </a-layout>
    </a-card>

    <a-card title="5.上中下布局 ">
      <a-layout id="components-layout-demo-top" class="layout">
        <a-layout-header>
          <div class="logo" />
          <a-menu
            theme="dark"
            mode="horizontal"
            :defaultSelectedKeys="['2']"
            :style="{ lineHeight: '64px' }"
          >
            <a-menu-item key="1">nav 1</a-menu-item>
            <a-menu-item key="2">nav 2</a-menu-item>
            <a-menu-item key="3">nav 3</a-menu-item>
          </a-menu>
        </a-layout-header>
        <a-layout-content style="padding: 0 50px">
          <a-breadcrumb style="margin: 16px 0">
            <a-breadcrumb-item>Home</a-breadcrumb-item>
            <a-breadcrumb-item>List</a-breadcrumb-item>
            <a-breadcrumb-item>App</a-breadcrumb-item>
          </a-breadcrumb>
          <div
            :style="{ background: '#fff', padding: '24px', minHeight: '280px' }"
          >
            Content
          </div>
        </a-layout-content>
        <a-layout-footer style="text-align: center">
          Ant Design ©2018 Created by Ant UED
        </a-layout-footer>
      </a-layout>
    </a-card>
    <a-card title="6.响应式布局">
      <a-layout id="components-layout-demo-responsive">
        <a-layout-sider
          breakpoint="lg"
          collapsedWidth="0"
          @collapse="onCollapse"
          @breakpoint="onBreakpoint"
        >
          <div class="logo" />
          <a-menu theme="dark" mode="inline" :defaultSelectedKeys="['4']">
            <a-menu-item key="1">
              <a-icon type="user" />
              <span class="nav-text">nav 1</span>
            </a-menu-item>
            <a-menu-item key="2">
              <a-icon type="video-camera" />
              <span class="nav-text">nav 2</span>
            </a-menu-item>
            <a-menu-item key="3">
              <a-icon type="upload" />
              <span class="nav-text">nav 3</span>
            </a-menu-item>
            <a-menu-item key="4">
              <a-icon type="user" />
              <span class="nav-text">nav 4</span>
            </a-menu-item>
          </a-menu>
        </a-layout-sider>
        <a-layout>
          <a-layout-header :style="{ background: '#fff', padding: 0 }" />
          <a-layout-content :style="{ margin: '24px 16px 0' }">
            <div
              :style="{
                padding: '24px',
                background: '#fff',
                minHeight: '360px'
              }"
            >
              content
            </div>
          </a-layout-content>
          <a-layout-footer style="textAlign: center">
            Ant Design ©2018 Created by Ant UED
          </a-layout-footer>
        </a-layout>
      </a-layout>
    </a-card>
    <a-card title="7.固定侧边栏">
     <iframe src="/#/index/fixedsider" height="360" width="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>
    </a-card>
    <a-card title="8.固定头部">
     <iframe src="/#/index/fixedhead" height="360" width="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>
    </a-card>
    <a-card title="9.侧边布局">
     <iframe src="/#/index/sidelayout" height="360" width="100%" frameborder="no" border="0" marginwidth="0" marginheight="0"></iframe>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
export default {
  name: 'DemoForm', // 表单
  mixins: [GlobalMixin],
  data () {
    return {
      collapsed: false,
      gdurl: '/public/hh.html'
    }
  },
  mounted () {},
  methods: {
    onSearch (value) {
      console.log(value)
    },
    onCollapse (collapsed, type) {
      console.log(collapsed, type)
    },
    onBreakpoint (broken) {
      console.log(broken)
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
