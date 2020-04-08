<template>
  <textarea id="tiny"></textarea>
</template>

<script>
// import tinymce from '@/common/components/tinymce/tinymce'
// import '@/common/components/tinymce/themes/silver/theme'
export default {
  name: 'TinyMce',
  data () {
    return {
      acceptMap: Object.freeze({
        file: '*',
        image: 'image/*',
        media: 'video/ogg,video/mp4,video/webm'
      }),
      urlMap: Object.freeze({
        file: 'base/uploadfile',
        image: 'base/uploadimage',
        media: 'base/uploadvideo'
      })
    }
  },
  mounted () {
    this.initEditor()
  },
  methods: {
    // 初始化富文本编辑器
    initEditor () {
      // console.log(window.tinymce)
      const that = this
      window.tinymce.init({
        selector: '#tiny',
        min_height: 400,
        branding: false,
        language_url: 'tinymce/languages/zh_CN.js',
        language: 'zh_CN',
        plugins: 'preview hr lists table fullscreen image media fileupload wordcount ',
        toolbar: 'undo redo | bold italic underline forecolor backcolor | styleselect | fontsizeselect | indent outdent alignleft aligncenter alignright bullist numlist table | image media fileupload fullscreen',
        media_alt_source: false,
        image_description: false,
        file_picker_types: 'file image media',
        // 文件选择
        file_picker_callback: function (callback, value, meta) {
          const filetype = meta.filetype

          var input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', that.acceptMap[filetype])

          input.onchange = function () {
            var file = this.files[0]
            // const reg = /\.(\w+)$/
            // console.log(file.type)
            // console.log(file.name.match(reg)[0])
            that.fileRequest(file, that.urlMap[filetype], callback)
            input.remove()
          }
          input.click()
        }
      })
    },
    // 上次文件请求
    fileRequest (file, url, callback) {
      let xhr = new XMLHttpRequest()
      xhr.withCredentials = false
      xhr.open('POST', url)

      // debugger
      xhr.onload = function () {
        if (xhr.status !== 200) {
          // eslint-disable-next-line
          failure('HTTP Error: ' + xhr.status)
          return
        }

        const json = JSON.parse(xhr.responseText)
        if (!json || typeof json.url !== 'string') {
          // eslint-disable-next-line
          failure('Invalid JSON: ' + xhr.responseText)
          return
        }

        callback(json.url, {
          title: file.name,
          description: file.name,
          fileType: file.type
        })
      }

      let formData = new FormData()
      formData.append('upfile', file, file.name)
      xhr.send(formData)
    }
  }
}
</script>
