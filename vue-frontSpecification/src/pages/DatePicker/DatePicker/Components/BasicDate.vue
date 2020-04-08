<template>
  <div>
    <a-date-picker @change="onChange" />
    <br />
    <br />
    <a-month-picker @change="onChange" placeholder="Select month" />
    <br />
    <br />
    <a-range-picker @change="onChange" />
    <br />
    <br />
    <a-week-picker @change="onChange" placeholder="Select week" />
  </div>
</template>
<script>
export default {
  methods: {
    onChange (date, dateString) {
      console.log(date, dateString)
    }
  }
}
</script>
