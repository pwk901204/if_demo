<template>
  <view-box ref="viewBox" :body-padding-top="showHead ? '46px' : '0'" body-padding-bottom="54px">
    <!-- 头部 -->
    <x-header
      v-if="showHead"
      slot="header"
      class="page-layout-header vux-1px-b"
      :title="title"
      :left-options="leftOptions"
    >
      <!-- <router-link class="link-feedback" v-if="feedback" slot="right" to="/feedback">
        <img src="../assets/home/feedback.svg" />
      </router-link>-->
      <!-- <div class="right" v-show="feedback" @click="gofeedback">
      <img src="../assets/home/feedback.png" />
      </div>-->
    </x-header>
    <!-- 页面内容 -->
    <router-view class="page-layout"></router-view>
    <!-- 底部按钮 -->
    <tabbar class="page-layout-footer">
      <tabbar-item :selected="path == '/tabbar/home'" link="/tabbar/home">
        <span slot="icon" class="iconfont icon-home"></span>
        <span slot="label">首页</span>
      </tabbar-item>
      <tabbar-item :selected="path == '/tabbar/my'" link="/tabbar/my">
        <span slot="icon" class="iconfont icon-user"></span>
        <span slot="label">个人中心</span>
      </tabbar-item>
    </tabbar>
  </view-box>
</template>
<script>
// import Vue from 'vue'
// import { Home } from '@ant-design/icons-vue'
import { ViewBox, XHeader, Tabbar, TabbarItem } from 'vux'
// console.log(Home)
// Vue.component(Home.name, Home)
// import { mapState } from 'vuex'
export default {
  name: 'TabbarView',
  components: { ViewBox, XHeader, Tabbar, TabbarItem },
  data () {
    return {
      leftOptions: { showBack: false }
    }
  },
  computed: {
    // ...mapState({
    //   borrowNum: state => state.borrowNum > 0 ? state.borrowNum + '' : null
    // }),
    title () {
      return this.$route.meta.title
    },
    path () {
      return this.$route.path
    },
    showHead () {
      let showHead = this.$route.meta.showHead
      showHead = showHead === undefined ? true : showHead
      return showHead
    }
    // feedback () {
    //   return this.$route.meta.feedback
    // }
  }
}
</script>