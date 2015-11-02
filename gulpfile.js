'use strict';

/**
 * Module Dependencies.
 */
var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var jsmin = require('gulp-uglify');
var rename = require('gulp-rename');


/**
 * gulp.task('webpack:dev-server', function () {
  var devServerConfig = Object.create(myConfig)
  // webpack need this to send request to webpack-dev-server
  devServerConfig.plugins = devServerConfig.plugins || []
  devServerConfig.plugins.push(new webpack.HotModuleReplacementPlugin())
  // inline mode
  devServerConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080', 'webpack/hot/dev-server')
  var compiler = webpack(devServerConfig)
  new WebpackDevServer(compiler, {
    // contentBase: {target: 'http://localhost:3000/'},
    // Set this as true if you want to access dev server from arbitrary url.
    // This is handy if you are using a html5 router.
    historyApiFallback: false,
    proxy: {
      '*': 'http://localhost:3000'
    },
    publicPath: '/build/',
    lazy: false,
    hot: true
  }).listen(8080, 'localhost', function (err) {
    if (err) throw new gutil.PluginError('webpack-dev-server', err)
    // Server listening
    gutil.log('[webpack-dev-server]', 'http://localhost:8080/')
  })
})
 */
/**
 * BrowserSync config
 */
var serveConfig = {
    files: [
        'src/**/*.html',
        'src/js/**/*.js',
        'src/api/**/*.json',
        'src/img/*.{png|gif}',
        'src/font/iconfont.{svg|ttf}'
    ],
    server: {
        baseDir: 'src/'
    },
    open: true,
    notify: false,
    logPrefix: 'fullPage'
};


/**
 * Serve task
 */
gulp.task('browser-sync', function () {
    browserSync(serveConfig);
});

/**
 * Less task
 */
gulp.task('less', function () {
    return gulp.src('src/less/app.less')
        .pipe(less())
        .on('error', function (e) {
            console.log(e);
        })
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('src/css'))
        .pipe(reload({stream: true}));
});

//build==================================
gulp.task('jsmin', function () {
    return gulp.src('src/js/fullPage.js')
        .pipe(jsmin())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('fullpage-css', function () {
    gulp.src('src/less/fullPage.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('dist/css'));
});
gulp.task('copy', function () {
    gulp.src(['src/less/fullPage.less', 'src/js/fullPage.js'], {base: './src'})
        .pipe(gulp.dest('dist'));
});

/**
 * build task
 */
gulp.task('build', ['jsmin', 'fullpage-css', 'copy']);

/**
 * Default task
 */
gulp.task('default', ['less', 'browser-sync'], function () {
    gulp.watch('src/less/**/*.less', ['less']);
});

