import axios from 'axios'
import store from '@/store'

// 图片base64转Blob
function base64ToBlob (base64) {
  var bytes = window.atob(base64)
  // 处理异常,将ascii码小于0的转换为大于0
  var ab = new ArrayBuffer(bytes.length)
  var ia = new Uint8Array(ab)
  for (var i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i)
  }

  return new Blob([ab], { type: 'image/png' })
}

export default function (base64) {
  store.commit('SET_SPINNING', true)
  let url = process.env.NODE_ENV === 'production' ? '/common/upload' : '/api/common/upload'
  let formData = new FormData()
  formData.append('file', base64ToBlob(base64), '介绍信.png')

  return new Promise((resolve, reject) => {
    axios.request({
      url: url,
      method: 'post',
      data: formData,
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(res => {
      store.commit('SET_SPINNING', false)
      resolve(res.data)
    }).catch(err => {
      store.commit('SET_SPINNING', false)
      reject(err)
    })
  })
}
