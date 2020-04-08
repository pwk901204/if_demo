# vue + vux 移动端框架

```
├─dist                  // 打包后的项目
├─node_modules          // 依赖包
│
│─src                   // 源码目录
│ ├─assets              // 静态文件目录
│ ├─common              // 框架公用目录
│ │ ├─ability           // 封装框架
│ │ │ ├─hydra.js        // 混合开发 http://platform.iflytek.com:81/cross/sum/readme.html
│ │ │ ├─request.js      // axios请求
│ │ │ ├─validate.js     // 验证表单
│ │ ├─style             // 样式
│ │ │ ├─common.less     // 网站公用样式
│ │ │ ├─reset.less      // 重置样式
│ │ ├─utils             // 工具类
│ │ │ ├─base64Upload.js // 图片base64编码上传
│ │ │ ├─download.js     // 下载文件，post请求
│ │ │ ├─math.js         // 浮点运算
│ │ │ ├─regex.js        // 正则表达式 - 手机号码、IPV4、URL、日期字符串、时间字符串
│ ├─components          // 网站公用组件目录
│ │ │ ├─divider         // 分割线 - 区隔内容的分割线，type：水平(horizontal)还是垂直(vertical)类型
│ │ │ ├─empty           // 空状态 - 当没有数据时，用于显式的用户提示
│ ├─layouts             // 页面布局 ## 需要理解，看源码/espace shangao
│ │ │ ├─PageView        // 包含页面头部视图
│ │ │ ├─RouteView       // 路由视图-进行页面跳转
│ │ │ ├─TabbarView      // 包含页面头部和底部导航跳转视图
│ ├─mixins              // 混入-组件可复用功能
│ │ └─global.js         // 全局混入对象
│ ├─pages               // 页面
│ │ └─demo              // 演示页面
│ │ └─tabbar            // tabbar页面
│ ├─router              // 路由，路由meta属性必有，title：内容在头部显示，showHead: 控制是否显示头部
│ ├─store               // 状态存储
│ ├─App.vue             // 是项目入口文件
│ ├─directive.js        // 自定义指令-文件下载（v-download）、按钮权限（v-has）
│ └─main.js             // 是项目的核心文件，入口
│
├─static                // 静态资源目录
│ ├─mock                // 本地mock
│ └─favicon.ico         // 网站图标
│
├─.babelrc              // Babel的配置文件
├─.editorconfig         // 代码规范配置文件
├─.gitignore            // git忽略配置文件
├─.postcssrc.js         // postcss插件配置文件
├─index.html            // 页面入口文件
├─package.json          // 项目配置
└─README.md             // 项目说明书
```

## 规范
- 样式文件使用less语法，为解决页面之间样式冲突，添加样式作用域
  * vue文件中template模块中最顶级类名作为命名空间，例如：`<div class="page-demo-form">`
  * 命名空间用page(页面)、
    component(组件-被其他页面引入)、
    modal(弹框-如果弹框内容过多抽取出来)、
    panel(面板-页面模块多且复杂，抽取出来单独写)进行区别，
    例如：`<div class="modal-order-new">` 弹框订单新增，第二个单词多为文件名/页面名，第三个单词多为功能性指引（new新增，detail详情，edit编辑）
- vue文件命名规则：大驼峰法，例：`Form.vue`
- 表单提交页面
  * 建议建立model文件夹，里面是实体类和验证规则。
    好处：`v-mode="params.name"`, 获取参数不用一个个去组合后台需要的格式，本身就是后台需要的。
    data里面的变量有一定的结构

## 使用步骤

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

