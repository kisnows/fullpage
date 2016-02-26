var path = require('path')
var webpack = require('webpack')
var pkg = require('./package.json')
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();
var banner = `
${pkg.name} ${pkg.version}
Author: ${pkg.author}
Homepage: ${pkg.homepage}
Release under ${pkg.license}.
update ${year}-${month}-${day}
`

var config = {
  devtool: 'cheap-module-eval-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'fullpage.js',
    publicPath: path.resolve(__dirname, 'static')
  },
  plugins: [
    new webpack.BannerPlugin(banner),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }
    ]
  }
}

if (process.env.NODE_ENV === 'production') {
  config.devtool = null
  config.output = {
    path: path.resolve(__dirname, 'build'),
    filename: 'fullpage.min.js'
  }
  config.plugins.push(new webpack.optimize.UglifyJsPlugin())
}

module.exports = config
