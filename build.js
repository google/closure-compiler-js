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

'use strict';

const spawn = require('child_process').spawnSync;
const ncp = require('ncp');
const fs = require('fs');

try {
  fs.mkdirSync('./build');
} catch (e) {
  // ignore, probably exists
}

const moduleName = 'com.google.javascript:closure-compiler-gwt';
const compilerBuild = spawn('mvn', ['-DskipTests', '-pl', moduleName], {
  cwd: './closure-compiler',
  stdio: 'inherit'
});

if (compilerBuild.status !== 0) {
  throw new Error('compiler build failed');
}

const targetPath = './closure-compiler/target/closure-compiler-gwt-1.0-SNAPSHOT/jscomp/jscomp.js';
ncp(targetPath, './build/compile.js', err => {
  if (err) {
    throw new Error(err);
  }
  ['contrib', 'externs'].forEach(name => {
    ncp('./closure-compiler/' + name, './build/' + name, function(err) {
      if (err) {
        throw new Error(err);
      }
    });
  });
});
