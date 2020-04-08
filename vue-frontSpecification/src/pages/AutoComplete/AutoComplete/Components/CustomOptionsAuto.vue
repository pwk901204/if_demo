<template>
  <a-auto-complete style="width: 200px" @search="handleSearch" placeholder="input here">
    <template slot="dataSource">
      <a-select-option v-for="email in result" :key="email">{{email}}</a-select-option>
    </template>
  </a-auto-complete>
</template>
<script>
export default {
  data () {
    return {
      result: []
    }
  },
  methods: {
    handleSearch (value) {
      let result
      if (!value || value.indexOf('@') >= 0) {
        result = []
      } else {
        result = ['gmail.com', '163.com', 'qq.com'].map(
          domain => `${value}@${domain}`
        )
      }
      this.result = result
    }
  }
}
</script>
