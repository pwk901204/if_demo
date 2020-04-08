<template>
  <div class="page-demo-form">
    <group title="客户信息">
      <x-input title="客户名称:" v-model="params.name"></x-input>
      <x-input title="客户单位:" v-model="params.unit"></x-input>
      <x-input title="手机号码:" v-model="params.phone" :max="11"></x-input>
      <x-input title="地址:" v-model="params.address"></x-input>
    </group>

    <group title="问题描述">
      <x-textarea :max="200" v-model="params.content" :show-counter="false" autosize></x-textarea>
    </group>
    <div class="btns plr_15 mt50">
      <x-button type="primary" @click.native="submit">提交</x-button>
    </div>
  </div>
</template>
<script>
import { Group, XInput, XTextarea, XButton } from 'vux'
import { OrderClass, Rules } from './model/order'
export default {
  name: 'DemoForm',
  components: { Group, XInput, XTextarea, XButton },
  data () {
    return {
      params: Object.assign({}, OrderClass)
    }
  },
  beforeMount () {
    let id = this.$route.query.id
    if (id) {
      this.queryData({ id: id })
    }
  },
  methods: {
    // 获取信息
    queryData (params) {
      this.$axios.mock('static/mock/app_orderInfo.json', params).then(res => {
        this.params = res.data
      })
    },
    // 提交
    submit () {
      let params = JSON.parse(JSON.stringify(this.params))
      if (this.$validate(params, Rules)) {
        console.log(params)
      }
    }
  }
}
</script>
