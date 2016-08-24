# closure-compiler-js

Check, compile, transpile, optimize and compress JavaScript with Closure Compiler in JS

This repo tracks issues related to the publication to npmjs.org and associated plugins.
Any bugs not related to the plugins themselves should be reported to the [main repository](https://github.com/google/closure-compiler/).

Unlike other packages, this allows Closure Compiler to run entirely in JS.
*Java is not required.*

This is an experimental release- some features are not available and performance may not be on-par with the Java implementation.

## Usage

First, install the latest version-

```bash
npm install --save google-closure-compiler-js
```

### Native Node Usage

The module provides `compile` as a low-level method to compile JavaScript.
By default, this compiles ES6 to ES5 and includes the default set of ECMAScript externs files.
For example-

```js
const compile = require('google-closure-compiler-js').compile;

const flags = {
  jsCode: [{src: 'const x = 1 + 2;'}],
};
const out = compile(flags);
console.info(out.compiledCode);  // will print 'var x = 3;\n'
```

### Build Systems

#### Webpack

Your `webpack.config.js` should look like this-

```js
const ClosureCompiler = require('google-closure-compiler-js').webpack;
const path = require('path');

module.exports = {
  entry: [
    path.join(__dirname, 'app.js')
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.min.js'
  },
  plugins: [
    new ClosureCompiler({
      options: {
        languageIn: 'ECMASCRIPT6',
        languageOut: 'ECMASCRIPT5',
        compilationLevel: 'ADVANCED',
        warningLevel: 'VERBOSE',
      },
    })
  ]
};
```

#### Gulp

Your `gulpfile.js` should contain a task like this-

```js
const compiler = require('google-closure-compiler-js').gulp();

gulp.task('script', function() {
  return gulp.src('./path/to/src.js', {base: './'})
      // your other steps here
      .pipe(compiler({
          compilationLevel: 'SIMPLE',
          warningLevel: 'VERBOSE',
          outputWrapper: '(function(){\n%output%\n}).call(this)',
          jsOutputFile: 'output.min.js',  // outputs single file
          createSourceMap: true,
        }))
      .pipe(gulp.dest('./dist'));
});
```

As of release v20160822, commonJS imports may be broken: we recommend that you compile a single file only (e.g. via Browserify or other tools), or use ES6 imports.

### Flags

The Closure Compiler in JS supports many of the flags supported by the Java-based Closure Compiler.
For now, the supported flags are [listed in source](https://github.com/google/closure-compiler/blob/master/src/com/google/javascript/jscomp/gwt/client/GwtRunner.java#L93).

Notably, unless you're using a build system, you have to specify code via flags.
Both `jsCode` and `externs` accept an array containing objects with `src`, `path`, and `sourceMap` properties.
For those of you familiar with [Closure syntax](https://developers.google.com/closure/compiler/docs/js-for-compiler), that's `Array<{src: string, path: string, sourceMap: string}`.

<!--
Using `path`, you can construct a virtual filesystem for use with ES6 imports or CommonJS imports (although don't forget to specify `processCommonJsModules: true`).
-->

## License

Copyright 2016 The Closure Compiler Authors

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

## Version History

Closure Compiler release notes can be found on the
[main repository wiki](https://github.com/google/closure-compiler/wiki/Binary-Downloads).
