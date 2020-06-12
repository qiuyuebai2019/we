'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_PRE:'"/jspeed/"',
  BACKEND_URI:'"http://localhost:8082/"',
  IS_ENC_MODE:false,
  BAIDU_MAP_AK:'"hmbfIMVo79xR740Ge3q4yvDeKhAlCVfw"',
  DEFAULT_USERNAME:"'admin'",
  DEFAULT_PASSWORD:"'admin'"
})
