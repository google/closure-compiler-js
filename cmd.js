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

const argv = minimist(process.argv.slice(2), {
  alias: { h: 'help', v: 'version' }
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

const infiles = argv._;
delete argv._;

// If no files were specified, read from STDIN.
if (infiles.length === 0) {
  infiles.push('-');
}

const sources = [];
infiles.forEach(path => {
  readFile(path, src => {
    sources.push(src);
    if (sources.length === infiles.length) {
      ready();
    }
  })
});

function readFile(path, cb) {
  if (path === '-') {
    let src = '';
    process.stdin.resume();
    process.stdin.on('data', buf => src += buf.toString());
    process.stdin.on('end', () => cb(src));
  } else {
    fs.readFile(path, 'utf8', (err, src) => err ? error(err) : cb({src, path}));
  }
}

function ready() {
  const flags = Object.assign({jsCode: sources}, argv);
  const out = compile(flags);
  console.log(out.compiledCode);
}

function error(err) {
  console.error(err);
  process.exit(1);
}
