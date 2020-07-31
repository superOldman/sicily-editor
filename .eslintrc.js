module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    'parser': 'babel-eslint',
    'sourceType': 'module'
  },

  // 指定环境
  env: {
    // 浏览器全局
    browser: true,
    node: true,
    es6: true
  },
  // https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style
  extends: [
    'plugin:vue/essential',
    'eslint:recommended'
  ],
  // required to lint *.vue files
  plugins: [
    // 'html'
    'vue'
  ],

  /**
     * "off"或者0    //关闭规则关闭
     * "warn"或者1    //在打开的规则作为警告（不影响退出代码）
     * "error"或者2    //把规则作为一个错误（退出代码触发时为1）
     */
  rules: {
    'semi': 1,
    'quotes': [1, 'single'],//引号类型

    'no-unused-vars': 1,// 检查未使用变量

    'no-undef': 0,// 检查未定义就使用变量

    'no-useless-escape': 0,// 转义符
    'indent': [2, 2],//缩进风格
    'no-trailing-spaces': 1,//一行结束后面不要有空格
  }
};