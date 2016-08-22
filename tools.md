This file is scratchpad until the next release.

## Gulp

Your `gulpfile.js` should contain a task like this-

```js
const compiler = require('google-closure-compiler-js').gulp();

gulp.task('script', function() {
  return gulp.src('./src/**/*.js', {base: './'})
      .pipe(compiler({
          compilation_level: 'SIMPLE',
          warning_level: 'VERBOSE',
          output_wrapper: '(function(){\n%output%\n}).call(this)',
          js_output_file: 'output.min.js',  // outputs single file
          create_source_map: true
        }))
      .pipe(gulp.dest('./dist'));
});
```

## Webpack

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