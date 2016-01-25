'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import webpack from 'webpack';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const libFolder = 'lib';
const libFile = pkg.library.name + '.js';
const sources = './src/**/*.js';

gulp.task('default', ['build']);

// Build as a Node library
gulp.task('build', ['lint'], () =>
  gulp.src([
    sources
  ])
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat(libFile))
    // Output files
    .pipe($.sourcemaps.write('.'))
    .pipe(gulp.dest(libFolder))
);

// Lint javascript
gulp.task('lint', () =>
  gulp.src(sources)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
);

// Sets environment variable
function setEnv(buildEnv){
  $.env({
    vars: {
      BUILD_ENV: buildEnv
    }
  });
}
