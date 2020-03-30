const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const cleanCSS = require('gulp-clean-css');
const eslint = require('gulp-eslint');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');
const stylelint = require('gulp-stylelint');
const uglify = require('gulp-uglify');
const ghpages = require('gh-pages');


function lintStyles() {
  return gulp.src([
    './_assets/scss/**/*.scss',
    '!./_assets/scss/vendor/_normalize.scss',
    '!./_assets/scss/fonts/*.scss'
  ])
    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
}

function styles() {
  return gulp.src('./_assets/scss/app.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(cleanCSS())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./assets/css'));
}

function lintJs() {
  return gulp.src([
    './_assets/js/components/_formcarry.js',
    './_assets/js/components/_infiniteScroll.js',
    './_assets/js/components/_mailChimp.js',
    './_assets/js/components/_miscellaneous.js',
    './_assets/js/components/_pageTransition.js',
    './_assets/js/components/_popup.js',
    './_assets/js/_inits.js'
  ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
}

function scripts() {
  return browserify('./_assets/js/app.js')
    .transform('babelify', {presets: ['@babel/preset-env']})
    .bundle()
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(rename({suffix: '.min'}))
    .pipe(gulp.dest('./assets/js'));
}

function deploy() {
  return ghpages.publish('_site');
}

function watch() {
  gulp.watch('./_assets/scss/**/*.scss', styles);
  gulp.watch('./_assets/js/**/*.js', scripts);
}

const serve = gulp.series(styles, scripts, watch);
const build = gulp.series(styles, scripts);
gulp.task('default', serve);
gulp.task('build', build);
gulp.task('deploy', deploy);

exports.lintJs = lintJs;
exports.lintStyles = lintStyles;
exports.styles = styles;
exports.scripts = scripts;
