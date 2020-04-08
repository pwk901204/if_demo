let tools = {
  dateTimeFormatter: (date, format) => {
    // 时间格式化辅助函数 date:毫秒数 format:'yyyy-MM-dd hh:mm:ss'
    if (!date || date === '') {
      return ''
    }

    if (typeof date === 'string') {
      var mts = date.match(/(\/Date\((\d+)\)\/)/)
      if (mts && mts.length >= 3) {
        date = parseInt(mts[2])
      }
    }

    date = new Date(date)
    if (!date || date.toUTCString() === 'Invalid Date') {
      return ''
    }

    var map = {
      'M': date.getMonth() + 1, // 月份
      'd': date.getDate(), // 日
      'h': date.getHours(), // 小时
      'm': date.getMinutes(), // 分
      's': date.getSeconds(), // 秒
      'q': Math.floor((date.getMonth() + 3) / 3), // 季度
      'S': date.getMilliseconds() // 毫秒
    }
    format = format.replace(/([yMdhmsqS])+/g, function (all, t) {
      var v = map[t]
      if (v !== undefined) {
        if (all.length > 1) {
          v = '0' + v
          v = v.substr(v.length - 2)
        }
        return v
      } else if (t === 'y') {
        return (date.getFullYear() + '').substr(4 - all.length)
      }
      return all
    })
    return format
  },
  /**
   * [判断两个日期字符串是否相等]
   * @param  {[type]} dateStr1 [日期字符串1]
   * @param  {[type]} dateStr2 [日期字符串2]
   * @param  {[type]} format   [日期字符串的分隔符]
   * @return {[type]}          [description]
   */
  isEqualDateStr: (dateStr1, dateStr2, format) => {
    let dateArr1 = dateStr1.split(format || '/')
    let dateArr2 = dateStr2.split(format || '/')
    if (parseInt(dateArr1[0], 10) !== parseInt(dateArr2[0], 10)) {
      return false
    }
    if (parseInt(dateArr1[1], 10) !== parseInt(dateArr2[1], 10)) {
      return false
    }
    if (parseInt(dateArr1[2], 10) !== parseInt(dateArr2[2], 10)) {
      return false
    }
    return true
  },
  /**
   * [获取当前月份的最后一天]
   * @param  {[type]} curDate [当前日期]
   * @return {[type]}         [description]
   */
  getMothDay: (curDate) => {
    curDate.setMonth(curDate.getMonth() + 1)
    curDate.setDate(0)
    return curDate.getDate()
  },
  /**
   * [比较两个日期的大小]
   * @param  {[type]} indexDate     [被比较的日期]
   * @param  {[type]} becompareDate [比较的日期]
   * @return {[type]}               [description]
   */
  compareDate: (indexDate, becompareDate) => {
    if (!becompareDate) {
      return 0
    }
    indexDate.setHours(0, 0, 0, 0)
    let indexDateTime = indexDate.getTime()
    becompareDate.setHours(0, 0, 0, 0)
    let becompareDateTime = becompareDate.getTime()
    if (indexDateTime > becompareDateTime) {
      return 1
    } else if (indexDateTime < becompareDateTime) {
      return -1
    } else {
      return 0
    }
  },
  isContainDate: (indexDate, DaysArr) => {
    for (let item of DaysArr) {
      if (isNaN(item)) {
        // 不是数字， 说明是指定的日期
        indexDate.setHours(0, 0, 0, 0)
        let indexDateTime = indexDate.getTime()
        let itemDate = new Date(item)
        itemDate.setHours(0, 0, 0, 0)
        let itemTime = itemDate.getTime()
        if (indexDateTime === itemTime) {
          return false
        }
      } else {
        // 是数字，指定的周几
        if (new Date(indexDate).getDay() === Number(item)) {
          return false
        }
      }
    }
    return true
  }
}

export default tools
