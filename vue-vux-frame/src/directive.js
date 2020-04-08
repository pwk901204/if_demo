import Vue from 'vue'
// import { message } from 'ant-design-vue'
import store from './store'
import { url } from './common/utils/regex'

const { NODE_ENV } = process.env

// 下载
Vue.directive('download', {
  inserted: function (el, binding) {
    el.setAttribute('file', binding.value)
    function download (e) {
      let target = e.currentTarget
      // console.log(e.currentTarget)
      // if (!target.hasAttribute('file')) {
      //   target = target.parentNode
      // }
      let filePath = target.getAttribute('file')
      let fileName = target.getAttribute('filename') || target.innerText
      if (url === '') {
        // message.warning('文件地址不存在！')
        return false
      }
      if (!url.test(filePath)) {
        // message.warning('文件地址错误！')
        return false
      }
      let downloadurl = `/api/common/download?filePath=${filePath}&fileName=${fileName}`
      if (NODE_ENV === 'production') {
        downloadurl = downloadurl.replace('/api', '')
      }
      window.open(downloadurl)
    }
    el.clickContext = download
    el.addEventListener('click', download)
  },
  // 异步更新value
  update: function (el, binding) {
    el.setAttribute('file', binding.value)
    // el.style.cursor = 'pointer'
  },
  unbind (el) {
    el.removeEventListener('click', el.clickContext)
  }
})

// 权限指令
Vue.directive('has', {
  inserted: (el, binding) => {
    const permission = store.state.account.user.buttons || []
    let value = binding.value
    let isHave = true
    if (value.indexOf('|') > 0) {
      value = value.split('|')
      isHave = value.some((item) => {
        return permission.includes(item)
      })
    } else {
      isHave = permission.includes(binding.value)
    }
    if (!isHave && el.parentNode) {
      el.parentNode.removeChild(el)
    }
  }
})
