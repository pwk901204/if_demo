const responseBody = {
  desc: 'SUCCESS',
  data: null,
  code: 0,
  timestamp: 0
}

export const builder = (data, desc, code = 0, headers = {}) => {
  if ('rows' in data) {
    responseBody.rows = data.rows
    responseBody.total = data.total
  } else {
    responseBody.data = data
  }

  if (desc !== undefined && desc !== null) {
    responseBody.desc = desc
  }
  if (code !== undefined && code !== 0) {
    responseBody.code = code
    responseBody._status = code
  }
  if (headers !== null && typeof headers === 'object' && Object.keys(headers).length > 0) {
    responseBody._headers = headers
  }
  responseBody.timestamp = new Date().getTime()
  return responseBody
}

export const getQueryParameters = (options) => {
  const url = options.url
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse('{"' + decodeURIComponent(search)
    .replace(/"/g, '\\"')
    .replace(/&/g, '","')
    .replace(/=/g, '":"') + '"}')
}

export const getBody = (options) => {
  return options.body && JSON.parse(options.body)
}
