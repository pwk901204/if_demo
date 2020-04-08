import Mock from 'mockjs2'
import { builder, getQueryParameters } from '../util'

const total = 100

const tutorialList = (options) => {
  const parameters = getQueryParameters(options)

  const result = []
  const pageNo = parseInt(parameters.pageNo) || 1
  const pageSize = parseInt(parameters.pageSize) || 10
  const totalPage = Math.ceil(total / pageSize)
  const key = (pageNo - 1) * pageSize
  const next = (pageNo >= totalPage ? (total % pageSize) : pageSize) + 1
  // debugger
  for (let i = 1; i < next; i++) {
    const tmpKey = key + i
    result.push({
      key: tmpKey,
      id: 'id' + tmpKey,
      no: 'No ' + tmpKey,
      description: `${tmpKey}，很长的一段话，其实就是长长的一段话啊，其他的什么也没有，就看你如何现在的呀！`,
      callNo: Mock.mock('@integer(1, 999)'),
      status: Mock.mock('@integer(0, 3)'),
      updatedAt: Mock.mock('@datetime'),
      editable: false
    })
  }

  return builder({
    total: total,
    rows: result
  })
}

Mock.mock(/\/tutorial\/list/, 'get', tutorialList)
