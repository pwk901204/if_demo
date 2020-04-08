<template>
  <div class="__vev_calendar-wrapper">
    <cal-panel :events="events"
               :calendar="calendarOptions"
               :selectedDay='selectedDayEvents.date'
               @cur-day-changed="handleChangeCurDay"
               @month-changed="handleMonthChanged">
    </cal-panel>
  </div>
</template>
<script>
import tools from './tools.js'
// import calEvents from './CalEvents'
import calPanel from './CalPanel'
export default {
  name: 'vue-event-calendar',
  components: {
    // 'cal-events': calEvents,
    'cal-panel': calPanel
  },
  data () {
    return {
      selectedDayEvents: {
        date: 'all',
        events: this.events || [] // default show all event
      },
      calendarOptions: {}
    }
  },
  props: {
    title: String,
    options: {
      type: Object
    },
    events: {
      type: Array,
      required: true,
      validator (events) {
        let validate = true
        events.forEach((event, index) => {
          if (!event.date) {
            console.error('Vue-Event-Calendar-Error:' + 'Prop events Wrong at index ' + index)
            validate = false
          }
        })
        return validate
      }
    }
  },
  computed: {
    calendarParams () {
      let dateObj = new Date()
      return {
        curYear: dateObj.getFullYear(),
        curMonth: dateObj.getMonth(),
        curDate: dateObj.getDate(),
        curEventsDate: 'all'
      }
    }
  },
  created () {
    this.initCalendarOptions()
    if (this.calendarParams.curEventsDate !== 'all') {
      this.handleChangeCurDay(this.calendarParams.curEventsDate)
    }
  },
  methods: {
    initCalendarOptions () {
      let dateObj = new Date()
      let mindate = this.options.mindate ? new Date(this.options.mindate.year, 0) : ''
      let maxdate = this.options.maxdate ? new Date(this.options.maxdate.year, 11) : ''
      if (mindate) {
        mindate.setMonth(this.options.mindate.month ? this.options.mindate.month - 1 : 0)
        mindate.setDate(this.options.mindate.day ? this.options.mindate.day : 1)
      }
      if (maxdate) {
        maxdate.setMonth(this.options.maxdate.month ? this.options.maxdate.month - 1 : 11)
        maxdate.setDate(this.options.maxdate.day ? this.options.maxdate.day : tools.getMothDay(maxdate))
      }
      this.calendarOptions = {
        options: {
          locale: 'zh', // zh
          color: '#00ffff',
          className: '',
          separator: '/', // 默认 /
          weekStartOn: 0, // 一周开始的星期，默认星期日
          todayClick: false, // 当日无事件是否可选
          notAlloDays: [], // 不可选日期
          ...this.options,
          mindate: mindate,
          maxdate: maxdate
        },
        params: {
          curYear: dateObj.getFullYear(),
          curMonth: dateObj.getMonth(),
          curDate: dateObj.getDate(),
          curEventsDate: 'all'
        }
      }
      // this.selectedDayEvents.date = `${dateObj.getFullYear()}/${dateObj.getMonth()+1}/${dateObj.getDate()}`
    },
    handleChangeCurDay (date, today) {
      let self = this
      let events = self.events.filter(function (event) {
        return tools.isEqualDateStr(event.date, date, self.calendarOptions.options.separator)
      })
      if (events.length > 0 || (this.calendarOptions.options.todayClick && date === today)) {
        self.selectedDayEvents = {
          date: date,
          events: events
        }
        self.$emit('day-changed', {
          date: date,
          events: events
        })
      }
    },
    handleMonthChanged (calendar) {
      this.calendarOptions.params.curYear = calendar.curYear
      this.calendarOptions.params.curMonth = calendar.curMonth
      this.$emit('month-changed', {
        date: this.calendarOptions.params
      })
    }
  },
  watch: {
    calendarParams () {
      if (this.calendarParams.curEventsDate !== 'all') {
        let events = this.events.filter(event => {
          return tools.isEqualDateStr(event.date, this.calendarParams.curEventsDate)
        })
        this.selectedDayEvents = {
          date: this.calendarParams.curEventsDate,
          events
        }
      } else {
        this.selectedDayEvents = {
          date: 'all',
          events: this.events
        }
      }
    },
    events () {
      this.selectedDayEvents = {
        date: this.selectedDayEvents.date || 'all',
        events: this.events || []
      }
      // this.selectedDayEvents.events = this.events || []
    }
  }
}
</script>
<style lang="less">
@base-orange: #00ffff;
@white: #ffffff;
@gray: #e0e0e0;
@gray-dark: #b1b1b1;
@large-padding: 15px;
@small-padding: 10px;

@icon-border-size: 1px;
@media screen and (min-width: 768px) {
  .__vev_calendar-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    .cal-wrapper {
      width: 100%;
      .date-num {
        line-height: 50px;
      }
    }
    .events-wrapper {
      width: 50%;
      background-color: @base-orange;
      color: @white;
      padding: 40px 45px;
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 0;
    }
  }
}
@media screen and (max-width: 768px) {
  .__vev_calendar-wrapper {
    .cal-wrapper {
      width: 100%;
      padding: 10px 5px;
      .date-num {
        line-height: 42px;
      }
    }
    .events-wrapper {
      width: 100%;
      margin-top: 10px;
      padding: 10px;
    }
  }
}
.__vev_calendar-wrapper {
  position: relative;
  overflow: hidden;
  width: 100%;
  * {
    box-sizing: border-box;
  }
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px rgba(0, 0, 0, 0.2);
    border-radius: 5px;
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(0, 0, 0, 0.2);
  }
  .cal-wrapper {
    .cal-header {
      position: relative;
      width: 100%;
      background-color: @white;
      // box-shadow: 0 6px 5px rgba(0,0,0,.1);
      font-weight: 500;
      overflow: hidden;
      & > div {
        float: left;
        line-height: 20px;
        padding: @large-padding;
      }
      .title {
        width: 60%;
        text-align: center;
      }
      .l {
        text-align: left;
        width: 20%;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
      .r {
        text-align: right;
        width: 20%;
        cursor: pointer;
        user-select: none;
        -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
      }
    }
    .cal-body {
      width: 100%;
      .weeks {
        width: 100%;
        overflow: hidden;
        text-align: center;
        font-size: 1rem;
        .item {
          line-height: 50px;
          float: left;
          width: 14.285%;
        }
      }
      .dates {
        width: 100%;
        overflow: hidden;
        text-align: center;
        font-size: 1rem;
        .item {
          position: relative;
          float: left;
          display: block;
          width: 14.285%;
          cursor: default;
          -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
          .date-num {
            font-size: 1rem;
            position: relative;
            z-index: 3;
          }
          &.event {
            cursor: pointer;
          }
          &.selected-day {
            .is-event {
              background-color: @base-orange;
            }
          }
          .is-event {
            content: "";
            border: 1px solid @base-orange;
            background-color: #fff;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 1;
            margin-left: -18px;
            margin-top: -19px;
          }
          .is-today {
            content: "";
            background-color: @base-orange;
            border-radius: 50%;
            opacity: 0.8;
            width: 12px;
            height: 4px;
            position: absolute;
            left: 50%;
            top: 50%;
            z-index: 2;
            margin-left: -6px;
            margin-top: 8px;
          }
        }
      }
    }
  }
  .events-wrapper {
    border-radius: 10px;
    .cal-events {
      height: 95%;
      overflow-y: auto;
      padding: 0 5px;
      margin: 15px 0;
    }
    .date {
      max-width: 60%;
      min-width: 200px;
      text-align: center;
      color: @white;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 20px;
      margin: 0 auto;
      font-size: 22px;
    }
    .event-item {
      padding: 5px 20px;
      margin-top: 15px;
      box-shadow: 0 3px 11px 2px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      border-radius: 5px;
      color: #323232;
      position: relative;
      &:first-child {
        margin-top: 0;
      }
      .title {
        height: 40px;
        line-height: 40px;
        color: #323232;
        font-size: 16px;
        border-bottom: 1px solid #f2f2f2;
      }
      .time {
        position: absolute;
        right: 30px;
        top: 17px;
        color: #9b9b9b;
        font-size: 14px;
      }
      .desc {
        color: #9b9b9b;
        font-size: 14px;
        padding: 7px 0;
      }
    }
  }
  .arrow-left.icon {
    color: #000;
    position: absolute;
    left: 6%;
    margin-top: 10px;
  }
  .arrow-left.icon:before {
    content: "";
    position: absolute;
    left: 1px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-top: solid @icon-border-size currentColor;
    border-right: solid @icon-border-size currentColor;
    -webkit-transform: rotate(-135deg);
    transform: rotate(-135deg);
  }
  .arrow-right.icon {
    color: #000;
    position: absolute;
    right: 6%;
    margin-top: 10px;
  }
  .arrow-right.icon:before {
    content: "";
    position: absolute;
    right: 1px;
    top: -5px;
    width: 10px;
    height: 10px;
    border-top: solid @icon-border-size currentColor;
    border-right: solid @icon-border-size currentColor;
    -webkit-transform: rotate(45deg);
    transform: rotate(45deg);
  }
  h3,
  p {
    margin: 0;
    padding: 0;
  }
}
@import url("./CalEventItem.less");
</style>
