var path = require('path')
var webpack = require('webpack')
var ExtractTextPlugin = require('extract-text-webpack-plugin')

// без него иногда бывают ошибки при сборке
require('es6-promise').polyfill()

var localIdentName = "localIdentName=[name]-[local]_[hash:base64:5]"
var cssLoaderString = "css?modules&importLoaders=1&" + localIdentName + "!postcss"

var postcss_modules_value = require('postcss-modules-values')
var precss = require('precss')
var post_cssnext = require('postcss-cssnext')

function postcss() {
  return [
    postcss_modules_value,
    precss,
    post_cssnext,
  ]
}

var clientRendering = {
  // The configuration for the client-side rendering
  name: "client-side rendering",
  entry: {
    bundle: ['./src/client.js']
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: '[name].js',
    chunkFilename: '[id].[name].js',
    library: '[name]',
    publicPath: '/build/'
  },
  plugins: [
    new webpack.DefinePlugin({ 
      'process.env.NODE_ENV': '"production"'
    }),
    new ExtractTextPlugin('[name].css', {allChunks: true, disable: false}),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": ["es2015", "react", "stage-0"]
        }
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract("style", cssLoaderString)
      },    
      {
        test: /\.(woff|woff2|eot|ttf|svg)(\?[\w\d\#]+)?$/, 
        loader: 'url?limit=100000'
      },
      {
        test: /\.gif$/,
        loader: 'url?name=[name].[ext]'
      },
    ]
  },
  postcss: postcss
}

var serverRendering = {
  // The configuration for the server-side rendering
  name: "server-side rendering",
  entry: {
    bundle: './server.js'
  },
  target: "node",
  externals: /^[a-z\-0-9]+$/,
  output: {
    path: path.join(__dirname, 'build'),
    filename: "[name].server.js",
    libraryTarget: "commonjs2"
  },
  plugins: [
    new webpack.DefinePlugin({ 
      'process.env.NODE_ENV': '"production"'
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          "presets": ["es2015", "react", "stage-0"]
        }
      },
      {
        test: /\.css$/,
        loader: 'css/locals?module&' + localIdentName + '!postcss',
      },
    ]
  },
  node: {
    __filename: true,
    __dirname: true,
    console: true
  },
  postcss: postcss
}


module.exports = [clientRendering, serverRendering]