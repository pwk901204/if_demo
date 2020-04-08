<template>
  <a-row :gutter="24">
    <a-col v-for="(item,index) in formItems" :key="index" :span="item.col">
      <a-form-item
        :label="item.label"
        :label-col="formItemLayout.labelCol"
        :wrapper-col="formItemLayout.wrapperCol"
      >
        <!-- input -->
        <a-input
          v-if="item.type === 'input' || item.type === 'password'"
          v-decorator="item.decorator"
          :placeholder="item.placeholder || ''"
          :maxlength="item.maxlength ? item.maxlength : null"
          :type="item.type"
        />
        <!-- select -->
        <a-select
          v-if="item.type === 'select'"
          v-decorator="item.decorator"
          :placeholder="item.placeholder"
          :options="item.options"
          allowClear
        />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
const cloneDeep = require('lodash.clonedeep')
export default {
  name: 'StandardForm',
  props: {
    config: {
      type: Array,
      required: true
    },
    formItemLayout: {
      type: Object,
      default: () => {
        return {
          labelCol: { span: 4 },
          wrapperCol: { span: 8 }
        }
      }
    }
  },
  data () {
    return {
      formItems: []
    }
  },
  created () {
    // 深拷贝一份配置
    let formItems = cloneDeep(this.config)

    formItems.forEach((item, index) => {
      if (item.type === 'select') {
        item.options = []
        this.getDict(item.lxjp, index)
      }
    })

    this.formItems = formItems
  },
  methods: {
    // 获取类型字典项
    getDict (lxjp, index) {
      this.$axios.mock('mock/degree.json', { lxjp }).then(res => {
        this.formItems[index].options = res.data || []
      })
    }
  }
}
</script>
