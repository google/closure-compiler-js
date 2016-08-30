This folder contains a toy project that compiles with the Closure Compiler in JS.

You'll need `gulp`.
If you don't have it, run `npm install -g gulp`.
Then, check out this repo, install the dependencies, and run the Gulp tool-

```bash
$ git clone https://github.com/google/closure-compiler-js.git
$ cd closure-compiler-js/samples
$ npm install
$ gulp
```

This will generate an output file and source map inside `dist`.
You can run the `output.min.js` file with Node, or inside a browser.