export default {
  email: [
    'email',
    {
      rules: [
        { required: true, whitespace: true, message: '请输入邮箱！' },
        { type: 'email', message: '邮箱格式不正确！' }
      ]
    }
  ],
  password: [
    'password',
    {
      rules: [
        { required: true, whitespace: true, message: '请输入密码！' }
      ]
    }
  ],
  select: [
    'select',
    {
      rules: [
        { required: true, message: '请选择！' }
      ]
    }
  ],
  time: [
    'time',
    {
      rules: []
    }
  ],
  range: [
    'range',
    {
      rules: []
    }
  ]
}
