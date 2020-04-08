<template>
  <div class="component-tinymce">
    <div :id="id">
      <p>
        <img
          src="https://dss1.bdstatic.com/lvoZeXSm1A5BphGlnYG/skin/284.jpg"
          style="width: 500px; float: left;"
          data-mce-style="width: 500px; float: left;"
          data-mce-selected="1"
        />
      </p>
    </div>
  </div>
</template>
<script>
import loadScript from '@/utils/loadScript'
export default {
  name: 'Tinymce',
  props: {
    value: { type: String },
    id: { type: String, default: 'tiny' }
  },
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
    loadScript('plugins/tinymce/tinymce.js', (err) => {
      if (err) {
        // 若脚本加载错误，这弹出错误提示
        this.$message.error(err.message)
        return false
      }
      const editor = window.tinymce.get('tiny')
      if (!editor) {
        this.renderEditor()
      } else {
        editor.remove()
        editor.destroy()
        this.renderEditor()
      }
    })
  },
  methods: {
    // 渲染富文本编辑器
    renderEditor () {
      const that = this
      window.tinymce.init({
        selector: '#' + this.id,
        min_height: 500,
        branding: false, // 是否禁用“Powered by TinyMCE”
        language_url: 'plugins/tinymce/languages/zh_CN.js',
        language: 'zh_CN',
        images_upload_url: '/demo/upimg.php',
        images_upload_base_path: '/demo',
        // plugins: 'print preview powerpaste casechange importcss tinydrive searchreplace autolink autosave save
        // directionality advcode visualblocks visualchars fullscreen image link media mediaembed template codesample
        /// table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists checklist wordcount
        // tinymcespellchecker a11ychecker imagetools textpattern noneditable help formatpainter
        // permanentpen pageembed charmap tinycomments mentions quickbars linkchecker emoticons advtable',
        plugins: 'preview hr lists table fullscreen image media wordcount imagetools',
        toolbar: 'undo redo | bold italic underline forecolor backcolor | styleselect | fontsizeselect | indent outdent alignleft aligncenter alignright bullist numlist table | image media fileupload fullscreen',
        media_alt_source: false,
        image_description: false,
        file_picker_types: 'file image media',
        // 文件选择
        file_picker_callback: (callback, value, meta) => {
          const filetype = meta.filetype

          var input = document.createElement('input')
          input.setAttribute('type', 'file')
          input.setAttribute('accept', that.acceptMap[filetype])

          input.onchange = function () {
            var file = this.files[0]
            that.fileRequest(file, that.urlMap[filetype], callback)
            input.remove()
          }
          input.click()
        }
      })
    },
    // 上次文件请求
    fileRequest (file, url, callback) {
      const xhr = new XMLHttpRequest()
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

      const formData = new FormData()
      formData.append('upfile', file, file.name)
      xhr.send(formData)
    }
  },
  beforeDestroy () {
    const editor = window.tinymce.get('tiny')
    editor.remove()
    editor.destroy()
  }
}
</script>
