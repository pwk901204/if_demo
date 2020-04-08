/**
 * [validObj 表单校验封装for antd，支持多种提示位置 、 提示规则、提示方式]
 */
let validObj = {

  list: [],

  prompt: {
    select: '请选择列表中的一项',
    radio: '请选择一个选项',
    checkbox: '请至少选择一个选项',
    number: '请输入数值',
    pattern: '内容格式不符合要求',
    empty: '请填写此字段',
    rangePicker: '请选择时间'
  },

  // 挂在vue实例上面$valid
  createVa (vm, domSelector) {
    let va = {
      ctx: this,
      checkForm: this.checkForm,
      clearTips: this.clearTips,
      clearPromptInfo: this.clearPromptInfo,
      getEleByField: this.getEleByField,
      getItemByField: this.getItemByField,
      validSingleField: this.validSingleField
    }
    if (vm.$valid) {
      return vm.$valid
    } else {
      vm.$valid = va
      return vm.$valid
    }
  },

  // antd 系统提示
  promptCenter (ele, errorTips, vm) {
    vm.$message.error(errorTips)
    let parentNode = ele.parentNode
    parentNode.parentNode.setAttribute('class', 'has-error')
  },

  // 底部提示
  promptBottom (ele, errorTips) {
    let parentNode = ele.parentNode
    parentNode.parentNode.setAttribute('class', 'has-error')

    // 如果存在 ，先删除
    if (parentNode.nextSibling && parentNode.nextSibling.textContent) {
      parentNode.parentNode.removeChild(parentNode.nextSibling)
    }

    // 下面
    var newNodeBottom = document.createElement('div')
    newNodeBottom.innerHTML = errorTips
    newNodeBottom.setAttribute('class', 'tips-bottom')
    parentNode.parentNode.insertBefore(newNodeBottom, parentNode.nextSibling)
  },

  // focus提示，底部 ||  右部
  promptFocus (ele, errorTips, pos, item) {
    let parentNode = ele.parentNode

    parentNode.parentNode.setAttribute('class', 'has-error')

    // 如果存在 ，先删除
    if (parentNode.nextSibling && parentNode.nextSibling.textContent) {
      parentNode.parentNode.removeChild(parentNode.nextSibling)
    }
    // 下面
    let arrowEle = ['<div class="tips-arrow-wrap">',
      '            <i class="arrow-a"></i>',
      '            <i class="arrow-b"></i>',
      '            <div class="tips-text">ERROR_TEXT</div>',
      '         </div>'
    ].join('')
    arrowEle = arrowEle.replace('ERROR_TEXT', errorTips)
    var newNodeBottom = document.createElement('div')
    newNodeBottom.setAttribute('class', (pos === 'right' ? 'tips-right-focus' : 'tips-bottom-focus') + ' tips-focus')
    newNodeBottom.innerHTML = arrowEle
    parentNode.parentNode.insertBefore(newNodeBottom, parentNode.nextSibling)

    // focus提示，右部
    if (pos === 'bottom') {
      // let w = newNodeBottom.offsetWidth
      newNodeBottom.style.marginTop = '10px'

      // 组件类型
      let widgetType = item.widgetType
      if (widgetType === 'ARadioGroup' || widgetType === 'ACheckboxGroup') {
        newNodeBottom.style.marginTop = '-10px'
      }
    } else if (pos === 'right') {
      let w = newNodeBottom.offsetWidth
      // let eleH = ele.offsetHeight
      newNodeBottom.style.right = -(w + 20) + 'px'
      newNodeBottom.style.top = 0
    }
  },

  // 提示
  promptInfo (domSelector, errorTips, params, item) {
    if (errorTips) {
      let position = params.position || 'bottom'
      switch (position) {
        case 'bottom':
          this.promptBottom(domSelector, errorTips)
          break
        case 'bottomFocus':
          this.promptFocus(domSelector, errorTips, 'botttom', item)
          break
        case 'rightFocus':
          this.promptFocus(domSelector, errorTips, 'right', item)
          break
        case 'center':
          this.promptCenter(domSelector, errorTips, params.ctx)
          break
      }
    }
  },

  //  清除提示
  clearPromptInfo (domSelector) {
    if (!domSelector.parentNode.nextSibling) {
      return false
    }
    let parentNode = domSelector.parentNode.parentNode
    parentNode.classList.remove('has-error')
    parentNode.removeChild(domSelector.parentNode.nextSibling)
  },

  // 校验单个字段
  validSingleField (params) {
    let changedFields = params.changedFields
    let name = Object.values(changedFields)[0].name
    this.checkForm({
      list: [this.getItemByField(name)],
      ctx: params.ctx,
      position: params.position,
      checkAll: false
    })
  },

  clearTips (changedFields) {
    let name = Object.values(changedFields)[0].name
    let ele = this.getEleByField(name)
    this.clearPromptInfo(ele)
  },

  getEleByField (name) {
    let list = validObj.list
    let item = list.find(function (elem) {
      if (elem.expression.split('.')[1] === name) {
        return elem.domSelector
      }
    })
    return item.domSelector
  },

  getItemByField (name) {
    let list = validObj.list
    let item = list.find(function (elem) {
      if (elem.expression.split('.')[1] === name) {
        return elem.domSelector
      }
    })
    return item
  },

  // 校验逻辑主体代码
  checkForm (params) {
    let self = this.ctx
    let list = params.list || validObj.list || []
    let isIegal = true // 是否校验通过标志位
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let reg = item.reg
      let errorTips = ''

      let vm = params.ctx
      let expressionList = item.expression.split('.')
      let v = expressionList[1] // key
      let value = vm.form.getFieldValue(v) || '' // value

      // dom
      let domSelector = params.position === 'center' ? this.getEleByField(v) : item.domSelector

      // 如果是逐步提示 && 已经验证不通过了 return ;
      if (params.checkAll === false && isIegal === false) {
        return false
      }

      if (!reg) {
        continue
      }
      console.log(value)

      // 获取正则表达式，pattern属性获取优先
      if (reg.pattern && !reg.pattern.test(value)) {
        errorTips = self.prompt.pattern
        isIegal = false
        self.promptInfo(domSelector, errorTips, params, item)
        continue
      }

      // 校验必填
      value = item.widgetType === 'ACheckboxGroup' ? value.length : value
      if (reg.required && reg.required === true && !value) {
        let widgetType = item.widgetType
        switch (widgetType) {
          case 'AInput':
          case 'ATextarea':
            errorTips = self.prompt.empty
            break
          case 'ASelect':
          case 'ATreeSelect':
            errorTips = self.prompt.select
            break
          case 'ARangePicker':
            errorTips = self.prompt.rangePicker
            break
          case 'ARadioGroup':
            errorTips = self.prompt.radio
            break
          case 'ACheckboxGroup':
            errorTips = self.prompt.checkbox
            break
          default:
            errorTips = self.prompt.empty
            break
        }
        isIegal = false
        self.promptInfo(domSelector, errorTips, params, item);
        ((widgetType === 'AInput' || widgetType === 'ATextarea') && !params.checkAll) && domSelector.focus()
        continue
      }

      // 校验最大 || 最小
      reg.type = reg.type || 'string'
      if (reg.type === 'string') {
        if (value.length < reg.min) {
          errorTips = '至少输入' + reg.min + '个字符'
          isIegal = false
          self.promptInfo(domSelector, errorTips, params, item)
          !params.checkAll && domSelector.focus()
          continue
        } else if (value.length > reg.max) {
          errorTips = '最多输入' + reg.max + '个字符'
          isIegal = false
          self.promptInfo(domSelector, errorTips, params, item)
          self.utils.selectRange.call(domSelector, reg.max, value.length)
          continue
        }
      }

      if (reg.type === 'number') {
        if (value < reg.min) {
          errorTips = '值必须大于或等于' + reg.min
          isIegal = false
          self.promptInfo(domSelector, errorTips, params, item)
          continue
        } else if (value > reg.max) {
          errorTips = '值必须小于或等于' + reg.max
          isIegal = false
          self.promptInfo(domSelector, errorTips, params, item)
          continue
        }
      }

      // check函数
      if (reg.check && typeof (reg.check) === 'function') {
        let resInfo = reg.check.call(domSelector)
        if (resInfo !== undefined && resInfo !== true) {
          isIegal = false
          self.promptInfo(domSelector, resInfo || '校验不通过', params)
          continue
        }
      }

      // 移除掉上次提示的内容
      if (errorTips === '') {
        self.clearPromptInfo(domSelector)
      }
    }

    return isIegal
  },

  utils: {

    // 在输入框中选取字符
    selectRange: function (start, end) {
      let ele = this[0] || this
      if (ele.createTextRange) {
        let range = ele.createTextRange()
        range.collapse(true)
        range.moveEnd('character', end)
        range.moveStart('character', start)
        range.select()
      } else {
        ele.focus()
        ele.setSelectionRange(start, end)
      }
      return ele
    }
  }
}

function plugin (Vue, options) {
  Vue.directive('validator', {
    bind: function (el, binding, vnode) {
      // let vm = vnode.context // 基本的校验规则
      let domSelector = el
      // let va = validObj.createVa(vm, domSelector) // 单例模式创建va，绑定在vm上

      // 获取校验集合
      let reg = binding.value
      let expression = binding.expression

      let wTypeList = vnode.tag.split('-')
      let wType = wTypeList[wTypeList.length - 1]
      validObj.list.push({
        expression: expression, // validator的值
        reg: reg, // 规则
        domSelector: domSelector, // dom选择器
        widgetType: wType // 组件的类型，input || textarea...
      })
    }
  })
}
// 自动注册vue
if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(plugin)
}
export default {
  install: plugin
}
