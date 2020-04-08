<template>
  <a-input placeholder="input with clear icon" allowClear @change="onChange" />
</template>
<script>
export default {
  methods: {
    onChange (e) {
      console.log(e)
    }
  }
}
</script>
