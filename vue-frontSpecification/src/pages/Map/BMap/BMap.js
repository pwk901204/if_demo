export function BMP (ak) {
  return new Promise((resolve, reject) => {
    if (typeof BMap !== 'undefined') {
      resolve(BMap)
      return true
    }

    // 插入script脚本
    let scriptNode = document.createElement('script')
    scriptNode.setAttribute('type', 'text/javascript')
    scriptNode.setAttribute('src', 'http://api.map.baidu.com/getscript?v=2.0&ak=' + ak + '&services=')
    document.body.appendChild(scriptNode)

    // 等待页面加载完毕回调
    let timeout = 0
    let interval = setInterval(() => {
      // 超时10秒加载失败
      if (timeout >= 20) {
        reject(new Error('百度地图脚本初始化失败...'))
        clearInterval(interval)
      }
      // 加载成功
      if (typeof BMap !== 'undefined') {
        resolve(BMap)
        clearInterval(interval)
      }
      timeout += 1
    }, 500)
  })
}
