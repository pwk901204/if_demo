
module.exports = {
  runtimeCompiler: true,
  productionSourceMap: false,
  publicPath: './', // 配置打包时的相对路径
  // 定制antd样式
  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          'primary-color': '#1890ff',
          'link-color': '#1890ff', // 链接色
          'success-color': '#52c41a', // 成功色
          'warning-color': ' #faad14', // 警告色
          'error-color': '#f5222d', // 错误色
          'font-size-base': '14px', // 主字号
          'heading-color': 'rgba(0, 0, 0, .85)', // 标题色
          'text-color': ' rgba(0, 0, 0, .65)', // 主文本色
          'text-color-secondary': ' rgba(0, 0, 0, .45)', // 次文本色
          'disabled-color': 'rgba(0, 0, 0, .25)', // 失效色
          'border-radius-base': '4px', // 组件/浮层圆角
          'border-color-base': '#d9d9d9', // 边框色
          'box-shadow-base': '0 2px 8px rgba(0, 0, 0, .15)' // 浮层阴影
        },
        javascriptEnabled: true
      }
    }
  },
  devServer: {
    compress: true,
    proxy: {
      [process.env.VUE_APP_API]: {
        target: 'http://10.40.222.192:8088', // 测试服务器
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}
