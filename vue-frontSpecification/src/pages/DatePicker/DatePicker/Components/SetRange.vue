<template>
  <div>
    <a-range-picker :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
                    @change="onChange" />
    <br />
    <br />
    <a-range-picker :ranges="{ Today: [moment(), moment()], 'This Month': [moment(), moment().endOf('month')] }"
                    showTime
                    format="YYYY/MM/DD HH:mm:ss"
                    @change="onChange" />
  </div>
</template>
<script>
import moment from 'moment'
export default {
  data () {
    return {
      dateFormat: 'YYYY/MM/DD',
      monthFormat: 'YYYY/MM'
    }
  },
  methods: {
    moment,
    onChange (dates, dateStrings) {
      console.log('From: ', dates[0], ', to: ', dates[1])
      console.log('From: ', dateStrings[0], ', to: ', dateStrings[1])
    }
  }
}
</script>
