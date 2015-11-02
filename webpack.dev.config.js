var path = require('path');
var webpack = require('webpack');

var host = '0.0.0.0';
var port = '9000';

var config = {
  devtool: 'inline-source-map',
  entry: [
    'js/fullpage-es6.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: outputFile,
    publicPath: __dirname + '/static/'
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
new WebpackDevServer(webpack(config), {
  contentBase: './example',
  hot: true,
  debug: true
}).listen(port, host, function (err, result) {
  if (err) {
    console.log(err);
  }
});
console.log('-------------------------');
console.log('Local web server runs at http://' + host + ':' + port);
console.log('-------------------------');

module.exports = config;