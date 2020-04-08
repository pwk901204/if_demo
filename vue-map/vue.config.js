// const webpack = require('webpack')

module.exports = {
  publicPath: './', // 配置打包时的相对路径
  configureWebpack: {

  },
  devServer: {
    compress: true,
    proxy: {
      '/api': {
        target: 'http://10.40.222.193:8089',
        // target: 'http://localhost:8088', // 任杰
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}
