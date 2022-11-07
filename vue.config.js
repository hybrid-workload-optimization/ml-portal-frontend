process.env.VUE_APP_VERSION = require('./package.json').version
const path = require('path')

module.exports = {
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    output: {
      filename:
        process.env === 'prod' ? '[name].[chunkhash].js' : '[name].bundle.js',
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src/'))
  },
  devServer: {
    port: process.env.VUE_APP_PORT || 3000,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
      '/sse': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
      '/ws': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
    },
    overlay: false,
  },
}
