"use strict";

const gulp = require("gulp");
const browsersync = require("browser-sync");
const htmlmin = require('gulp-htmlmin');
const sass = require('gulp-sass');
const cleanCSS = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require("gulp-rename");


const dist = "./dist/";

gulp.task('imagemin', function () {
  return gulp.src('src/assets/img/**/*')
    .pipe(gulp.dest(dist + "/assets/img"))
    .pipe(browsersync.stream());
});

gulp.task('icons', function () {
  return gulp.src("src/assets/icons/**/*")
    .pipe(gulp.dest(dist + "/assets/icons"))
    .pipe(browsersync.stream());
});

gulp.task("copy-html", () => {
  return gulp.src("src/*.html")
    .pipe(htmlmin({
      collapseWhitespace: true
    }))
    .pipe(gulp.dest(dist))
    .pipe(browsersync.stream());
});

gulp.task('styles', function () {
  return gulp.src("src/assets/sass/**/*.+(scss|sass)")
    .pipe(sass({
      outputStyle: 'compressed'
    }).on('error', sass.logError))
    .pipe(rename({
      suffix: '.min',
      prefix: ''
    }))
    .pipe(autoprefixer())
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(gulp.dest(dist + "assets/css"))
    .pipe(browsersync.stream());
});

gulp.task("watch", () => {
  browsersync.init({
    server: {
      baseDir: "./dist/",
      serveStaticOptions: {
        extensions: ["html"]
      }
    },
    port: 3333,
    notify: true
  });

  gulp.watch("./src/*.html", gulp.parallel("copy-html"));
  gulp.watch("./src/assets/icons/**/*").on('all', gulp.parallel('icons'));
  gulp.watch("./src/assets/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
  gulp.watch('./src/assrts/img/**/*').on('all', gulp.parallel('imagemin'));
});

gulp.task("build", gulp.parallel("copy-html", "icons", "styles", "imagemin"));

gulp.task("default", gulp.parallel("watch", "build"));