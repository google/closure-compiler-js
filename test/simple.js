/*
 * Copyright 2017 The Closure Compiler Authors.
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

const compile = require('../compile.js');
const assert = require('chai').assert;

suite('closure', () => {
  function assertCompileOk(out, expected, opt_message) {
    assert.sameOrderedMembers(out.warnings, [], 'expected zero warnings');
    assert.sameOrderedMembers(out.errors, [], 'expected zero errors');
    assert.equal(out.compiledCode, expected, opt_message);
  }

  test('simple', () => {
    const flags = {
      jsCode: [{src: 'const x = 1 + 2;'}],
      warningLevel: 'VERBOSE',
    };
    const out = compile(flags);

    assertCompileOk(out, 'var x=3;');
    assert.equal(out.sourceMap, null);
  });

  test('simple with source map', () => {
    const flags = {
      jsCode: [{src: 'const x = 1 + 2;'}],
      warningLevel: 'VERBOSE',
      createSourceMap: true,
    };
    const out = compile(flags);

    assertCompileOk(out, 'var x=3;');
    assert.equal(out.sourceMap, `{\n"version":3,\n"file":"",\n"lineCount":1,\n"mappings":"AAAA,IAAMA,EAAI;",\n"sources":["Input_0"],\n"names":["x"]\n}\n`);
  });

  test('advanced', () => {
    const flags = {
      jsCode: [{
        src: 'var x = 1;\nif (x)\nconsole.info(1);',
        path: 'foo.js',
      }],
      warningLevel: 'VERBOSE',
    };

    flags.compilationLevel = 'ADVANCED';
    const advanced = compile(flags);

    flags.compilationLevel = 'SIMPLE';
    const simple = compile(flags);

    assert.isBelow(advanced.compiledCode.length, simple.compiledCode.length,
        'advanced code should be smaller');
    assertCompileOk(advanced, 'console.info(1);', 'advanced code was incorrect');
    assertCompileOk(simple, 'var x=1;console.info(1);', 'simple code was incorrect');
  });

  test('require()', () => {
    const flags = {
      jsCode: [{
        src: 'module.exports = () => { console.info(`Hello!`); };',
        path: 'src/hello.js',
      }, {
        src: '\'use strict\';\nconst x = require(\'./hello.js\');\nx();',
        path: 'src/index.js',
      }],
      processCommonJsModules: true,
      compilationLevel: 'ADVANCED',
      warningLevel: 'VERBOSE',
    };
    const out = compile(flags);
    assertCompileOk(out, 'console.info("Hello!");');
  });

  test('ES7 out', () => {
    const flags = {
      jsCode: [{
        src: 'console.log(`foo`)',
        path: 'foo.js',
      }],
      languageIn: 'ECMASCRIPT_2017',
      languageOut: 'ECMASCRIPT_2017',
      compilationLevel: 'ADVANCED',
      warningLevel: 'VERBOSE',
    };
    const out = compile(flags);
    assertCompileOk(out, '\'use strict\';console.log("foo");')
  });

});
