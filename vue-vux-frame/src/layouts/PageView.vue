<template>
  <view-box ref="viewBox" :body-padding-top="showHead ? '46px' : '0'" body-padding-bottom="0">
    <x-header
      v-if="showHead"
      slot="header"
      class="page-layout-header vux-1px-b"
      :title="title"
      :left-options="leftOptions"
    >
    </x-header>
    <router-view class="page-layout"></router-view>
  </view-box>
</template>

<script>
import { ViewBox, XHeader } from 'vux'
export default {
  name: 'PageView',
  components: { ViewBox, XHeader },
  data () {
    return {
      leftOptions: { backText: '' }
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    },
    showHead () {
      let showHead = this.$route.meta.showHead
      showHead = showHead === undefined ? true : showHead
      return showHead
    }
  }
}
</script>
