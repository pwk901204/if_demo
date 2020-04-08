<template>
  <div>
    <div class="link-btn ell" @click="showBigger">
      <slot></slot>
    </div>
    <!-- 预览 -->
    <a-modal
      :width="width"
      :title="name"
      :visible="visible"
      :footer="null"
      @cancel="()=> {visible = false}"
    >
      <picturePreview
        v-if="checkpicture(type)"
        :src="url"
      ></picturePreview>

      <mp4From
        v-if="type === 'mp4'"
        :src="url"
      ></mp4From>

      <mp3From
        v-if="type === 'mp3'"
        :src="url"
      ></mp3From>

      <pdf-preview
        v-if="type === 'pdf'"
        :src="url"
      ></pdf-preview>

      <officePreview
        v-if="checkword(type)"
        ref="kgOffice"
        :name="name"
        :projectId="id"
        :officeUrl="url"
      ></officePreview>
    </a-modal>
  </div>
</template>
<script>
import picturePreview from './Picture'
import mp4From from './MP4'
import mp3From from './MP3'
import pdfPreview from './Pdf'
import officePreview from './Office'
export default {
  name: 'PreviewList',
  components: { picturePreview, mp4From, mp3From, pdfPreview, officePreview },
  props: {
    type: {
      type: String,
      require: true
    },
    url: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    id: {
      type: String
    },
    width: {
      type: String
    }
  },
  data () {
    return {
      visible: false
    }
  },
  mounted () {
  },
  methods: {
    showBigger () {
      this.visible = true
    },
    // 检查图片
    checkpicture (type) {
      if (type) {
        return /^(png|jpg|jpeg|gif)$/.test(type.toLowerCase())
      }
    },
    // 检查word
    checkword (type) {
      if (type) {
        return /^(doc|xls|ppt|docx|xlsx)$/.test(type.toLowerCase())
      }
    }
  }
}
</script>
