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
 * @fileoverview Simple sanity check to run after jscomp.js has been built.
 */

'use strict';

const compile = require('../index.js').compile;

const flags = {
  jsCode: [{src: 'const x = 1 + 2;'}],
  warningLevel: 'VERBOSE',
};
const out = compile(flags);

const expected = 'var x=3;';
if (out.compiledCode !== expected) {
  console.error(`expected: "${expected}", was: "${out.compiledCode}"`);
  throw new Error('test failed');
}

if (out.warnings.length || out.errors.length) {
  console.error(`expected zero warnings/errors, got: ${out.warnings} ${out.errors}`);
  throw new Error('test failed');
}

console.info('Ok! 👍');

