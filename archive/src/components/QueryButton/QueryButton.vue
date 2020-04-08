<template>
  <a-form-item :style="style">
    <!-- <div class="component-query-button"> -->
    <!-- <span
      class="table-page-search-submitButtons"
      :style="advanced && { float: 'right', overflow: 'hidden' } || {} "
    >-->
    <a-button type="primary" @click="onSearch">查询</a-button>
    <a-button style="margin-left: 8px" @click="onReset">重置</a-button>
    <a @click="toggleAdvanced" style="margin-left: 8px">
      {{ advanced ? '收起' : '展开' }}
      <a-icon :type="advanced ? 'up' : 'down'" />
    </a>
    <!-- </span> -->
  </a-form-item>
</template>
<script>
export default {
  props: {
    form: { required: true, type: Object }
  },
  data () {
    return {
      advanced: false
    }
  },
  computed: {
    style: function () {
      if (this.advanced) {
        return { 'text-align': 'right', width: '33.3%' }
      } else {
        return { 'text-align': 'right', width: '99.9%' }
      }
    }
  },
  methods: {
    toggleAdvanced () {
      this.advanced = !this.advanced
      this.$emit('toggle')
    },
    onSearch () {

    },
    onReset () {
      this.form.resetFields()
    }
  }
}
</script>
