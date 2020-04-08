<template>
  <a-auto-complete
    :dataSource="dataSource"
    style="width: 200px"
    @select="onSelect"
    @search="handleSearch"
    placeholder="input here"
  />
</template>
<script>
export default {
  data () {
    return {
      dataSource: []
    }
  },
  methods: {
    handleSearch (value) {
      this.dataSource = !value
        ? []
        : [value, value + value, value + value + value]
    },
    onSelect (value) {
      console.log('onSelect', value)
    }
  }
}
</script>
