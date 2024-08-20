const { defineConfig } = require('@vue/cli-service')

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    port: process.env.VUE_APP_PORT || 8081,
    proxy: {
      '/api': {
        target: process.env.VUE_APP_URL || 'http://localhost:8081/api',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
})
