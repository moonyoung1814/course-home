'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://47.94.168.183:7002/api/"',
  PROXY_REQUEST : true  // 开启代理
})
