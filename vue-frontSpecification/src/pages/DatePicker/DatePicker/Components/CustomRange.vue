<template>
  <div>
    <a-date-picker :disabledDate="disabledStartDate"
                   showTime
                   format="YYYY-MM-DD HH:mm:ss"
                   v-model="startValue"
                   placeholder="Start"
                   @openChange="handleStartOpenChange" />
    <a-date-picker :disabledDate="disabledEndDate"
                   showTime
                   format="YYYY-MM-DD HH:mm:ss"
                   placeholder="End"
                   v-model="endValue"
                   :open="endOpen"
                   @openChange="handleEndOpenChange" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      startValue: null,
      endValue: null,
      endOpen: false
    }
  },
  watch: {
    startValue (val) {
      console.log('startValue', val)
    },
    endValue (val) {
      console.log('endValue', val)
    }
  },
  methods: {
    disabledStartDate (startValue) {
      const endValue = this.endValue
      if (!startValue || !endValue) {
        return false
      }
      return startValue.valueOf() > endValue.valueOf()
    },
    disabledEndDate (endValue) {
      const startValue = this.startValue
      if (!endValue || !startValue) {
        return false
      }
      return startValue.valueOf() >= endValue.valueOf()
    },
    handleStartOpenChange (open) {
      if (!open) {
        this.endOpen = true
      }
    },
    handleEndOpenChange (open) {
      this.endOpen = open
    }
  }
}
</script>
