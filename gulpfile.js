//书写gulp打包配置文件

//1.导入gulp的第三方模块
const gulp = require('gulp');
const cssmin = require('gulp-cssmin'); //压缩css的包
const rename = require('gulp-rename'); //文件重命名
const autoprefixer = require('gulp-autoprefixer'); //给css属性加前缀
const uglify = require('gulp-uglify'); //压缩js模块
const babel = require('gulp-babel'); //es6转es5
const htmlmin = require('gulp-htmlmin'); //压缩html模块
const webserver = require('gulp-webserver'); //开启服务器模块，就是一个函数
const del = require('del'); //删除文件夹的模块

//书写一个移动lib文件夹的方法
function libHandler() {
    return gulp.src('./src/lib/**').pipe(gulp.dest('./dist/lib'));
}
//module.exports.lib = libHandler;

//书写一个移动images文件夹的方法
function imgHandler() {
    return gulp.src('./src/images/**').pipe(gulp.dest('./dist/images'));
}
//module.exports.img = imgHandler;

//书写一个压缩并移动css文件夹的方法
function cssHandler() {
    return gulp.src('./src/css/*.css') //找到文件
        .pipe(autoprefixer()) //加前缀
        .pipe(cssmin()) //压缩
        .pipe(gulp.dest('./dist/css')) //移动
}
//module.exports.css = cssHandler;

//书写一个压缩并移动js文件夹的方法
function jsHandler() {
    return gulp.src('./src/js/**')
        .pipe(babel({
            presets: ['@babel/env']
        })) //把es6转es5
        .pipe(uglify()) //压缩
        .pipe(gulp.dest('./dist/js')) //移动
}
//module.exports.js = jsHandler;

//书写一个压缩并移动html的文件夹的方法
function htmlHandler() {
    return gulp.src('./src/pages/*.html')
        .pipe(htmlmin({
            collapseWhitespace: true, //删除所有空格，变成一行
            removeAttributeQuotes: true, //去除html属性值的引号
            minifyCSS: true, //把html文件里面的style的标签里面的压缩
            minifyJS: true, //把html文件里面的script的标签里面的压缩
            collapseBooleanAttributes: true, //把值为布尔值的属性简写
            removeComments: true //移除注释
        }))
        .pipe(gulp.dest('./dist/pages'))
}
//module.exports.html = htmlHandler;

//书写一个开启静态服务器的任务
function serverHandler() {
    return gulp.src('./dist') //找到要开启服务器的根目录
        .pipe(webserver({
            //需要一些配置项
            port: 8080, //端口号
            open: './pages/home.html', //输入ip自动打开的页面
            livereload: true, //自动刷新浏览器，热启动
            // proxies: [{
            //     //每一个代理配置就是一个对象
            //     source: '/caihongpi',
            //     target: 'http://api.tianapi.com/txapi/caihongpi/index?key=70d50f05fcd5610bb3cbfe32094c0519'
            // }]

        }))
}
//module.exports.server = serverHandler;

//书写一个任务，删除dist目录
function delHandler() {
    return del(['./dist'])
}
//module.exports.del = delHandler;

//自动监控文件
function watchHandler() {
    gulp.watch('./src/css/*.css', cssHandler);
    gulp.watch('./src/images/**', imgHandler);
    gulp.watch('./src/js/*.js', jsHandler);
    gulp.watch('./src/lib/**', libHandler);
    gulp.watch('./src/pages/*.html', htmlHandler);
}

//整合代码。一次压缩和移动。

//串行。一个一个完成
module.exports.default = gulp.series(
    delHandler,
    gulp.parallel(htmlHandler, jsHandler, cssHandler, imgHandler, libHandler),
    serverHandler,
    watchHandler
)