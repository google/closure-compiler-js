#!/usr/bin/env node
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
 * @fileoverview Command-line interface for Google Closure Compiler in JS
 */

'use strict';

const fs = require('fs');
const path = require('path');
const minimist = require('minimist');
const compile = require('./compile.js');
const logger = require('./logger.js');

const argv = minimist(process.argv.slice(2), {
  alias: {h: 'help', v: 'version'},
});
if (argv.help) {
  const helpfile = path.join(__dirname, 'usage.txt');
  return fs.readFile(helpfile, 'utf8', (err, src) => {
    if (err) {
      error(err)
    } else {
      console.log(src);
    }
  });
}
if (argv.version) {
  return console.log(require('./package.json').version);
}

const infiles = argv._.concat(toArray(argv.jsCode));  // treat jsCode as _
if (infiles.length === 0) {
  infiles.push(null);  // if no files were specified, read from stdin
}
const sources = readAllFiles(infiles);
delete argv._;
delete argv.jsCode;

const externs = readAllFiles(toArray(argv.externs));
delete argv.externs;

Promise.all([sources, externs]).then(arr => ready(arr[0], arr[1])).catch(error);

/**
 * Minimist gives us a string, array or null: normalize to array.
 *
 * @param {(string|Array<string>)}
 * @return {!Array<string>}
 */
function toArray(arg) {
  if (typeof arg === 'string') {
    return [arg];
  } else if (arg) {
    return arg;
  } else {
    return [];
  }
}

/**
 * @param {!Array<string>} paths
 * @return {!Promise<!Array{src: string, path: string}>>}
 */
function readAllFiles(paths) {
  return Promise.all(paths.map(path => readFile(path)));
}

/**
 * @param {?string} path
 * @return {!Promise<{src: string, path: string}>}
 */
function readFile(path) {
  return new Promise((resolve, reject) => {
    if (path === null) {
      let src = '';
      process.stdin.resume();
      process.stdin.on('data', buf => src += buf.toString());
      process.stdin.on('end', () => resolve({src, path: '-'}));
    } else {
      fs.readFile(path, 'utf8', (err, src) => err ? reject(err) : resolve({src, path}));
    }
  });
}

function parseDefines(flags){
 /**
   * compile() expects 'defines' to be object, but minimist may only return array or string
   * so, we need to convert to proper object.
   * The supported format will be similar to the following,
   * https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler#define-type-description
   * but instead of using --define 'name=value' we should support --defines 'name=value'
   */

  if (Array.isArray(flags.defines) || typeof flags.defines === "string"){
    let defines = {};
    function parseDefines(d) {
      let key, value;
      {
        let a = d.split("=");
        key = a[0];
        value = a[1];
      }
      defines[key] =
       /^(?:true|false)$/.test(value)
        ? value === 'true' 
        : !isNaN(parseFloat(value)) && isFinite(value)
          ? parseFloat(value)
          : value;
    }
    if (Array.isArray(flags.defines)) {
      flags.defines.forEach(parseDefines);
    } else {
      parseDefines(flags.defines);
    }
    flags.defines = defines;
  }
}

function cmdCompile(flags) {
  parseDefines(flags);
  return compile(flags);
}
//Mostly for test purpuses.
module.exports = cmdCompile;

/**
 * @param {!Array<{src: string, path: string}>} sources
 * @param {!Array<{src: string, path: string}>} externs
 */
function ready(sources, externs) {
  const flags = Object.assign(Object.assign({}, argv), {jsCode: sources, externs: externs});
  const output = cmdCompile(flags);
  let code = 0;
  if (logger(flags, output)) {
    code = 1;
  }
  console.log(output.compiledCode);

  if (flags.createSourceMap) {
    const sourceMapBase64 = new Buffer(output.sourceMap).toString('base64');
    console.log('//# sourceMappingURL=data:application/json;charset=utf-8;base64,' + sourceMapBase64);
  }

  process.exit(code);
}

function error(err) {
  console.error(err);
  process.exit(1);
}
