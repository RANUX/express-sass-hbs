'use strict';

const gulp = require('gulp');
const browserSync = require('browser-sync');
const nodemon = require('gulp-nodemon');
const sass = require('gulp-sass');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const sourcemaps = require('gulp-sourcemaps');
const postcss = require('gulp-postcss');

// we'd need a slight delay to reload browsers
// connected to browser-sync after restarting nodemon
const BROWSER_SYNC_RELOAD_DELAY = 1000;

gulp.task('sass', () => {
  const processors = [
       autoprefixer('> 5%', 'ie >= 9', 'safari 5', 'ios 6', 'android 4'),
       pxtorem({
         rootValue: 10,
          propList: ['*']
       })
   ];

  return gulp.src('sass/**/*.+(scss|sass)')
      .pipe(sourcemaps.init())
      .pipe(sass({
          outputStyle: 'nested',
          includePaths: ['node_modules/susy/sass'],
          noCache: true,
      })
      .on('error', sass.logError))
      .pipe(postcss(processors))
      //.pipe(sourcemaps.write())
      //.pipe(minifyCss())
      .pipe(gulp.dest('public/css'))         // Выгружаем результата в папку src/css
      .pipe(browserSync.reload({ stream: true })); // Обновляем CSS на странице при изменении
});

gulp.task('nodemon', (cb) => {
  let called = false;
  return nodemon({
    //args: ['DEBUG=myapp:*'],
    // nodemon our expressjs server
    script: './bin/server.js',
    ext: 'js json hbs',

    // watch core server file(s) that require server restart on change
    watch: ['bin', 'views']
  })
    .on('start', () => {
      // ensure start only got called once
      if (!called) { cb(); }
      called = true;
    })
    .on('restart', () => {
      // reload connected browsers after a slight delay
      setTimeout(() => {
        console.log('RESTARTING');
        browserSync.reload({
          stream: false
        });
      }, BROWSER_SYNC_RELOAD_DELAY);
    });
});

gulp.task('browser-sync', ['nodemon'], () => {
  // for more browser-sync config options: http://www.browsersync.io/docs/options/
  browserSync({

    // informs browser-sync to proxy our expressjs app which would run at the following location
    proxy: 'http://localhost:3000',

    // informs browser-sync to use the following port for the proxied app
    // notice that the default port is 3000, which would clash with our expressjs
    port: 4000,

    // open the proxied app in chrome
    browser: ['google-chrome']
  });
});

gulp.task('js', () => {
  return gulp.src('public/**/*.js');
    // do stuff to JavaScript files
    //.pipe(uglify())
    //.pipe(gulp.dest('...'));
});

gulp.task('css', () => {
  return gulp.src('public/**/*.css')
    .pipe(browserSync.reload({ stream: true }));
});

gulp.task('bs-reload', () => {
  browserSync.reload();
});

gulp.task('default', ['browser-sync'], () => {
  gulp.watch('public/**/*.js', ['js', browserSync.reload]);
  gulp.watch('public/**/*.css', ['css']);
  gulp.watch('public/**/*.html', ['bs-reload']);
  gulp.watch('sass/**/*.+(scss|sass)', ['sass']);
});
