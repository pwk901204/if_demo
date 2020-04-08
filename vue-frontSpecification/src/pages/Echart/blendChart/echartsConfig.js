let echartsConfig = {
  //   /**
  //  * 获取带刻度的横坐标配置
  //  * @param  {[Array]} data [横坐标数组]
  //  */
  getTickxAxis: (data, name, rotate) => {
    var resConfig = {
      type: 'category',
      name: name || '',
      axisTick: {
        show: true
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: '#666'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#f0f0f0 '
        }
      },
      axisLabel: {
        inside: false,
        interval: 0,
        rotate: rotate || 0,
        textStyle: {
          color: '#4c4c4c',
          fontWeight: 'normal',
          fontSize: '12'
        }
      },
      data: data || []
    }

    return resConfig
  },

  /**
   * 设置空的x坐标 - 用来做背景设置
   * 获取带刻度的横坐标配置
   */
  getNodexAxis: (data) => {
    return {
      type: 'category',
      axisLine: {
        show: false
      },
      axisTick: {
        show: false
      },
      axisLabel: {
        show: false,
        interval: 0
      },
      splitArea: {
        show: false
      },
      splitLine: {
        show: false
      },
      data: data || []
    }
  },

  /**
   * 设置折线图的配置
   * @param  {[String]} name [series的名称]
   * @param  {[Array]} data [series数据]
   * @return {[type]} [description]
   */
  getLineSeries: (name, data, yAxisIndex) => {
    return {
      name: name,
      type: 'line',
      zlevel: 10,
      symbolSize: 8,
      yAxisIndex: yAxisIndex || 0,
      data: data || []
    }
  },

  // 对于数字每三位一个逗号 例如：12,345,678
  formatNumber: (number) => {
    // 如果数据为null，则用0代替
    if (number === null || number === undefined || number === '0') {
      return '0'
    } else {
      var pointNumber = number - parseInt(number)

      var b = parseInt(number)
      var absB = (b < 0 ? Math.abs(b) : b).toString()
      var len = absB.length
      var retNum

      if (len <= 3) {
        return number
      } else if (len > 3) {
        var r = len % 3
        retNum = r > 0 ? absB.slice(0, r) + ',' + absB.slice(r, len).match(/\d{3}/g).join(',') : absB.slice(r, len).match(/\d{3}/g).join(',')

        if (b < 0) {
          retNum = '-' + retNum
        }
      }

      if (pointNumber !== 0) {
        return retNum + '.' + number.toString().split('.')[1]
      } else {
        return retNum
      }
    }
  }

}

export default echartsConfig
