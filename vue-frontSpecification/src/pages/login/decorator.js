export default {
  account: [
    'account',
    {
      rules: [{ required: true, whitespace: true, message: '请输入你的账号!' }]
    }
  ],
  password: [
    'passwrod',
    {
      rules: [{ required: true, whitespace: true, message: '请输入你的密码!' }]
    }
  ]
}
