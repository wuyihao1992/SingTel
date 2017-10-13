'use strict';

var dev = true;

var fs = require('fs'),
    gulp = require('gulp'),
    sass = require('gulp-sass'),
    maps = require('gulp-sourcemaps'),
    pref = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    clean = require('gulp-clean'),          // now using this to clean *.bak & *.map files
    cleanCSS = require('gulp-clean-css'),
    rename = require('gulp-rename'),
    zip = require('gulp-zip'),
    del = require('del');

var runSequence = require('run-sequence').use(gulp);
var argv = require('yargs').argv;
var browserSync = require('browser-sync').create();
var gulpif = require('gulp-if');

// var sprite = require('css-sprite').stream;
// var sprite = require('sprity');
// var spriter = require('gulp-css-spriter');
var spritesmith = require('gulp.spritesmith');

// es6 to es5
var babel = require('gulp-babel');

var clearOption = {
    read : false,
    force : true
};

/**
 * 清除打包文件
 */
gulp.task('clean', function(cb) {
    return del([
        // 'build/**/*'
        'build/css/**/*'
    ], cb);
});

/**
 * 打包资源文件 js & css
 */
gulp.task('framework', function() {
    // TODO: require CDN
    gulp.src(['bower_components/css.min/index.js']).pipe(concat('css.min.js')).pipe(gulp.dest('build/assets/js/'));

    // TODO: lib js
    gulp.src([
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/nprogress/nprogress.js',
        'bower_components/sweetalert2/dist/sweetalert2.min.js'
    ])
    .pipe(maps.init())
    .pipe(concat('framework.js'))
    .pipe(uglify())
    .pipe(maps.write('.'))
    .pipe(gulp.dest('build/assets/js/'));

    // TODO: lib css
    gulp.src([
        'bower_components/nprogress/nprogress.css',
        'bower_components/sweetalert2/dist/sweetalert2.min.css'
    ])
    .pipe(maps.init())
    .pipe(cleanCSS())
    .pipe(concat('framework.css'))
    .pipe(maps.write('.'))
    .pipe(gulp.dest('build/assets/css/'));

    // TODO: layer
    gulp.src(['bower_components/layer/src/**/*']).pipe(gulp.dest('build/assets/layer'));

    // TODO: layer skin
    gulp.src(['css/layerSkin*/*.css']).pipe(gulp.dest('build/assets/layer/skin'));

    // TODO: requireJS
    gulp.src([
        'bower_components/requirejs/require.js'
    ])
        .pipe(maps.init())
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(maps.write('.'))
        .pipe(gulp.dest('build/assets/js/'));
});

/**
 * es6 转换成 es5
 * npm install --save-dev gulp-babel
 * npm install --save-dev babel-preset-es2015
 * .babelrc 文件 : { "presets": ["es2015"] }
 */
gulp.task('toes5', function () {
    return gulp.src('js/models-es6/**/*.js') // ES6 源码存放的路径
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(gulp.dest('js/models/'));      //转换成 ES5 存放的路径
});

/**
 * 编译.scss
 */
gulp.task('sass', function() {
    // gulp.src(['./source/img/*']).pipe(gulp.dest('./build/img'));
    gulp.src(['./source/sass/icons/*']).pipe(gulp.dest('./build/css/icons'));

    return gulp.src('./source/sass/**/*.scss')
        .pipe(maps.init())
        .pipe(sass({
            outputStyle: 'compressed'
        }).on('error', sass.logError))
        .pipe(pref(['last 10 versions']))
        //.pipe(rename({suffix: '.min'}))
        //.pipe(cleanCSS())
        .pipe(maps.write('.'))
        .pipe(gulp.dest('./build/css'));
});

/**
 * gulp.spritesmith 生成雪碧图
 */
gulp.task('spriteSmith', function () {
    return gulp.src('./source/sass/icons/*.png')
        .pipe(spritesmith({
            imgName: 'icons/spriteSmith.png',
            cssName: 'spriteSmith.css',
            padding: 5,
            algorithm: 'binary-tree',
            cssTemplate: "./source/sass/icons/spriteTemplate.css"
        }))
        .pipe(gulp.dest('./build/css'));
});

/**
 * 监听任务
 */
gulp.task('watch', ['clean', 'sass'], function() {
    gulp.watch('./source/sass/**/*.scss', ['sass']);       // watch的时候路径不要用'./path'(当前目录),直接使用'/path'(根目录),不然会导致新增文件无法被watch
    // gulp.watch('/js/models-es6/**/*.js', ['toes5']);
});

gulp.task('default', ['watch']);

/**
 * function(cb)回调，用于配置异步任务。避免边删除边编译的情况。
 */
gulp.task('build', ['clean'], function(cb) {
    var taskArr = [];
    if (dev){
        // taskArr = ['framework', 'sass', 'spriteSmith'];
        taskArr = ['framework', 'sass'];
    }else {
        // taskArr = ['framework', 'sass', 'spriteSmith', 'toes5'];
    }
    return gulp.start(taskArr, cb);
});

/**
 * 页面热更新调试
 */
gulp.task('browser-sync', function() {
    browserSync({
        server: {
            baseDir: "./"                                    // 指定服务器启动根目录
        }
    });
    gulp.watch("./**/*.*").on('change', browserSync.reload); //监听任何文件变化，实时刷新页面
});

/**
 * 清除.bak 与 .map文件
 * 正式环境时执行此任务
 */
gulp.task('clear', function (cb) {
    return gulp.src([
        '**/*.bak',
        'build/css/**/*.map',
        'build/assets/**/*.map'
    ])
        .pipe(clean(clearOption));
});
