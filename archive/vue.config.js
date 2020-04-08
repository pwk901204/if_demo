const webpack = require('webpack')
const createThemeColorReplacerPlugin = require('./theme')

const assetsCDN = {
  // webpack build externals
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    createVuexLogger: 'createVuexLogger',
    axios: 'axios',
    // moment: 'moment',
    'vuex-persistedstate': 'createPersistedState'
  },
  css: [
    // './plugins/antd/antd.css'
  ],
  // https://unpkg.com/browse/vue@2.6.10/
  js: [
    './plugins/core-js/core-js.js',
    // './plugins/moment/moment-with-locales.js',
    './plugins/vue/vue.js',
    './plugins/vue-router/vue-router.js',
    './plugins/vuex/vuex.js',
    './plugins/vuex/logger.js',
    './plugins/vuex/vuex-persistedstate.js',
    './plugins/axios/axios.js'
    // './plugins/antd/antd-with-locales.js'
  ]
}

module.exports = {
  publicPath: './',
  outputDir: 'archive',

  configureWebpack: {
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      createThemeColorReplacerPlugin()
      // new webpack.ProvidePlugin({
      //   moment: 'moment'
      //   // jQuery: 'jquery',
      //   // 'window.$': 'jquery',
      //   // 'window.jQuery': 'jquery'
      // })
    ],

    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendors: {
            name: 'chunk-vendors',
            test: /[\\/]node_modules[\\/]/,
            priority: 10,
            chunks: 'initial'
          },
          antd: {
            name: 'chunk-antd',
            priority: 20,
            test: /[\\/]node_modules[\\/]_?ant-design-vue(.*)/
          },
          common: {
            name: 'chunk-common',
            minChunks: 2,
            priority: 5,
            chunks: 'initial',
            reuseExistingChunk: true
          }
        }
      }
    },

    externals: assetsCDN.externals
  },

  chainWebpack: (config) => {
    const svgRule = config.module.rule('svg')
    svgRule.uses.clear()
    svgRule
      .oneOf('inline')
      .resourceQuery(/inline/)
      .use('vue-svg-icon-loader')
      .loader('vue-svg-icon-loader')
      .end()
      .end()
      .oneOf('external')
      .use('file-loader')
      .loader('file-loader')
      .options({
        name: 'assets/[name].[hash:8].[ext]'
      })

    config.plugin('html').tap(args => {
      args[0].cdn = assetsCDN
      return args
    })
  },

  css: {
    loaderOptions: {
      less: {
        modifyVars: {
          // less vars，customize ant design theme
          // 'primary-color': '#F5222D',
          // 'link-color': '#F5222D',
          // 'border-radius-base': '4px'
        },
        // DO NOT REMOVE THIS LINE
        javascriptEnabled: true
      }
    }
  },

  devServer: {
    // If you want to turn on the proxy, please remove the mockjs /src/main.jsL11
    // proxy: {
    //   '/api': {
    //     target: 'https://mock.ihx.me/mock/5baf3052f7da7e07e04a5116/antd-pro',
    //     ws: false,
    //     changeOrigin: true
    //   }
    // }
  },

  productionSourceMap: false
}
