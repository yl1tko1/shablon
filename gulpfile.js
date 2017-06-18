var gulp        = require('gulp'),
		sass        = require('gulp-sass'),
		browserSync = require('browser-sync'),
		concat      = require('gulp-concat'),
		uglify      = require('gulp-uglifyjs'),
		cssnano		= require('gulp-cssnano'),
		rename 		= require('gulp-rename'),
		del			= require('del'),
		imagemin 	= require('gulp-imagemin'),
		pngquant	= require('imagemin-pngquant'),
		cache 		= require('gulp-cache'),
		autoprefixer = require('gulp-autoprefixer');



gulp.task('sass', function(){
	return gulp.src('app/sass/*.sass')
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: false }))
	.pipe(gulp.dest('app/css/'))
	.pipe(browserSync.reload({stream: true}))
});

gulp.task('scripts', function(){
	return gulp.src([
		'app/libs/jquery/dist/jquery.min.js',
		])
	.pipe(concat('libs.min.js'))
	.pipe(uglify())
	.pipe(gulp.dest('app/js/'))
});


gulp.task('csslibs', ['sass'], function(){
	return gulp.src('app/css/libs.css')
	.pipe(cssnano())
	.pipe(rename({suffix: '.min'}))
	.pipe(gulp.dest('app/css/'))
});


gulp.task('browser-sync', function(){
	browserSync({
		proxy: "testwork/app",
		notify: false
	});
});


gulp.task('clean', function(){
	return del.sync('dist/');
});

gulp.task('clear', function(){
	return cache.clearAll();
});

gulp.task('img', function(){
	return gulp.src('img/*')
	.pipe(cache(imagemin({
		interlaced: true,
		progressive: true,
		svgoPlugins: [{removeViewBox: false}],
		une: [pngquant()]
		})))
	.pipe(gulp.dest('dist/img'));
});


gulp.task('watch', ['browser-sync', 'csslibs', 'scripts'], function(){
	gulp.watch('app/sass/*.sass', ['sass']);
	gulp.watch('app/**/*.html', browserSync.reload)
	gulp.watch('app/js/**/*.js', browserSync.reload)
	gulp.watch('app/css/*.css', browserSync.reload)
});


gulp.task('build', ['clean', 'img', 'sass', 'scripts'], function(){
	var buildcss = gulp.src([
		'app/css/*.css',
		'app/css/libs.min.css',
		])
	.pipe(gulp.dest('dist/css'));

	var buildfonts = gulp.src('app/fonts/**/*')
		.pipe(gulp.dest('dist/fonts'));

	var buildjs = gulp.src('app/js/**/*')
		.pipe(gulp.dest('dist/js'));

	var buildjs = gulp.src('app/img/**/*')
		.pipe(gulp.dest('dist/img/'));

	var buildhtml = gulp.src('app/**/*.php')
		.pipe(gulp.dest('dist/'));

	var allcss = gulp.src('app/layouts/*.css')
		.pipe(gulp.dest('dist/layouts'));

	var allfiles = gulp.src('app/*.*')
		.pipe(gulp.dest('dist'));


});