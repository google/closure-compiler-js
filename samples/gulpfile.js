/*
 * Copyright 2016 The Closure Compiler Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Gulpfile to compile with Closure Compiler in JS.
 */

const compiler = require('google-closure-compiler-js').gulp();
const gulp = require('gulp');
const sourcemaps = require('gulp-sourcemaps');

gulp.task('default', function() {
  return gulp.src(['src/helper.js', 'src/index.js'])
    .pipe(sourcemaps.init())
    .pipe(compiler({
      jsOutputFile: 'output.min.js',  // filename returned to gulp
      compilationLevel: 'ADVANCED',   // as opposed to 'SIMPLE', the default
      warningLevel: 'VERBOSE',        // complain loudly on errors
      createSourceMap: true,          // create output source map
      processCommonJsModules: true,   // needed to support require()
    }))
    .pipe(sourcemaps.write('/'))
    .pipe(gulp.dest('./dist'));
});
