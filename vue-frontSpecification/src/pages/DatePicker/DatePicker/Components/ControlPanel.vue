<template>
  <div>
    <a-date-picker :mode="mode1"
                   showTime
                   @openChange="handleOpenChange1"
                   @panelChange="handlePanelChange1" />
    <br />
    <br />
    <a-range-picker :placeholder="['Start month', 'End month']"
                    format="YYYY-MM"
                    :value="value"
                    :mode="mode2"
                    @panelChange="handlePanelChange2"
                    @change="handleChange" />
  </div>
</template>
<script>
export default {
  data () {
    return {
      mode1: 'time',
      mode2: ['month', 'month'],
      value: []
    }
  },
  methods: {
    handleOpenChange1 (open) {
      if (open) {
        this.mode1 = 'time'
      }
    },
    handleChange (value) {
      this.value = value
    },
    handlePanelChange1 (value, mode) {
      this.mode1 = mode
    },
    handlePanelChange2 (value, mode) {
      this.value = value
      this.mode2 = [
        mode[0] === 'date' ? 'month' : mode[0],
        mode[1] === 'date' ? 'month' : mode[1]
      ]
    }
  }
}
</script>
