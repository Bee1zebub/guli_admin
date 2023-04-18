'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  //BASE_API: '"https://easy-mock.com/mock/5950a2419adc231f356a6636/vue-admin"', //当前需要访问后端接口的地址
  BASE_API: '"http://localhost:8222"', //不要使用 https 使用nginx代理
})
