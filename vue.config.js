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
      '/auth/realms': {
        target: 'http://172.16.10.177:8580',
        changeOrigin: true,
      },
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
      '/config': {
        target: process.env.VUE_APP_PUBLIC_CONFIG_URL,
        changeOrigin: true,
      },
    },
    overlay: false,
  },
}
