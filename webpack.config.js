var path = require('path');
var webpack = require('webpack');
var pkg = require('./package.json');
var date = new Date();
var banner = `
${pkg.name} ${pkg.version}
Author: ${pkg.author}
Homepage: ${pkg.homepage}
Release under ${pkg.license}.
update ${date.toLocaleDateString()}
`;

var config = {
  devtool: 'cheap-module-eval-source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'fullpage.js',
    publicPath: path.resolve(__dirname, 'build'),
  },
  plugins: [new webpack.BannerPlugin(banner)],
  module: {
    rules: [{ test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' }],
  },
};

if (process.env.NODE_ENV === 'production') {
  config.devtool = null;
  config.output = {
    path: path.resolve(__dirname, 'build'),
    filename: 'fullpage.min.js',
  };
  config.plugins.push(new webpack.optimize.UglifyJsPlugin());
}

module.exports = config;
