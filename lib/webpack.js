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
 * @fileoverview Webpack plugin for Closure Compiler.
 */

'use strict';

module.exports = function(args) {
  const compile = require('../compile');
  const ModuleFilenameHelpers = require('webpack/lib/ModuleFilenameHelpers');
  const RawSource = require('webpack-core/lib/RawSource');
  const SourceMapSource = require('webpack-core/lib/SourceMapSource');

  args.test = args.test || /\.js($|\?)/i;

  this.apply = function(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('normal-module-loader', context => {
        context.minimize = true;
      });

      compilation.plugin('optimize-chunk-assets', (chunks, callback) => {
        chunks.forEach(chunk => {
          const files = chunk.files.filter(name => ModuleFilenameHelpers.matchObject(args, name));
          files.forEach(name => {
            const options = args.options;  // TODO

            const asset = compilation.assets[name];
            const sourceMap = asset.map();
            const file = {
              path: name,
              src: asset.source(),
              sourceMap: sourceMap ? JSON.stringify(sourceMap) : undefined,
            };
            options.jsCode = [file];

            const output = compile(options);

            // TODO: shared logger

            let result;
            if (output.sourceMap) {
              result = new SourceMapSource(
                output.compiledCode, name, JSON.parse(output.sourceMap), file.src, file.sourceMap);
            } else {
              result = new RawSource(output.compiledCode);
            }
            compilation.assets[name] = result;

          });
        });

        callback();
      });

    });
  };

};