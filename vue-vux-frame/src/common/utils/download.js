const { NODE_ENV } = process.env

export default function (url, data) {
  if (!url) { console.error('下载地址错误！'); return true }
  if (NODE_ENV === 'development') {
    url = '/api' + url
  }

  let form = document.createElement('form')
  form.setAttribute('action', url)
  form.setAttribute('method', 'post')
  for (let item in data) {
    let val = data[item] === undefined ? '' : data[item] === null ? '' : data[item]
    let input = document.createElement('input')
    input.setAttribute('type', 'text')
    input.setAttribute('name', item)
    input.setAttribute('value', val)
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
  document.body.removeChild(form)
}
