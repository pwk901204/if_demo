
import Vue from 'vue'
import { AjaxPlugin, LoadingPlugin, ToastPlugin } from 'vux'
import { stringify } from 'qs'

// console.log(LoadingPlugin)
Vue.use(LoadingPlugin)
Vue.use(ToastPlugin)

const axios = AjaxPlugin.$http
const $vux = Vue.$vux
// import store from '@/store'
// import { message } from 'ant-design-vue'

const { NODE_ENV } = process.env

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。'
}

// 创建 axios 实例
let instance = axios.create({
  timeout: 60000
})

// 设置post默认 Content-Type
instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
instance.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

let pending = []
let removePending = (config) => {
  let url = `${config.url}?${stringify(config.data)}`

  for (let p in pending) {
    if (pending[p].url === url) {
      pending[p].cancel('cancelToken')
      // store.commit('SET_SPINNING', false)
      pending.splice(p, 1)
    }
  }
}

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    removePending(config)
    // store.commit('SET_SPINNING', true)
    // 添加请求cancel
    config.cancelToken = new axios.CancelToken((cancel) => {
      let url = `${config.url}?${stringify(config.data)}`
      pending.push({ url, cancel })
    })

    if (config.type === 'post') {
      config.data = stringify(config.data)
    }
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    // setTimeout(() => {
    //   store.commit('SET_SPINNING', false)
    // }, 100);

    let { data } = response
    // 去除请求过多
    let url = `${response.config.url}?${stringify(response.config.data)}`
    for (let p in pending) {
      if (pending[p].url === url) {
        pending.splice(p, 1)
      }
    }
    // console.log(pending)

    if (!data.flag) {
      // 未登录或者登录失效
      if (data.code === -6) {
        window.location.href = '#/login'
        return Promise.reject(new Error('登录失效'))
      }
      // if (NODE_ENV === 'development') {
      //   notification.error({
      //     message: `请求失败 ${response.config.url}:\n${response.config.data}`,
      //     description: data.desc
      //   })
      // }
      // message.error(data.desc)
      $vux.toast.show({ type: 'error', text: data.desc })
      return Promise.reject(data)
    }
    // 处理后台返回列表为空
    // if (data.data && 'total' in data.data && !data.data.rows) {
    //   data.data.rows = []
    // }
    return data
  },
  error => {
    // 重复请求
    if (error.constructor === axios.Cancel) {
      return Promise.reject(error)
    }

    // store.commit('SET_SPINNING', false)
    let { statusText } = error.response
    // let url = error.request.responseURL
    let errortext = codeMessage[status] || statusText
    // if (NODE_ENV === 'development') {
    //   notification.error({
    //     message: `请求错误 ${status}: ${url}`,
    //     description: errortext
    //   })
    // }
    // message.error(error)
    $vux.toast.show({ type: 'error', text: errortext })
    return Promise.reject(error)
  }
)

export default {
  // post请求
  post (url, params, config) {
    // 去除首尾空格
    for (var key in params) {
      if (params[key] && typeof (params[key]) === 'string') {
        params[key] = params[key].replace(/(^\s*)|(\s*$)/g, '')
      }
    }
    if (NODE_ENV === 'production') {
      url = url.replace('/api', '')
    }
    return instance.post(url, params, config)
  },
  // get请求
  get (url, params, config) {
    if (NODE_ENV === 'production') {
      url = url.replace('/api', '')
    }
    return instance.get(url, params, config)
  },
  // mock请求
  mock (url) {
    return axios.get(url).then(response => response.data)
  }
}

// import Vue from 'vue'
// import {AjaxPlugin, LoadingPlugin, ToastPlugin} from 'vux'
// import qs from 'qs'

// Vue.use(LoadingPlugin)
// Vue.use(ToastPlugin)

// const axios = AjaxPlugin.$http
// const $vux = Vue.$vux

// var Request = {
//   // 通过POST请求获取数据
//   post: function (url, params, notShowLoading) {
//     if (!notShowLoading) {
//       $vux.loading.show({
//         text: 'Loading'
//       })
//     }
//     return new Promise((resolve, reject) => {
//       if (!params) {
//         params = {}
//       }
//       axios.post(url, qs.stringify(params)).then(response => {
//         if (!notShowLoading) {
//           $vux.loading.hide()
//         }
//         const res = response.data
//         if (res.flag) {
//           resolve(res)
//         } else {
//           $vux.toast.show({
//             type: 'warn',
//             text: res.msg
//           })
//           reject(res)
//         }
//       })
//         .catch((error) => {
//           const code = error.response.status
//           let msg = ''
//           if (code === 504) {
//             msg = '请求超时'
//           } else if (code === 404) {
//             msg = '地址错误'
//           } else if (code === 200) {
//             msg = error.msg
//           } else {
//             msg = code
//           }
//           $vux.loading.hide()
//           $vux.toast.show({
//             type: 'warn',
//             text: msg
//           })
//           reject(error)
//         })
//     })
//   },

//   // 获取MOCK数据
//   mock: function (url, params, notShowLoading) {
//     return new Promise((resolve, reject) => {
//       var response = require('../../mock/' + url.substring(1).split('/').join('_') + '.json')
//       if (response && response.flag) {
//         resolve(response.data)
//       } else {
//         $vux.toast.show({
//           type: 'warn',
//           text: '请求MOCK数据发生异常,请确认路径'
//         })
//         reject(response)
//       }
//     }).catch(v => console.log(v.message))
//   }
// }

// export default Request
