export default {
  floorName: [
    'floorName',
    {
      rules: [{ required: true, message: '请选择所在楼层' }]
    }
  ],
  point_pos: [
    'point_pos',
    {
      rules: [{ required: true, message: '请选择路径点坐标' }]
    }
  ],
  pointName: [
    'pointName',
    {
      rules: [{ required: true, message: '请输入点位名称' }]
    }
  ],
  typeId: [
    'typeId',
    {
      rules: [{ required: true, message: '请选择点位类型类型' }]
    }
  ],
  layers: [
    'layers',
    {
      rules: [{ required: true, message: '请选择显示图层' }]
    }
  ]
}
