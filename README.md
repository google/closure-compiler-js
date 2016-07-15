# closure-compiler-js

Check, compile, transpile, optimize and compress JavaScript with Closure Compiler in JS

This repo tracks issues related to the publication to npmjs.org and associated plugins.
Any bugs not related to the plugins themselves should be reported to the [main repository](https://github.com/google/closure-compiler/).

Unlike other packages, this allows Closure Compiler to run entirely in JS.
*Java is not required.*
However, this has a few tradeoffs- some features are not available and performance is not on-par with the Java implementation.

## Usage

### Installation

```bash
npm install --save google-closure-compiler-js
```

### Grunt/Gulp

As of July 2016, neither a Grunt Task nor a Gulp Plugin is available.
Contributions are welcome.

### Native Node Usage

The module provides `compile` as a low-level method to compile JavaScript.
By default, this compiles ES6 to ES5 and includes the default set of ECMAScript externs files.

```js
const compile = require('google-closure-compiler-js').compile;

const flags = {
  jsCode: [{source: 'const x = 1 + 2;'}],
};
const out = compile(flags);
console.info(out.compiledCode);  // will print 'var x = 3;\n'
```

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
