export default function (decorator) {
  for (let key in decorator) {
    // 添加特殊字符验证
    let field = decorator[key]
    field.forEach(item => {
      if (typeof item === 'object' && 'rules' in item) {
        let rules = JSON.parse(JSON.stringify(item.rules))
        let required = rules.find(item => item.required === true)

        item.rules.push({
          pattern: /^((?!(<|>|&))[\w\W])*$/,
          message: '不允许输入特殊字符！'
        })
        // // 存在必填验证
        // if (required) {
        //   item.rules.push({
        //     validator: (rule, value, callback) => {
        //       if (typeof value === 'string' && value.trim() === '') {
        //         // eslint-disable-next-line
        //         callback('不允许为空！')
        //       } else {
        //         callback()
        //       }
        //     }
        //   })
        // }
        // item.rules.push({
        //   pattern: /^((?!((^\s{2,})|(\s{2,}$)))[\w\W])*$/,
        //   message: '不允许前后输入连续空格！'
        // })
        // 当某一规则校验不通过时，是否停止剩下的规则的校验
        item.validateFirst = true
      }
    })
  }

  return decorator
}
