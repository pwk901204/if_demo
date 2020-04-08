<template>
  <div class="pageAifan">
    <div class="calendar-box">
      <event-calendar :events="dateEvents"
                      :options="calendarOptions"
                      @day-changed="chosedDayCall"
                      @month-changed="changeMonthCall"></event-calendar>
    </div>
  </div>
</template>
<script>
import EventCalendar from '@/components/EventCalendar/EventCalendar'
export default {
  name: 'EventCalendarPage',
  components: {
    EventCalendar
  },
  data () {
    return {
      calendarOptions: {
        locale: 'zh', // 控件语言
        color: ' #00ffff', // 自定义颜色
        className: '', // 自定义样式
        separator: '-', // 日期分隔符
        todayClick: false, // 当日无事件时是否可选
        mindate: { // 日期范围，最小日期
          year: 2018,
          month: 8,
          day: 12
        },
        maxdate: { // 日期范围 最大日期
          year: 2022,
          month: 8,
          day: 22
        },
        notAlloDays: ['0', '3', '2019-10-24'] // 禁用的日期,0~6,分别表示周日到周六,其余格式表示指定日期,格式yyyy-MM-dd
      },
      dateEvents: [{ // 事件集合
        date: ' 2018-10-03',
        title: 'Bar',
        desc: 'sdfadfadf'
      }, {
        date: ' 2018-12-30',
        title: 'Bar',
        desc: 'sdfadfadf'
      }, {
        date: ' 2019-08-03',
        title: 'Bar',
        desc: 'sdfadfadf'
      }, {
        date: ' 2019-09-10',
        title: 'Bar222',
        desc: 'sdfadfadffdf'
      }, {
        date: ' 2019-10-25',
        title: 'Bar',
        desc: 'sdfadfadf'
      }, {
        date: ' 2019-10-10',
        title: 'Bar',
        desc: 'sdfadfadf'
      }]
    }
  },
  mounted () {

  },
  methods: {
    // 月份年份改变回调
    changeMonthCall (changeMonth) {
      // 格式
      // changeMonth = {
      //    data: {
      //      curDate: 10
      //      curEventsDate: "all"
      //      curMonth: 6
      //      curYear: 2019
      //    }
      // }
      console.log(changeMonth)
    },
    // 选择事件日期回调
    chosedDayCall (selectedDay) {
      // 格式
      // selectedDay = {
      // date: "2019-9-10"
      //  events: [{
      //    date: " 2019-09-10"
      //    desc: "sdfadfadffdf"
      //    title: "Bar222"
      //  }]
      // }
      console.log(selectedDay)
    }
  }
}
</script>
<style scoped lang="less">
.calendar-box {
  width: 50%;
  background: #0069c1;
}
</style>
