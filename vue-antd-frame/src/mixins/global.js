import moment from 'moment'

let mixin = {
  data () {
    return {
      PAGINATION: {
        total: 0,
        pageNum: 1,
        pageSize: 10
      }
    }
  },
  methods: {
    /**
    * 获取查询列表参数
    * @param { Form } form 表单对象
    * @param { Object } customParam 自定义参数
    */
    _getTableParams (form, customParam) {
      let params
      if (form && form._isVue) {
        let values = this._getFieldsValue(form)

        params = { ...values, ...this.PAGINATION, ...customParam }
      } else {
        customParam = form
        params = { ...this.PAGINATION, ...customParam }
      }
      delete params.total
      return params
    },

    /**
    * 获取查询列表参数
    * @param { Form } form 表单对象
    * @param { Object } customParam 自定义参数
    */
    _getFieldsValue (form) {
      let values = form.getFieldsValue()
      let results = JSON.parse(JSON.stringify(values))

      for (let key in values) {
        let val = values[key]
        if (val) {
          if (val._isAMomentObject) {
            let node = document.getElementById(key)
            let fields = node.getAttribute('data-key') || key
            let formatStr = node.getAttribute('data-format') || 'YYYY-MM-DD' // 格式类型
            results[fields] = val.format(formatStr)
          }
          if (val.constructor === Array && val.length > 0) {
            let node = document.getElementById(key)
            let fields = node.getAttribute('data-key') || `startTime,endTime`
            if (fields && fields.indexOf(',') > 0) {
              let formatStr = node.getAttribute('data-format') || 'YYYY-MM-DD' // 格式类型
              fields = fields.split(',')

              results[fields[0]] = val[0].format(formatStr)
              results[fields[1]] = val[1].format(formatStr)
              delete results[key]
              continue
            }
          }

          // 处理多选数组类型，逗号分隔
          if (val.constructor === Array) {
            results[key] = val.join(',')
          }
        }
        // 未赋值的取值
        if (val === undefined) {
          delete results[key]
        }
      }
      return results
    },

    /**
     * 表单赋值
     * @param { Form } form 表单对象
     * @param { Object } values 表单值
     * @param { Object } formatRule 格式规则
     */
    _setFieldsValue (form, values, formatRule) {
      let fields = form.getFieldsValue()
      for (let key in fields) {
        let value = values[key]
        if (value !== undefined && value !== null) {
          if (formatRule) {
            if (formatRule[key] === 'Moment') {
              if (value.constructor === Array && value.length > 0) {
                fields[key] = [value[0] ? moment(value[0]) : undefined, value[1] ? moment(value[1]) : undefined]
              } else {
                fields[key] = value ? moment(value) : undefined
              }
            } else {
              fields[key] = value
            }
          } else {
            fields[key] = value
          }
        }
      }

      form.setFieldsValue(fields)
    }
  }
}

export default mixin
