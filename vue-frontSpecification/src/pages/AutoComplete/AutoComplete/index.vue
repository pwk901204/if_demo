<template>
  <div class="page-form">
    <a-card title="1.基本使用">
      <basic-auto></basic-auto>
    </a-card>

    <a-card title="2.查询模式 - 确定类目">
      <search-model-auto></search-model-auto>
    </a-card>

    <a-card title="3.自定义输入组件">
      <custom-auto></custom-auto>
    </a-card>

    <a-card title="4.不区分大小写">
      <not-distinguish-auto></not-distinguish-auto>
    </a-card>

    <a-card title="5.自定义选项">
      <custom-options-auto></custom-options-auto>
    </a-card>

    <a-card title="6.查询模式 - 不确定类目">
      <category-auto></category-auto>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
import BasicAuto from './Components/BasicAuto' // 基本使用
import SearchModelAuto from './Components/SearchModelAuto' // 查询模式 - 确定类目
import CustomAuto from './Components/CustomAuto' // 自定义输入组件
import NotDistinguishAuto from './Components/NotDistinguishAuto' // 不区分大小写
import CustomOptionsAuto from './Components/CustomOptionsAuto' // 自定义选项
import CategoryAuto from './Components/CategoryAuto' // 不确定类目
export default {
  name: 'AutoComplate', // 自动完成
  mixins: [GlobalMixin],
  components: {
    BasicAuto,
    SearchModelAuto,
    CustomAuto,
    NotDistinguishAuto,
    CustomOptionsAuto,
    CategoryAuto
  },
  data () {
    return {
      userName: 'username'
    }
  },
  mounted () {

  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
