import Vue from 'vue'
import { ToastPlugin, trim } from 'vux'
Vue.use(ToastPlugin)

// var Validate = {

// 执行表单校验
export default function (params, rules) {
  for (let i = 0, len = rules.length; i < len; i++) {
    let key = rules[i].name      // 需要验证的input
    let valType = typeof params[key]   // 判断值的类型
    let val = valType === 'string' ? trim(params[key]) : params[key]
    let rule = rules[i]    // 选择对应的规则循序
    let tip = ''
    // 为空性验证
    if ('required' in rule && rule.required) {
      if (val === '' || val.length === 0 || (typeof val === 'boolean' && !val)) {
        tip = rule.emptyTip || rule.tip || '不能为空'
        Vue.$vux.toast.text(tip)
        return false
      }
    }
    if (val !== '') {
      // 正则表达式验证
      if ('pattern' in rule) {
        let reg = new RegExp(rule.pattern)
        if (!reg.test(val)) {
          tip = rule.tip || '不符合规则'
          Vue.$vux.toast.text(tip)
          return false
        }
      }
      // 相同验证
      if ('notSame' in rule) {
        if (key.indexOf('2') !== -1) {
          let second = trim(params[key.replace(/2/, '')])
          if (second !== '' && val !== second) {
            tip = rule.notSameTip || '两次输入不一致'
            Vue.$vux.toast.text(tip)
            return false
          }
        }
      }
    }
  }
  return true
}
// }

// export default Validate
