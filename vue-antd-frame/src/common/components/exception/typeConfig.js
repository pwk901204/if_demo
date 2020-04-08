const bg403 = require('@/assets/exception/403.svg')
const bg404 = require('@/assets/exception/404.svg')
const bg500 = require('@/assets/exception/500.svg')
const config = {
  403: {
    img: bg403,
    title: '403',
    desc: '抱歉，你无权访问该页面'
  },
  404: {
    img: bg404,
    title: '404',
    desc: '抱歉，你访问的页面不存在或仍在开发中'
  },
  500: {
    img: bg500,
    title: '500',
    desc: '抱歉，服务器出错了'
  }
}

export default config
