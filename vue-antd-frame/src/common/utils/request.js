import axios from 'axios'
import { stringify } from 'qs'
import store from '@/store'
import { message } from 'ant-design-vue'

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
let instance = axios.create({ timeout: 10000 })

// 设置post默认 Content-Type
instance.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'
instance.defaults.headers['X-Requested-With'] = 'XMLHttpRequest'

let pending = []
let removePending = (config) => {
  let url = `${config.url}?${stringify(config.data)}`
  for (let p in pending) {
    if (pending[p].url === url) {
      pending[p].cancel('cancelToken')
      store.commit('SET_SPINNING', false)
      pending.splice(p, 1)
    }
  }
}

// 添加请求拦截器
instance.interceptors.request.use(
  config => {
    removePending(config)
    store.commit('SET_SPINNING', true)
    // 添加请求cancel
    config.cancelToken = new axios.CancelToken((cancel) => {
      let url = `${config.url}?${stringify(config.data)}`
      pending.push({ url, cancel })
    })

    config.data = stringify(config.data)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  response => {
    store.commit('SET_SPINNING', true)
    let { data } = response
    // 去除请求过多
    let url = `${response.config.url}?${stringify(response.config.data)}`
    for (let p in pending) {
      if (pending[p].url === url) {
        pending.splice(p, 1)
      }
    }
    if (!data.flag) {
      message.error(data.desc)
      return Promise.reject(data)
    }
    return data
  },
  error => {
    // 重复请求
    if (error.constructor === axios.Cancel) {
      store.commit('SET_SPINNING', false)
      return Promise.reject(error)
    }

    store.commit('SET_SPINNING', false)
    let code = error.response && error.response.status
    if (code === undefined && error.message.includes('timeout')) {
      code = 504
    }
    message.error(codeMessage[code])
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
    url = `${NODE_ENV}/${url}`
    return instance.post(url, params, config)
  },
  // get请求
  get (url, params, config) {
    url = `${NODE_ENV}/${url}`
    return instance.get(url, params, config)
  },
  // mock请求
  mock (url) {
    store.commit('SET_SPINNING', true)
    return axios.get(url).then((res) => { store.commit('SET_SPINNING', false); return res.data })
  }
}
