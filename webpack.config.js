var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
      'js/fullpage-es6.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFile,
    publicPath: __dirname+'/static/'
  },
  module: {
    loaders: [{
      test: /\.js$/,
      loader: 'babel',
      exclude: /node_modules/,
      include: __dirname
    }, {
        test: /\.css$/,
        loader: 'style!css!autoprefixer?{browsers:["last 2 version", "> ie8"]}',
      }]
  },
  resolve: {
    root: path.resolve('./src'),
    extensions: ['', '.js']
  }
};
//webpack-dev-server --inline