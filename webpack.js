import webpack from 'webpack'
import webpackConfig from './webpack.config'

module.exports = (app) => {
  const compiler = webpack(webpackConfig);
  
  app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    publicPath: webpackConfig.output.publicPath
  }));

  app.use(require('webpack-hot-middleware')(compiler))
}