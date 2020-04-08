export default {
  typeName: [
    'typeName',
    {
      rules:
        [
          { required: true, message: '请输入类型名称' }
        ]
    }
  ],
  typeCode: [
    'typeCode',
    {
      rules:
        [
          { required: true, message: '请输入类型标识' }
        ]
    }
  ],
  showType: [
    'showType',
    {
      rules:
        [
          { required: true, message: '请选择显示方式' }
        ]
    }
  ],
  iconAddr: [
    'iconAddr'
  ]
}
