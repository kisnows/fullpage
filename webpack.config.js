var webpack          = require('webpack');
var env              = process.env.WEBPACK_ENV;
var WebpackDevServer = require('webpack-dev-server');
var path             = require('path');

var appName = 'app';
var host    = '0.0.0.0';
var port    = '9000';

var plugins = [],
    outputFile;

env = 'dev';


outputFile = appName + '.js';

var config = {
    entry: ['webpack/hot/dev-server', path.resolve(__dirname, 'src/js-es6/index.js')],
    devtool: 'source-map',
    output: {
        path: __dirname + '/build',
        filename: outputFile,
        publicPath: __dirname + '/example'
    },
    module: {
        loaders: [
            {
                test: /(\.jsx|\.js)$/,
                loader: 'babel',
                exclude: /(node_modules|bower_components)/
            }, {
                test: /\.less&/,
                loader: "style-loader!css-loader!autoprefixer-loader!less-loader"
            }, {
                test: /\.(png)|(jpg)$/,
                loader: 'url?limit=25000'
            }
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['.js']
    },
    plugins: plugins
};

if (env === 'dev') {
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
}

module.exports = config;
