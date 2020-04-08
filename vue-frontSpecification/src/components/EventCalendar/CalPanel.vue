<template>
  <div class="cal-wrapper">
    <div class="cal-header">
      <div class="cal-header-left">
        <span class="cal-icon cal-prev-year"
              :class="[{'cal-not-enable': !prevYearEnable}]"
              @click="prevYear">
          <!-- <a-icon type="double-left" /> -->
          <i class="double-left"></i>
        </span>
        <span class="cal-icon cal-prev-month"
              :class="[{'cal-not-enable': !prevMonthEnable}]"
              @click="preMonth">
          <i></i>
        </span>
      </div>
      <div class="title">{{curYearMonth}}</div>
      <div class="cal-header-right">
        <span class="cal-icon cal-next-month"
              :class="[{'cal-not-enable': !nextMonthEnable}]"
              @click="nextMonth">
          <i class="right"></i>
        </span>
        <span class="cal-icon cal-next-year"
              :class="[{'cal-not-enable': !nextYearEnable}]"
              @click="nextYear">
          <i class="right double-right"></i>
        </span>
      </div>
    </div>
    <div class="cal-body">
      <div class="weeks">
        <span v-for="(dayName, dayIndex) in i18n[calendar.options.locale].dayNames"
              class="item"
              :key="dayIndex">
          {{i18n[calendar.options.locale].dayNames[(dayIndex + calendar.options.weekStartOn) % 7]}}
        </span>
      </div>
      <div class="dates">
        <div v-for="date in dayList"
             class="item"
             :class="[{
            today: date.status ? (today == date.date) : false,
            event: date.status ? (date.title != undefined || (calendar.options.todayClick && today == date.date)) : false,
            'not-allow': date.notAllow ? true : false,
            [calendar.options.className] : (date.date == selectedDay)
          }, ...date.customClass]"
             :key="date.date">
          <p class="date-num"
             @click="handleChangeCurday(date)"
             :style="{color: date.notAllow ? '#999999' : (date.title != undefined || date.date == today ? ((date.date == selectedDay ||(selectedDay == 'all' && calendar.options.todayClick && date.date == today)) ? '#041d37' : (date.date == today ? 'inherit' : '#ffffff')) : 'inherit')}">
            {{date.status ? date.date.split(calendar.options.separator)[2] : ' '}}</p>
          <span v-if="date.status ? (today == date.date) : false"
                class="is-today"
                :style="{backgroundColor: ((selectedDay == 'all' && date.date == today && calendar.options.todayClick) || date.date == selectedDay) ? customColor : 'inherit' }"></span>
          <span v-if="date.notAllow ? false : (date.status ? (date.title != undefined || (calendar.options.todayClick && today == date.date)) : false)"
                class="is-event"
                :style="{borderColor: customColor, backgroundColor: (date.date == selectedDay) ? customColor : 'inherit'}"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from './i18n.js'
import tools from './tools.js'
export default {
  name: 'cal-panel',
  data () {
    return {
      i18n,
      mindate: '', // 最小的日期
      maxdate: '' // 最大的日期
    }
  },
  props: {
    events: {
      type: Array,
      required: true
    },
    calendar: {
      type: Object,
      required: true
    },
    selectedDay: {
      type: String,
      required: false
    }
  },
  computed: {
    dayList () {
      let firstDay = new Date(this.calendar.params.curYear, this.calendar.params.curMonth, 1)
      let dayOfWeek = firstDay.getDay()
      // 根据当前日期计算偏移量 // Calculate the offset based on the current date
      if (this.calendar.options.weekStartOn > dayOfWeek) {
        dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn + 7
      } else {
        dayOfWeek = dayOfWeek - this.calendar.options.weekStartOn
      }
      let startDate = new Date(firstDay)
      startDate.setDate(firstDay.getDate() - dayOfWeek)
      let item
      let status
      let notAllow
      let tempArr = []
      let tempItem
      for (let i = 0; i < 42; i++) {
        item = new Date(startDate)
        item.setDate(startDate.getDate() + i)
        if (this.calendar.params.curMonth === item.getMonth()) {
          status = 1
        } else {
          status = 0
        }
        if (!tools.isContainDate(item, this.calendar.options.notAlloDays)) {
          notAllow = 1
        } else {
          if (tools.compareDate(item, this.calendar.options.mindate) === -1 || tools.compareDate(item, this.calendar.options.maxdate) === 1) {
            notAllow = 1
          } else {
            notAllow = 0
          }
        }
        tempItem = {
          date: `${item.getFullYear()}${this.calendar.options.separator}${item.getMonth() + 1}${this.calendar.options.separator}${item.getDate()}`,
          status: status,
          notAllow: notAllow,
          customClass: []
        }
        this.events.forEach((event) => {
          if (tools.isEqualDateStr(event.date, tempItem.date, this.calendar.options.separator)) {
            tempItem.title = event.title
            tempItem.desc = event.desc || ''
            if (event.customClass) tempItem.customClass.push(event.customClass)
          }
        })
        tempArr.push(tempItem)
      }
      return tempArr
    },
    today () {
      let dateObj = new Date()
      return `${dateObj.getFullYear()}${this.calendar.options.separator}${dateObj.getMonth() + 1}${this.calendar.options.separator}${dateObj.getDate()}`
    },
    curYearMonth () {
      let tempDate = Date.parse(new Date(`${this.calendar.params.curYear}/${this.calendar.params.curMonth + 1}/01`))
      return tools.dateTimeFormatter(tempDate, this.i18n[this.calendar.options.locale].format)
    },
    customColor () {
      return this.calendar.options.color
    },
    prevYearEnable () {
      // 上一年按钮是否可用
      if (this.calendar.options.mindate) {
        let curDate = new Date(this.calendar.params.curYear - 1, this.calendar.params.curMonth, 1)
        let mindate = new Date(this.calendar.options.mindate.getTime())
        mindate.setDate(1)
        if (tools.compareDate(curDate, mindate) === -1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    prevMonthEnable () {
      // 上一个月按钮是否可用
      if (this.calendar.options.mindate) {
        let curDate = new Date(this.calendar.params.curYear, this.calendar.params.curMonth - 1, 1)
        let mindate = new Date(this.calendar.options.mindate.getTime())
        mindate.setDate(1)
        if (tools.compareDate(curDate, mindate) === -1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    nextMonthEnable () {
      // 下一个月按钮是否可用
      if (this.calendar.options.maxdate) {
        let curDate = new Date(this.calendar.params.curYear, this.calendar.params.curMonth + 1, 1)
        curDate.setDate(tools.getMothDay(curDate))
        let maxdate = new Date(this.calendar.options.maxdate.getTime())
        maxdate.setDate(tools.getMothDay(maxdate))
        if (tools.compareDate(curDate, maxdate) === 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    nextYearEnable () {
      // 下一年按钮是否可用
      if (this.calendar.options.maxdate) {
        let curDate = new Date(this.calendar.params.curYear + 1, this.calendar.params.curMonth, 1)
        curDate.setDate(tools.getMothDay(curDate))
        let maxdate = new Date(this.calendar.options.maxdate.getTime())
        maxdate.setDate(tools.getMothDay(maxdate))
        if (tools.compareDate(curDate, maxdate) === 1) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    }
  },
  methods: {
    prevYear () {
      if (!this.prevYearEnable) {
        return
      }
      let calendar = {
        curYear: this.calendar.params.curYear,
        curMonth: this.calendar.params.curMonth
      }
      if (this.calendar.params.curYear > 0) {
        calendar.curYear--
        this.$emit('month-changed', calendar)
      }
    },
    nextYear () {
      if (!this.nextYearEnable) {
        return
      }
      let calendar = {
        curYear: this.calendar.params.curYear,
        curMonth: this.calendar.params.curMonth
      }
      calendar.curYear++
      this.$emit('month-changed', calendar)
    },
    nextMonth () {
      if (!this.nextMonthEnable) {
        return
      }
      let calendar = {
        curYear: this.calendar.params.curYear,
        curMonth: this.calendar.params.curMonth
      }
      if (this.calendar.params.curMonth < 11) {
        calendar.curMonth++
      } else {
        calendar.curYear++
        calendar.curMonth = 0
      }
      this.$emit('month-changed', calendar)
    },
    preMonth () {
      if (!this.prevMonthEnable) {
        return
      }
      let calendar = {
        curYear: this.calendar.params.curYear,
        curMonth: this.calendar.params.curMonth
      }
      if (this.calendar.params.curMonth > 0) {
        calendar.curMonth--
      } else {
        calendar.curYear--
        calendar.curMonth = 11
      }
      this.$emit('month-changed', calendar)
    },
    handleChangeCurday (date) {
      if (date.status) {
        this.$emit('cur-day-changed', date.date, this.today)
      }
    }
  }
}
</script>
