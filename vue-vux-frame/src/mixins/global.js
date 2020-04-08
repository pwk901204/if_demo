// const { NODE_ENV } = process.env

let mixin = {
  data () {
    return {
    }
  },
  methods: {
    // // 校验并获取输入域的值
    // validateFields (form, callback) {
    //   let errors = {}
    //   let values = {}
    //   const fields = form.$children || []
    //   // console.log(fields)
    //   fields.forEach(item => {
    //     // console.log()
    //     let nodeName = item.$options._componentTag
    //     console.log(nodeName)
    //     if (nodeName === 'x-input') {
    //       item.onBlur()
    //     }

    //     // 验证不通过
    //     if (nodeName === 'x-input' && !item.valid) {
    //       errors[item.name] = item.errors.required || item.errors.format || item.errors.min || item.errors.max || item.errors.equal || ''
    //     }

    //     // 赋值
    //     values[item.name] = item.currentValue
    //   })
    //   if (JSON.stringify(errors) === '{}') errors = undefined
    //   console.log(values)
    //   if (callback) callback(errors, values)
    // },
    // // 设置一组输入控件的值
    // setFieldsValue (form, values) {
    //   const fields = form.$children || []
    //   fields.forEach(item => {
    //     // 赋值
    //     item.currentValue = values[item.name]
    //   })
    // },
    // // 重置输入控件的值
    // resetFields (form) {
    //   const fields = form.$children || []
    //   fields.forEach(item => {
    //     let nodeName = item.$options._componentTag
    //     if (nodeName === 'x-input') {
    //       item.reset()
    //     }
    //   })
    // }
  }
}

export default mixin
