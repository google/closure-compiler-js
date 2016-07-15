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
 * @fileoverview Wrapper for the natively built Closure Compiler GWT binary to
 * work around a few quirks.
 */

'use strict';

const compile = require('./jscomp.js');

let externs;

/**
 * @return {!Array<{source: string}>} default externs files
 */
function loadExterns() {
  const fs = require('fs');
  const path = './externs';
  const all = fs.readdirSync(path); 

  return all.filter(x => x.endsWith('.js')).map(x => {
    return {
      source: fs.readFileSync(path + '/' + x, {encoding: 'UTF-8'}),
    };
  });
}

module.exports = function(flags) {
  const clone = {
    languageIn: 'ES6',  // TODO(samthor): assume this in upstream code
  };
  for (const k in flags) {
    clone[k] = flags[k];
  }

  // add default externs
  // TODO(samthor): this should load browser code, merge into a single file
  if (!externs) {
    externs = loadExterns();
  }
  clone.externs = (clone.externs || []).concat(externs);

  const out = compile(clone);

  // hide weird GWT internals
  out.warnings = [...out.warnings];
  out.errors = [...out.errors];

  return out;
};
