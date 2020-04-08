<template>
  <div class="page-form">
    <a-card title="1.省市区级联">
      <province-city></province-city>
    </a-card>

    <a-card title="2.允许只选中父级选项">
      <allow-select-parent></allow-select-parent>
    </a-card>

    <a-card title="3.自定义已选项-例如给最后一项加上邮编链接">
      <custom-last-style></custom-last-style>
    </a-card>

    <a-card title="4.可以自定义显示-切换按钮和结果分开">
      <custom-show></custom-show>
    </a-card>

    <a-card title="5.默认值-默认值通过数组的方式指定">
      <default-value></default-value>
    </a-card>

    <a-card title="6.禁用选项">
      <disabled-options></disabled-options>
    </a-card>

    <a-card title="7.移入展开">
      <hover-open></hover-open>
    </a-card>

    <a-card title="8.动态加载选项">
      <dynamic-load></dynamic-load>
      <br />
      <br />
      <a-alert message="loadData 与 showSearch 无法一起使用" banner />
    </a-card>

    <a-card title="9.搜索-可以直接搜索选项并选择">
      <search-and-selected></search-and-selected>
      <br />
      <br />
      <a-alert message="Cascader[showSearch] 暂不支持服务端搜索" banner />
    </a-card>

    <a-card title="10.大小">
      <different-size></different-size>
    </a-card>

    <a-card title="11.自定义字段名">
      <custom-field></custom-field>
    </a-card>

    <a-card title="12.后缀图标">
      <has-icon></has-icon>
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
import ProvinceCity from './Components/ProvinceCity' // 省市区级联
import AllowSelectParent from './Components/AllowSelectParent' // 允许只选中父级选项
import CustomLastStyle from './Components/CustomLastStyle' // 自定义已选项
import CustomShow from './Components/CustomShow' // 可以自定义显示
import DefaultValue from './Components/DefaultValue' // 默认值
import DisabledOptions from './Components/DisabledOptions' // 禁用选项
import HoverOpen from './Components/HoverOpen' // 移入展开
import DynamicLoad from './Components/DynamicLoad' // 动态加载选项
import SearchAndSelected from './Components/SearchAndSelected' // 搜索
import DifferentSize from './Components/DifferentSize' // 大小
import CustomField from './Components/CustomField' // 自定义字段名
import HasIcon from './Components/HasIcon' // 后缀图标
export default {
  name: 'AutoComplate', // 自动完成
  mixins: [GlobalMixin],
  components: {
    ProvinceCity,
    AllowSelectParent,
    CustomLastStyle,
    CustomShow,
    DefaultValue,
    DisabledOptions,
    HoverOpen,
    DynamicLoad,
    SearchAndSelected,
    DifferentSize,
    CustomField,
    HasIcon
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
