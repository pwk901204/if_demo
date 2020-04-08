<template>
  <div
    id="Table"
    class="pageAifan"
  >
    <a-modal
      :title="title"
      :visible="visible"
      :wrapClassName="wrapClassName"
      :mask="autoIndex?false:true"
      :width="width"
      :maskClosable="maskClosable"
      :destroyOnClose="destroyOnClose"
      :zIndex="zIndex"
      :closable='closable'
      :keyboard='keyboard'
      :confirmLoading="confirmLoading"
      :footer="footer"
      :okText="okText"
      @ok="handleOk"
      @cancel="handleCancel"
    >
      <slot></slot>
    </a-modal>
  </div>
</template>
<script>
export default {
  name: 'Table',
  data () {
    return {
      wrapClassName: 'dragmodal dragBoxAifan' + Math.random().toString(36).substring(2),
      dragBox: 'dragBox',
      // 默认样式
      contentStyle: {
        top: 100,
        left: 0,
        bottom: 0,
        right: 0,
        margin: 'auto',
        display: 'inline-block'
      },
      oldoffsetHeight: ''
    }
  },
  props: {
    title: {
      type: String,
      default: 'Title'
    },
    visible: {
      type: Boolean,
      default: false
    },
    autoIndex: {
      type: Boolean,
      default: false
    },
    styleFill: {
      type: Object,
      default: function () { return { left: '0', top: '5%' } }
    },
    initCur: {
      type: Boolean,
      default: false
    },
    destroyOnClose: {
      type: Boolean,
      default: false
    },
    width: [String, Number],
    confirmLoading: {
      type: Boolean,
      default: null
    },
    zIndex: {
      type: Number,
      default: 100
    },
    maskClosable: {
      type: Boolean,
      default: true
    },
    footer: {
      type: Object
    },
    okText: {
      type: String,
      default: '确定'
    },
    closable: {
      type: Boolean,
      default: true
    },
    keyboard: {
      type: Boolean,
      default: true
    }
  },
  mounted () {
    this.create(this.$props.visible)
  },
  watch: {
    visible (visible) {
      this.create(visible)
    }
  },
  methods: {
    create (visible) {
      let that = this
      let { title, styleFill = {}, initCur } = that.$props
      if (initCur) return false
      if (title && visible) {
        that.$nextTick(() => {
          setTimeout(() => {
            that.contain = document.getElementsByClassName(that.wrapClassName)[0]
            that.contain.style.width = typeof (that.width) === 'number' ? that.width + 'px' : that.width
            that.contain.style.right = '0'
            // that.contain.style.overflow = 'visible'
            that.contain.style.bottom = 'auto'
            that.contain.style.margin = 'auto'
            that.contain.style.left = typeof (styleFill.left) === 'number' ? styleFill.left + 'px' : styleFill.left
            that.contain.style.top = typeof (styleFill.top) === 'number' ? styleFill.top + 'px' : styleFill.top
            that.contain.addEventListener('mousedown', that.toTop, false)
            that.toTop()
            that.header = that.contain.getElementsByClassName('ant-modal-header')[0]
            that.header.style.cursor = 'all-scroll'
            setTimeout(() => {
              that.oldoffsetHeight = that.contain.querySelector('.ant-modal-body').offsetHeight
              if (that.contain.offsetHeight > window.innerHeight) {
                that.contain.style.bottom = 0
              } else {
                that.contain.style.bottom = 'auto'
              }
              // 监听弹窗大小发生变化时的操作
              let observer = new MutationObserver(function (mutations, observer) {
                if (that.oldoffsetHeight !== mutations[0].target.querySelector('.ant-modal-body').offsetHeight && mutations[0].target.offsetHeight !== 0) {
                  that.oldoffsetHeight = mutations[0].target.querySelector('.ant-modal-body').offsetHeight
                  if (mutations[0].target.firstChild.offsetHeight > window.innerHeight) {
                    that.contain.style.bottom = '0'
                  } else {
                    that.contain.style.bottom = 'auto'
                  }
                }
              })
              let config = {
                attributes: true,
                attributeOldValue: true
              }
              observer.observe(that.contain, config)
            }, 1500)
            that.header.onmousedown = () => {
              document.body.onselectstart = () => false
              window.addEventListener('mousemove', that.move, false)
            }
            window.addEventListener('mouseup', that.removeUp, false)
          }, 100)
        })
      }
    },
    move (event) {
      const { top, left, right, bottom, width, height } = this.contain.getBoundingClientRect()
      this.contain.style.top = top + event.movementY + 'px'
      this.contain.style.left = left + event.movementX + 'px'
      this.contain.style.margin = 'unset'
      if (bottom + event.movementY > window.innerHeight) { this.contain.style.top = window.innerHeight - height + 'px' }
      if (top + event.movementY < 0) { this.contain.style.top = 0 }
      if (right + event.movementX > window.innerWidth) { this.contain.style.left = window.innerWidth - width + 'px' }
      if (left + event.movementX < 0) { this.contain.style.left = 0 }
      if (parseInt(this.contain.style.top.replace('px', '')) < 0) {
        this.contain.style.top = 0
      }
    },
    removeMove () {
      window.removeEventListener('mousemove', this.move, false)
    },
    removeUp () {
      document.body.onselectstart = () => true
      this.removeMove()
    },
    toTop () {
      let autoIndexArr = document.getElementsByClassName('autoIndex')
      if (autoIndexArr.length < 1) return false
      let max = 0
      for (let i = 0; i < autoIndexArr.length; i++) {
        let zIndex = parseInt(autoIndexArr[i].style.zIndex || 1000)
        if (zIndex > max) max = zIndex
      }
      this.contain.style.zIndex = max + 1
    },
    // 向父组件传递确认事件
    handleOk (e) {
      this.$emit('ok', e)
    },
    // 向父组件传递关闭事件
    handleCancel (e) {
      this.$emit('cancel', e)
    }
  },
  // 组件销毁
  destroyed () {
    this.removeMove()
    window.removeEventListener('mouseup', this.removeUp, false)
  }
}
</script>
<style>
.dragmodal {
  overflow-x: hidden;
}
.dragmodal .ant-modal {
  top: 0;
  width: 100% !important;
}
.ant-modal {
  padding-bottom: 0;
}
.ant-modal-footer {
  margin-top: 10px;
}
</style>
