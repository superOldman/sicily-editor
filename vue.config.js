/* diabled-eslint */
module.exports = {
  // 打包输出文件夹
  outputDir: 'dist',
  // 部署应用包时的基本 URL
  publicPath:  process.env.NODE_ENV === 'production' ? 'http://47.96.2.170/dist/' : './',
  // server 配置
  devServer: {
      host: '0.0.0.0',
      port: 4000,
      open: false,
  }
}