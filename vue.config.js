const webpack = require('webpack')

const cdn = {
  // 忽略打包的第三方库
  externals: {
    vue: 'Vue',
    vuex: 'Vuex',
    'vue-router': 'VueRouter',
    axios: 'axios'
  },

  // 通过cdn方式使用
  js: [
    'https://cdn.bootcss.com/vue/2.6.11/vue.runtime.min.js',
    'https://cdn.bootcss.com/vue-router/3.1.2/vue-router.min.js',
    'https://cdn.bootcss.com/vuex/3.1.2/vuex.min.js',
    'https://cdn.bootcss.com/axios/0.19.2/axios.min.js'
    // 'https://cdn.bootcss.com/moment.js/2.24.0/moment.min.js',
    // 'https://cdn.bootcss.com/echarts/3.7.1/echarts.min.js'
  ],

  css: []
}

/* diabled-eslint */
module.exports = {
  // 打包输出文件夹
  outputDir: 'sicilyEditor',
  // 部署应用包时的基本 URL
  publicPath: process.env.NODE_ENV === 'production' ? 'http://sicilymarmot.top/sicilyEditor/' : './',
  // server 配置
  devServer: {
    host: '0.0.0.0',
    port: 4000,
    open: false,
    proxy: {
      '/api': {
        // target: 'http://47.96.2.170:3000',
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  },
  chainWebpack: config => {
    // 配置cdn引入
    config.plugin('html').tap(args => {
      args[0].cdn = cdn
      return args
    })
  },
  configureWebpack: {
    devtool: 'source-map',
    externals: cdn.externals,
    plugins: [
      new webpack.DefinePlugin({
        'build_time': JSON.stringify(new Date().toLocaleString())
      })
    ]
  }
  // configureWebpack: config => {
  //   console.log('打包配置config', config)

  //   config.devtool = 'source-map'
  //   // 忽略打包配置
  //   config.externals = cdn.externals
  // }

}