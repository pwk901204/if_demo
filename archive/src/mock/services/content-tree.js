import Mock from 'mockjs2'
import { builder } from '../util'

const dict = ['常规档案', '文书档案', '简化文书', '多媒体档案', '图文档案', '音视频档案', '其他档案']
let x = 3
let y = 2
let z = 1
let id = 0
const contentTree = (options) => {
  const result = []
  const initJson = () => {
    return {
      key: id++,
      title: dict[Math.floor(Math.random() * (dict.length + 1))],
      children: []
    }
  }
  for (x; x > 0; x--) {
    const jsonX = initJson()
    for (y; y > 0; y--) {
      const jsonY = initJson()
      for (z; z > 0; z--) {
        const jsonZ = initJson()
        jsonY.children.push(jsonZ)
      }
      jsonX.children.push(jsonY)
    }
    result.push(jsonX)
  }
  return builder(result)
}

Mock.mock(/\/content\/tree/, 'get', contentTree)
