module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: false,
    'jest/globals': true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 8,
  },
  rules: {
    'consistent-return': ['off'],
    'no-use-before-define': ['off'],
    'no-unused-expressions': ['off'],
    'global-require': ['off'],
    semi: [2, 'never'],
  },
  plugins: ['jest'],
}
