/* diabled-eslint */
module.exports = {
  // 打包输出文件夹
  outputDir: 'sicilyEditor',
  // 部署应用包时的基本 URL
  publicPath: process.env.NODE_ENV === 'production' ? 'http://sicilymarmot.top/sicilyEditor/' : './',
  // server 配置
  devServer: {
      host: '0.0.0.0',
      port: 5503,
      open: false,
  }
};