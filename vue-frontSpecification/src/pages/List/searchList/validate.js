import rules from '@/common/utils/rules'

let validate = {
  // 所属年级
  ssnj: [
    'ssnj', {
      rules: [{
        required: false,
        message: '请选择所属年级!'
      }]
    }
  ],
  // 所属系部
  ssxb: [
    'ssxb', {
      rules: [{
        required: false,
        message: '请选择所属系部!'
      }]
    }
  ],
  // 所属专业
  sszy: [
    'sszy', {
      rules: [{
        required: false,
        message: '请选择所属专业!'
      }]
    }
  ],
  // 所属班级
  ssbj: [
    'ssbj', {
      rules: [{
        required: false,
        message: '请选择所属班级!'
      }]
    }
  ],
  // 按姓名
  xm: [
    'xm', {
      rules: [{
        required: false,
        message: '请输入姓名!'
      }]
    }
  ],
  // 事件名称
  sjmc: [
    'sjmc', {
      rules: [{
        required: false,
        message: '请输入事件名称!'
      }]
    }
  ],
  // 事件选项
  sjxx: [
    'sjxx', {
      rules: [{
        required: false,
        message: '请输入事件选项!'
      }]
    }
  ]
}

// 遍历所有的检验字段,检查每个字段的option,为每个option添加公用的规则
for (let key in validate) {
  validate[key][1] = rules.addNormalize(validate[key][1])
}

export default {
  data () {
    return validate
  }
}
