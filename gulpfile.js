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
    open: false,
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

/**
 * Default task
 */
gulp.task('default', ['less', 'browser-sync'], function () {
    gulp.watch('src/less/**/*.less', ['less']);
});

