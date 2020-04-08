<template>
  <div>
    <a-date-picker showTime
                   placeholder="Select Time"
                   @change="onChange"
                   @ok="onOk" />
    <br />
    <a-range-picker :showTime="{ format: 'HH:mm' }"
                    format="YYYY-MM-DD HH:mm"
                    :placeholder="['Start Time', 'End Time']"
                    @change="onChange"
                    @ok="onOk" />
  </div>
</template>
<script>
export default {
  methods: {
    onChange (value, dateString) {
      console.log('Selected Time: ', value)
      console.log('Formatted Selected Time: ', dateString)
    },
    onOk (value) {
      console.log('onOk: ', value)
    }
  }
}
</script>
