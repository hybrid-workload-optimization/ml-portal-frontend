process.env.VUE_APP_VERSION = require('./package.json').version
const path = require('path')

module.exports = {
  publicPath:
    process.env.NODE_ENV === 'k8s' || process.env.NODE_ENV === 'nds'
      ? '/service/comp/'
      : process.env.NODE_ENV === 'sso'
      ? '/comp/'
      : '/',
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
      // '/servcie/comp-b-svc': {
      //   target: process.env.VUE_APP_BASE_API,
      //   pathRewrite: { '^/servcie/comp-b-svc': '/' },
      //   changeOrigin: true,
      // },
      '/comp-b-svc': {
        target: process.env.VUE_APP_BASE_API,
        pathRewrite: { '^/comp-b-svc': '/' },
        changeOrigin: true,
      },
      '/auth': {
        target: process.env.VUE_APP_BASE_API,
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
      '/logout': {
        target: process.env.VUE_APP_BASE_API,
        changeOrigin: true,
      },
      '/auth/realms/strato-platform': {
        target: process.env.VUE_APP_KEYCLOAK_API,
        changeOrigin: true,
      },
    },
    overlay: false,
  },
}
