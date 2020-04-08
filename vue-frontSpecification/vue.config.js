// const webpack = require('webpack')

module.exports = {
  lintOnSave: false,
  publicPath: './', // 配置打包时的相对路径
  configureWebpack: {
    resolve: {
      alias: {
        'vue$': 'vue/dist/vue.esm.js'
      }
    }
  },
  devServer: {
    compress: true,
    proxy: {
      '/api': {
        // target: 'http://10.40.223.75:8089', // 蒋京龙
        target: 'http://localhost:8088', // 任杰
        pathRewrite: {
          '^/api': ''
        },
        changeOrigin: true,
        logLevel: 'debug'
      }
    }
  }
}
