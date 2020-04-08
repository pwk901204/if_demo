# vue-antd
```
├─dist                      // 打包后的项目
├─node_modules              // 依赖包
│
├─public                    // 静态资源目录
│ ├─mock                    // 本地mock
│ ├─plugins                 // 本地插件
│ ├─favicon.ico             // 网站图标
│ └─index.html              // 页面入口文件
│
│─src                       // 源码目录
│ ├─assets                  // 静态文件目录
│ ├─common                  // 框架公用目录
│ │ ├─components            // 框架公用组件目录
│ │ ├─style                 // 样式
│ │ │ ├─common.less         // 网站公用样式
│ │ │ ├─reset.less          // 重置样式
│ │ ├─utils                 // 工具类
│ │ │ ├─download.js         // 下载文件-创建原生form提交，不打开新窗口
│ │ │ ├─math.js             // 浮点数运算-加 accAdd(arg1, arg2)、减 accSub(arg1, arg2)、乘 accMul(arg1, arg2)、除 accDiv(arg1, arg2)
│ │ │ ├─regex.js            // 正则表达式
│ │ │ ├─request.js          // 统一请求
│ ├─components              // 网站公用组件目录
│ ├─mixins                  // 混入-组件可复用功能
│ ├─pages                   // 页面
│ ├─router                  // 路由
│ ├─App.vue                 // 是项目入口文件
│ └─main.js                 // 是项目的核心文件，入口
│
├─.babelrc                  // Babel的配置文件
├─.editorconfig             // 代码规范配置文件
├─.gitignore                // git忽略配置文件
├─.postcssrc.js             // postcss插件配置文件
├─package-lock.json         // 项目包管控文件
├─package.json              // 项目配置
├─README.md                 // 项目说明书
└─vue.config.js             // 配置文件
```

## Project setup
```
npm install / yarn
```

### Compiles and hot-reloads for development
```
npm run serve / yarn run serve
```

### Compiles and minifies for production
```
npm run build / yarn run build
```

### Run your tests
```
npm run test / yarn run test
```

### Lints and fixes files
```
npm run lint / yarn run lint
```

## 常规说明
1. 字典类型：array<{value, label, [disabled, key, title]}>
2. 

## Global mixin
```
  /**
  * 获取查询列表参数
  * @param { Form } form 表单对象
  * @param { Object } customParam 自定义参数
  */
  _getFieldsValue (form) {
```
1. 目的：解决日期控件值问题
2. 时间控件
  - data-key="projectStartTime,projectEndTime"，修改参数字段，默认：id | id + 'StartTime' / id + 'EndTime'
  - data-format="YYYY年MM月DD日"，修改格式，默认："YYYY-MM-DD"
3. 多选数组，转换成逗号分隔的字符串传递

```
  /**
  * 获取查询列表参数
  * @param { Form } form 表单对象
  * @param { Object } customParam 自定义参数
  */
  _getTableParams (form, customParam)
```
1. 目的：
2. 如果没有搜索表单form可以不传，可以只传一个参数 
3. 时间控件
  - data-key="projectStartTime,projectEndTime"，修改参数字段，默认：id | id + 'StartTime' / id + 'EndTime'
  - data-format="YYYY年MM月DD日"，修改格式，默认："YYYY-MM-DD"
4. 多选数组，转换成逗号分隔的字符串传递

```
  /**
    * 表单赋值
    * @param { Form } form 表单对象
    * @param { Object } values 表单值
    * @param { Object } formatRule 格式规则
    */
  _setFieldsValue (form, values, formatRule) {
```
1. 目的：后端返回的对象比页面中的字段多
2. 解决
  - DatePicker: 字符串 => moment
  - 

## icon配置

默认为空，支持阿里云iconfont图标
1. icon:'iconLOGO' (Font Class); 
2. iconClass:自定义图标calss

## 接口请求
1. 代理：开发环境解决跨域，对请求添加拦截，url添加前缀/api，告诉代理服务器对哪些HTTP请求代理，
  统一在request.js中添加的，不需要用户在发送请求添加。例：`this.$axios.post('/common/dict')`

## 规范
1. a-input标签建议都添加 autocomplete="off" 和 maxlength=""
