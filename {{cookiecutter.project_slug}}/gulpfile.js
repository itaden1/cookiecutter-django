
////////////////////////////////
		//Setup//
////////////////////////////////

// Plugins
var gulp = require('gulp'),
      pjson = require('./package.json'),
      gutil = require('gulp-util'),
      sass = require('gulp-sass'),
      autoprefixer = require('gulp-autoprefixer'),
      cssnano = require('gulp-cssnano'),
      {% if cookiecutter.custom_bootstrap_compilation == 'y' %}
      concat = require('gulp-concat'),
      {% endif %}
      rename = require('gulp-rename'),
      del = require('del'),
      plumber = require('gulp-plumber'),
      pixrem = require('gulp-pixrem'),
      uglify = require('gulp-uglify'),
      imagemin = require('gulp-imagemin'),
      spawn = require('child_process').spawn,
      browserSync = require('browser-sync').create();
      reload = browserSync.reload;


// Relative paths function
var pathsConfig = function (appName) {
  this.app = "./" + (appName || pjson.name);
  var vendorsRoot = 'node_modules/';

  return {
    {% if cookiecutter.custom_bootstrap_compilation == 'y' %}
    bootstrapSass: vendorsRoot + '/bootstrap/scss',
    vendorsJs: [
      this.app + '/static/js/vendor/bootstrap-native-v4.js'
    ],
    {% endif %}
    app: this.app,
    templates: this.app + '/templates',
    css: this.app + '/static/css',
    sass: this.app + '/static/sass',
    fonts: this.app + '/static/fonts',
    images: this.app + '/static/images',
    js: this.app + '/static/js'
  }
};

var paths = pathsConfig();

////////////////////////////////
		//Tasks//
////////////////////////////////

// Styles autoprefixing and minification
gulp.task('styles', function() {
  return gulp.src(paths.sass + '/project.scss')
    .pipe(sass({
      includePaths: [
        {% if cookiecutter.custom_bootstrap_compilation == 'y' %}
        paths.bootstrapSass,
        {% endif %}
        paths.sass
      ]
    }).on('error', sass.logError))
    .pipe(plumber()) // Checks for errors
    .pipe(autoprefixer({browsers: ['last 2 versions']})) // Adds vendor prefixes
    .pipe(pixrem())  // add fallbacks for rem units
    .pipe(gulp.dest(paths.css))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano()) // Minifies the result
    .pipe(gulp.dest(paths.css));
});

// Javascript minification
gulp.task('scripts', function() {
  return gulp.src(paths.js + '/project.js')
    .pipe(plumber()) // Checks for errors
    .pipe(uglify()) // Minifies the js
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js));
});


{% if cookiecutter.custom_bootstrap_compilation == 'y' %}
// Vendor Javascript minification
gulp.task('vendor-scripts', function() {
  return gulp.src(paths.vendorsJs)
    .pipe(concat('vendors.js'))
    .pipe(gulp.dest(paths.js))
    .pipe(plumber()) // Checks for errors
    .pipe(uglify()) // Minifies the js
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.js));
});
{% endif %}

// Image compression
gulp.task('imgCompression', function(){
  return gulp.src(paths.images + '/*')
    .pipe(imagemin()) // Compresses PNG, JPEG, GIF and SVG images
    .pipe(gulp.dest(paths.images))
});

{% if cookiecutter.use_docker == 'n' %}
// Run django server
gulp.task('runServer', function(cb) {
  var cmd = spawn('python', ['manage.py', 'runserver'], {stdio: 'inherit'});
  cmd.on('close', function(code) {
    console.log('runServer exited with code ' + code);
    cb(code);
  });
});
{% endif %}

// To use gulp alongside docker run the Docker container in 1 terminal, then run gulp in another.
// In the below configuration browsersync will proxy to the docker container at 0.0.0.0:8000

// combined watch/browsersync
gulp.task('serve', function(){
    browserSync.init(
      [paths.css + "/*.css", paths.js + "/*.js", paths.templates + '/*.html'], {
        proxy:  {% if cookiecutter.use_docker == 'y' %}"0.0.0.0:8000"{% else %}"localhost:8000"{% endif %}
    });
  gulp.watch(paths.sass + '/*.scss', gulp.series('styles'));
  gulp.watch(paths.css + '/*.css').on("change", reload);
  gulp.watch(paths.js + '/*.js', gulp.series('scripts')).on("change", reload);
  gulp.watch(paths.images + '/*', gulp.series('imgCompression'));
  gulp.watch(paths.templates + '/**/*.html').on("change", reload);
 });


// Default task
gulp.task('default', gulp.series(['styles', 'scripts', {% if cookiecutter.custom_bootstrap_compilation == 'y' %}'vendor-scripts', {% endif %}'imgCompression', 'serve']));

