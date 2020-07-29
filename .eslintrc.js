

module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        "parser": 'babel-eslint',
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
        "plugin:vue/essential",
        "eslint:recommended"
    ],
    // required to lint *.vue files
    plugins: [
        // 'html'
        'vue'
    ],
    rules: {
        // "semi": "error",

        // 检查未使用变量
        // 'no-unused-vars': 'off',
        // 检查未定义就使用变量
        'no-undef': 'off',
        // 转义符
        'no-useless-escape': "off"
    }
};