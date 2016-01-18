'use strict';

/**
 * Module Dependencies.
 */
var gulp         = require('gulp');
var del          = require('del');
var less         = require('gulp-less');
var autoprefixer = require('gulp-autoprefixer');
var browserSync  = require('browser-sync');
var reload       = browserSync.reload;
var jsmin        = require('gulp-uglify');
var rename       = require('gulp-rename');

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

gulp.task('js', function () {
    return gulp.src('src/js-es6/index.js')
        .pipe(sourcemaps.init())
        .pipe(babel({
            presets: ['babel-preset-es2015']
        }))
        .pipe(concat('all.js'))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('dist'));
});

//build==================================
gulp.task('jsmin', function () {
    return gulp.src(['src/js/fullpage.js','src/js/fullpage-es6'])
        .pipe(jsmin())
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest('dist/js'));
});
gulp.task('fullpage-css', function () {
    gulp.src('src/less/fullpage.less')
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ['last 2 versions'],
            cascade: true,
            remove: true
        }))
        .pipe(gulp.dest('dist/css'));
});
gulp.task('copy', function () {
    gulp.src(['src/less/fullpage.less', 'src/js/fullpage*.js'], {base: './src'})
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

