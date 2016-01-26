'use strict';

// This gulpfile makes use of new JavaScript features.
// Babel handles this without us having to do anything. It just works.
// You can read more about the new JavaScript features here:
// https://babeljs.io/docs/learn-es2015/

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import pkg from './package.json';

const $ = gulpLoadPlugins();
const binFolder = 'bin';
const binFile = pkg.library.name + '.js';
const sources = './src/**/*.js';

gulp.task('default', ['build']);

// Build as a Node bin
gulp.task('build', ['lint'], () =>
  gulp.src([sources])
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat(binFile))
    // Output files
    .pipe(gulp.dest(binFolder))
);

// Lint javascript
gulp.task('lint', () =>
  gulp.src(sources)
    .pipe($.eslint())
    .pipe($.eslint.format())
    .pipe($.eslint.failOnError())
);
