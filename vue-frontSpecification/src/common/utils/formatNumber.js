// 对于数字每三位一个逗号 例如：12,345,678
function formatNumber (number) {
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

export default formatNumber
