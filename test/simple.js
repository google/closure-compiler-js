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
const cmdCompile = require('../cmd.js');
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
    assertCompileOk(out, 'var x=3;')
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

  // Disabled until there is a fix for https://github.com/google/closure-compiler-js/issues/77
  test.skip('ES7 out', () => {
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

  test('parse string defines on command line', () => {
    const flags = {
      jsCode: [{
        src: '/** @define {boolean} */ var foo = false; console.log(foo)',
        path: 'foo.js',
      }],
      compilationLevel: 'ADVANCED',
      warningLevel: 'VERBOSE',
      defines: 'foo=true'
    };
    const out = cmdCompile(flags);
    assertCompileOk(out, 'console.log(!0);')
  });

  test('parse array defines on command line', () => {
    const flags = {
      jsCode: [{
        src: '/** @define {boolean} */ var foo = false; console.log(foo)',
        path: 'foo.js',
      }],
      compilationLevel: 'ADVANCED',
      warningLevel: 'VERBOSE',
      defines: ['foo=true']
    };
    const out = cmdCompile(flags);
    assertCompileOk(out, 'console.log(!0);')
  });

  test('parse array defines with multiple values', () => {
    const flags = {
      jsCode: [{
        src: '/** @define {boolean} */ var bool = false; /** @define {number} */ var num = 0; /** @define {string} */ var str = "hello"; console.log(bool, num, str)',
        path: 'foo.js',
      }],
      compilationLevel: 'ADVANCED',
      warningLevel: 'VERBOSE',
      defines: ['bool=true', 'num=1', 'str="bye"']
    };
    const out = cmdCompile(flags);
    assertCompileOk(out, 'console.log(!0,1,\'"bye"\');')
  });
});
