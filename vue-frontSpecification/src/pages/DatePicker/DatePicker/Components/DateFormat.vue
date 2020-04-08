<template>
  <div>
    <a-date-picker>
      <template slot="dateRender"
                slot-scope="current, today">
        <div class="ant-calendar-date"
             :style="getCurrentStyle(current, today)">{{current.date()}}</div>
      </template>
    </a-date-picker>
    <a-range-picker>
      <template slot="dateRender"
                slot-scope="current">
        <div class="ant-calendar-date"
             :style="getCurrentStyle(current)">{{current.date()}}</div>
      </template>
    </a-range-picker>
    <a-week-picker>
      <template slot="dateRender"
                slot-scope="current">
        <div class="ant-calendar-date"
             :style="getCurrentStyle(current)">{{current.date()}}</div>
      </template>
    </a-week-picker>
  </div>
</template>
<script>
export default {
  methods: {
    getCurrentStyle (current, today) {
      const style = {}
      if (current.date() === 1) {
        style.border = '1px solid #1890ff'
        style.borderRadius = '50%'
      }
      return style
    }
  }
}
</script>
