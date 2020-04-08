<template>
  <div>
    <a-date-picker :defaultValue="moment('2015/01/01', dateFormat)"
                   :format="dateFormat" />
    <br />
    <br />
    <a-month-picker :defaultValue="moment('2015/01', monthFormat)"
                    :format="monthFormat" />
    <br />
    <br />
    <a-range-picker :defaultValue="[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]"
                    :format="dateFormat" />
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
    moment
  }
}
</script>
