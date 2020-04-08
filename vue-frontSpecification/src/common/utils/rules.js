const rules = {
  // 转换组件的默认值
  normalize: (value, prevValue = '', allValue) => {
    // 判断值为字符串 且当前发生改变的文本框进行特殊字符校验
    if (value && typeof (value) === 'string' && value !== prevValue) {
      value = value.replace(/['"\\/\b\f\n\r\t]/g, '') // 去掉转义字符
      value = value.replace(/[|~`#$^&*{}L<>?]/g, '') // 去掉特殊字符
    }
    return value
  },
  // 为校验字段添加normalize属性`
  addNormalize: (obj) => {
    let flag = false
    for (let key in obj) {
      if (key === 'normalize') {
        flag = true
        break
      }
    }
    if (!flag) {
      // 未找到normalize,则为其添加
      obj.normalize = rules.normalize
    }
    return obj
  }
}

export default rules
