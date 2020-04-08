const path = require('path')
const fs = require('fs')

let framework = {}
const pathName = path.join(__dirname, 'src/packages')

function handleText (text) {
  let arr = text.match(/(component.*,?)/g)
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].indexOf('import') !== -1) {
      // console.log(arr[i])
      const indexStart = arr[i].indexOf('\/')
      const indexEnd = arr[i].lastIndexOf(')')
      const component = 'component: \'' + arr[i].substring(indexStart + 1, indexEnd) + ','
      // console.log(arr[i].substring(indexStart + 1, indexEnd))
      text = text.replace(arr[i], component)
    } else {
      const component = 'component: \'' + arr[i].match(/:.*/)[0].replace(':', '').replace(' ', '').replace(',', '') + '\','
      text = text.replace(arr[i], component)
    }
  }

  text = text.replace(/(\/\/.*)/g, '')
  return eval(text)
}

fs.readdir(pathName, function (err, files) {
  if (err) throw err
  for (let i = 0; i < files.length; i++) {
    const package = files[i]
    let route = path.join(pathName, package, 'router.js')
    console.log(package)
    let data = fs.readFileSync(route)
    let text = data.toString()
    if (text) {
      const asyncTag = 'export const asyncRouter = '
      const constantTag = 'export const constantRouter = '
      let indexAsync = text.indexOf(asyncTag)
      let indexConstant = text.indexOf(constantTag)

      let asyncText
      let constantText
      // 判断是否注释
      if (indexAsync === -1 || text.indexOf('// ' + asyncTag) !== -1) {
        indexAsync = undefined
      }

      if (indexConstant === -1 || text.indexOf('// ' + constantTag) !== -1) {
        indexConstant = undefined
      }

      if (indexAsync && indexConstant) {
        if (indexAsync > indexConstant) {
          asyncText = text.substring(indexAsync + asyncTag.length)
          constantText = text.substring(indexConstant + constantTag.length, indexAsync)
        } else {
          asyncText = text.substring(indexAsync + asyncTag.length, indexConstant)
          constantText = text.substring(indexConstant + constantTag.length)
        }
      } else {
        if (indexAsync) {
          asyncText = text.substring(indexAsync + asyncTag.length)
        }
        if (indexConstant) {
          constantText = text.substring(indexConstant + constantTag.length)
        }
      }
      let routers = []
      if (asyncText) {
        routers = routers.concat(handleText(asyncText))
      }

      if (constantText) {
        routers = routers.concat(handleText(constantText))
      }

      let packageName = package
      const nameIndex = text.indexOf(' * @name [')
      if (nameIndex) {
        packageName = text.match(/(?<=(\@name \[)).*?(?=\])/)[0]
      }

      framework[package] = {
        name: packageName,
        code: package,
        routers: routers
      }
    } else {
      framework[package] = {
        name: package,
        code: package,
        routers: []
      }
    }
  }

  console.log(JSON.stringify(framework))

  const jsonPath = path.join(__dirname, 'src/core/framework.json')
  const str = JSON.stringify({
    data: framework,
    flag: true,
    msg: 'SUCCESS'
  }, null, 2)

  fs.writeFileSync(jsonPath, str)
  console.log('success!')
})
