module.exports = {
  assetsDir: 'static',
  devServer: {
    allowedHosts: [
      'develop.lc',
      'localhost'
    ],
    proxy: {
      '/doc': {
        target: 'http://127.0.0.1:8000'
      },
      '/api': {
        target: 'http://127.0.0.1:8000'
      }
    }
  }
}
