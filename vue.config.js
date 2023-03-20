process.env.VUE_APP_VERSION = require('./package.json').version
const path = require('path')

module.exports = {
  publicPath: '/comp/',
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    output: {
      filename:
        process.env === 'prod' || process.env === 'sso'
          ? '[name].[chunkhash].js'
          : '[name].bundle.js',
    },
  },
  chainWebpack: config => {
    config.resolve.alias.set('@', path.resolve(__dirname, 'src/'))
  },
  devServer: {
    port: process.env.VUE_APP_PORT || 3000,
    proxy: {
      '/comp-b-svc': {
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
      '/config': {
        target: process.env.VUE_APP_PUBLIC_CONFIG_URL,
        changeOrigin: true,
      },
      '/logout': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
    },
    overlay: false,
  },
}
