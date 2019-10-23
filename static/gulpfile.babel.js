
import gulp from "gulp"
import autoprefixer from "autoprefixer"
import del from 'del'

const { src, dest, watch, parallel, series } = require('gulp');
const $ = require("gulp-load-plugins")();


//= path
const path = {
    assets: ['assets'],
    pug : ['assets/*.pug'],
    sass: ['assets/scss/**/*.scss'],
    js  : ['assets/js/*.js'],
    img : ['assets/images/*.{jpg,png}'],
    dest: ['dist'],
    sassDest: ['dist/css'],
    jsDest: ['dist/js'],
    imgDest: ['dist/images'],
};

//= clean
export function clean()  {
    return del(['dist/*']);
}

//= pug
export function pug(cb)  {
    return src(path.pug)
    .pipe($.changed('path.dest'))
	.pipe($.plumber())
	.pipe($.pug({pretty: true}))
    .pipe(dest(path.dest))
    .pipe($.connect.reload())
}

//= sass
export function sass() {
    const processors = [ 
        autoprefixer()
    ];
    return src(path.sass)
    .pipe($.changed('path.sassDest'))
    .pipe($.sourcemaps.init())
    .pipe($.plumber())
    .pipe(
        $.sass({
            outputStyle: "compressed"
        }).on("error", $.sass.logError)
    )
    .pipe($.postcss(processors))
    .pipe($.sourcemaps.write("."))
    .pipe(dest(path.sassDest))
    .pipe($.connect.reload())
}

//= javascript
export function js() {
    return gulp
    .src([
        "./node_modules/jquery/dist/jquery.slim.min.js",
        "./node_modules/bootstrap/dist/js/bootstrap.bundle.min.js"
    ], path.js)
    .pipe($.changed('path.jsDest'))
    .pipe($.plumber())
    .pipe($.concat("vendor.js"))
    .pipe($.uglify())
    .pipe(dest(path.jsDest))
    .pipe($.connect.reload())
}

//= image min
export function image()  {
    return src(path.img)
    .pipe($.changed('path.imgDest'))
	.pipe($.imagemin([
		$.imagemin.gifsicle({interlaced: true}),
		$.imagemin.jpegtran({progressive: true}),
		$.imagemin.optipng({optimizationLevel: 5}),
		$.imagemin.svgo({
			plugins: [
				{removeViewBox: true},
				{cleanupIDs: false}
			]
		})
	]))
    .pipe(dest('dist/images'))
    .pipe($.connect.reload())
}

//= browser sync
export function browser()  {
	$.connect.server({
        root: path.dest,
        port: '9999',
        livereload: true
    })
    watch(path.pug, pug);
    watch('assets/**/*.pug', pug);
    watch(path.sass, sass);
    watch('assets/sass/*', sass);
    watch(path.js, js);
    watch(path.img, image);
}

//= watch
exports.default = () => (
    watch('.', series(
        clean,
        parallel(image, pug, sass, js, browser)
	))
)