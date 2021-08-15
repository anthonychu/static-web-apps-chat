// vue.config.js
module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'Static Web Apps Chat'
        return args
      })
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}