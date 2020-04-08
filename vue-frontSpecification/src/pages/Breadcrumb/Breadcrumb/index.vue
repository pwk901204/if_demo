<template>
  <div class="page-form">
    <a-card title="1.基本面包屑">
      <a-breadcrumb>
        <a-breadcrumb-item>Home</a-breadcrumb-item>
        <a-breadcrumb-item><a href="">Application Center</a></a-breadcrumb-item>
        <a-breadcrumb-item><a href="">Application List</a></a-breadcrumb-item>
        <a-breadcrumb-item>An Application</a-breadcrumb-item>
      </a-breadcrumb>
    </a-card>

    <a-card title="2.带有图标的面包屑">
      <a-breadcrumb>
        <a-breadcrumb-item href="">
          <a-icon type="home" />
        </a-breadcrumb-item>
        <a-breadcrumb-item href="">
          <a-icon type="user" />
          <span>Application List</span>
        </a-breadcrumb-item>
        <a-breadcrumb-item>
          Application
        </a-breadcrumb-item>
      </a-breadcrumb>
    </a-card>

    <a-card title="3.分隔符">
      <div>
        <a-breadcrumb separator=">">
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
          <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
          <a-breadcrumb-item>An Application</a-breadcrumb-item>
        </a-breadcrumb>
        <a-breadcrumb>
          <span slot="separator" style="color: red">></span>
          <a-breadcrumb-item>Home</a-breadcrumb-item>
          <a-breadcrumb-item href="">Application Center</a-breadcrumb-item>
          <a-breadcrumb-item href="">Application List</a-breadcrumb-item>
          <a-breadcrumb-item>An Application</a-breadcrumb-item>
        </a-breadcrumb>
      </div>
    </a-card>

    <a-card title="4.vue-router">
      <div>
        <a-breadcrumb :routes="routes">
          <template
            slot="itemRender"
            slot-scope="{ route, params, routes, paths }"
          >
            <span v-if="routes.indexOf(route) === routes.length - 1">
              {{ route.breadcrumbName }}
            </span>
            <router-link v-else :to="`${basePath}/${paths.join('/')}`">
              {{ route.breadcrumbName }}
            </router-link>
          </template>
        </a-breadcrumb>
        <br />
        {{ $route.path }}
      </div>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
export default {
  name: 'DemoForm', // 表单
  mixins: [GlobalMixin],
  data () {
    const { lang } = this.$route.params
    return {
      basePath: `/${lang}/components/breadcrumb`,
      routes: [
        {
          path: 'index',
          breadcrumbName: '首页'
        },
        {
          path: 'first',
          breadcrumbName: '一级面包屑'
        },
        {
          path: 'second',
          breadcrumbName: '当前页面'
        }
      ]
    }
  },
  mounted () {},
  methods: {
    onSearch (value) {
      console.log(value)
    }
  }
}
</script>
<style lang="less" scoped>
@import './index.less';
</style>
