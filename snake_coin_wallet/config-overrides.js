const rewireMobX = require('react-app-rewire-mobx')

const rewireAntd = require('react-app-rewire-antd')
const rewireCssModules = require('react-app-rewire-css-modules')

module.exports = function override(config, env) {
  //do stuff with the webpack config...

  let conf = rewireCssModules(Object.assign({}, config), ...env)
  conf = rewireAntd()(conf, env)
  conf = rewireMobX(conf, env)

  return conf
}
