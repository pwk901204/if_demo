<template>
  <div class="page-form">
    <a-card title="1.基础输入框">
      <a-input placeholder="Basic usage" />
    </a-card>

    <a-card title="2.自适应高度输入框，适用于textarea">
      <a-textarea placeholder="Autosize height based on content lines" autosize />
      <div style="margin: 24px 0" />
      <a-textarea placeholder="Autosize height with minimum and maximum number of lines" :autosize="{ minRows: 2, maxRows: 6 }" />
    </a-card>

    <a-card title="3.在输入框上添加前缀或后缀图标">
      <a-input placeholder="Basic usage" v-model="userName" ref="userNameInput">
        <a-icon slot="prefix" type="user" />
        <a-tooltip slot="suffix" title="Extra information">
          <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
        </a-tooltip>
      </a-input>
    </a-card>

    <a-card title="4.带有搜索按钮的输入框">
      <a-input-search placeholder="input search text" style="width: 200px" @search="onSearch" />
      <br /><br />
      <a-input-search placeholder="input search text" @search="onSearch" enterButton />
      <br /><br />
      <a-input-search
        placeholder="input search text"
        @search="onSearch"
        enterButton="Search"
        size="large"
      />
      <br /><br />
      <a-input-search placeholder="input search text" @search="onSearch" size="large">
        <a-button slot="enterButton">Custom</a-button>
      </a-input-search>
    </a-card>

    <a-card title="5.输入框三种尺寸大小">
      <a-input size="large" placeholder="large size" />
      <br /><br />
      <a-input placeholder="default size" />
      <br /><br />
      <a-input size="small" placeholder="small size" />
    </a-card>

    <a-card title="6.输入框的组合">
      <compact-input></compact-input>
    </a-card>

    <a-card title="7.多行文本框">
      <a-textarea placeholder="Basic usage" :rows="4" />
    </a-card>

    <a-card title="8.前置/后置标签">
      <label-input></label-input>
    </a-card>

    <a-card title="9.输入时格式化展示">
      <format-show-input></format-show-input>
    </a-card>

    <a-card title="10.带移除图标">
      <remove-icon-input></remove-icon-input>
    </a-card>

    <a-card title="11.密码框">
      <a-input-password placeholder="input password" />
    </a-card>
  </div>
</template>

<script>
import GlobalMixin from '@/mixins/global'
import CompactInput from './CompactInput' // 组合输入框
import LabelInput from './LabelInput' // 前置/后置标签
import FormatShowInput from './FormatShowInput' // 输入时格式化展示
import RemoveIconInput from './RemoveIconInput' // 带移除图标
export default {
  name: 'DemoForm', // 表单
  mixins: [GlobalMixin],
  components: {
    CompactInput,
    LabelInput,
    FormatShowInput,
    RemoveIconInput
  },
  data () {
    return {
      userName: 'username'
    }
  },
  mounted () {

  },
  methods: {
    onSearch (value) {
      console.log(value)
    }
  }
}
</script>
<style lang="less" scoped>
@import "./index.less";
</style>
