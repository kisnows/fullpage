'use strict';

/**
 * Module Dependencies.
 */
var gulp = require('gulp');
var del = require('del');
var less = require('gulp-less');
var browserSync = require('browser-sync');
var reload = browserSync.reload;
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var htmlreplace = require('gulp-html-replace');
var htmlmin = require('gulp-minify-html');
var cssmin = require('gulp-minify-css');
var jsmin = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var header = require('gulp-header');

/**
 * Package
 */
var pkg = require('./package.json');

/**
 * Templates
 */
var date = new Date();
var year = date.getFullYear();
var month = date.getMonth() + 1;
var day = date.getDate();

var meta = ['/*!',
    ' * <%= pkg.name %>',
    ' *',
    ' * @version: <%= pkg.version %>',
    ' * @update: ' + year + '-' + month + '-' + day + '',
    ' * Copyright (c) ' + year + ', <%= pkg.author.email %>',
    ' */',
    ''].join('\n');

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
    logPrefix: 'moas'
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
        .pipe(gulp.dest('src/css'))
        .pipe(reload({stream: true}));
});

/**
 * Lint task
 */
gulp.task('lint', function () {
    gulp.src(['src/js/**/*.js', 'gulpfile.js', '!src/js/libs/*.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(stylish));
});

/**
 * Bundle task
 */
gulp.task('bundle', ['requirejs'], function () {
    gulp.src(['dist/build/app.js'])
        .pipe(header(meta, {'pkg': pkg}))
        .pipe(gulp.dest('dist/build'));
});

/**
 * Replace css js link name task
 */
gulp.task('replace', function () {
    return gulp.src('src/index.html')
        .pipe(htmlreplace({
            js: {
                src: [['build/app', 'build/require.js']],
                tpl: '<script data-main="%s" src="%s"></script>'
            },
            css: 'build/app.css'
        }))
        .pipe(gulp.dest('dist'));
});

/**
 * Min task
 */
gulp.task('htmlmin', ['replace'], function () {
    return gulp.src(['src/**/*.html', '!src/index.html', 'dist/index.html'])
        .pipe(htmlmin({empty: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('cssmin', function () {
    return gulp.src('src/css/*.css', {base: './src'})
        .pipe(cssmin())
        .pipe(header(meta, {'pkg': pkg}))
        .pipe(gulp.dest('dist'));
});

gulp.task('jsmin', function () {
    return gulp.src(['src/js/*.*'])
        .pipe(jsmin())
        .pipe(gulp.dest('dist/build'));
});

gulp.task('imagemin', function () {
    return gulp.src('src/img/*', {base: './src'})
        .pipe(imagemin())
        .pipe(gulp.dest('dist'));
});

gulp.task('compress', ['htmlmin', 'cssmin', 'jsmin', 'imagemin']);

/**
 * Copy task
 */
gulp.task('copy', function () {
    return gulp.src(['src/api/*', 'src/font/*', 'src/**/*.js'], {base: './src'})
        .pipe(gulp.dest('dist'));
});

/**
 * Clean task
 */
gulp.task('clean', function (cb) {
    del(['dist'], cb);
});

/**
 * Default task
 */
gulp.task('default', ['less', 'browser-sync'], function () {
    gulp.watch('src/less/**/*.less', ['less']);
});

/**
 * Build task
 */
gulp.task('build', ['compress', 'copy', 'bundle']);
