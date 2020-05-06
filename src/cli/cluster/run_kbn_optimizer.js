"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const dev_utils_1 = require("@kbn/dev-utils");
const optimizer_1 = require("@kbn/optimizer");
function runKbnOptimizer(opts, config) {
    const optimizerConfig = optimizer_1.OptimizerConfig.create({
        repoRoot: dev_utils_1.REPO_ROOT,
        watch: true,
        includeCoreBundle: true,
        oss: !!opts.oss,
        examples: !!opts.runExamples,
        pluginPaths: config.get('plugins.paths'),
    });
    const dim = chalk_1.default.dim('np bld');
    const name = chalk_1.default.magentaBright('@kbn/optimizer');
    const time = () => moment_1.default().format('HH:mm:ss.SSS');
    const level = (msgType) => {
        switch (msgType) {
            case 'info':
                return chalk_1.default.green(msgType);
            case 'success':
                return chalk_1.default.cyan(msgType);
            case 'debug':
                return chalk_1.default.gray(msgType);
            default:
                return msgType;
        }
    };
    const { flags: levelFlags } = dev_utils_1.parseLogLevel(dev_utils_1.pickLevelFromFlags(opts));
    const toolingLog = new dev_utils_1.ToolingLog();
    const has = (obj, x) => obj.hasOwnProperty(x);
    toolingLog.setWriters([
        {
            write(msg) {
                if (has(levelFlags, msg.type) && !levelFlags[msg.type]) {
                    return false;
                }
                dev_utils_1.ToolingLogTextWriter.write(process.stdout, `${dim}    log   [${time()}] [${level(msg.type)}][${name}] `, msg);
                return true;
            },
        },
    ]);
    return optimizer_1.runOptimizer(optimizerConfig).pipe(optimizer_1.logOptimizerState(toolingLog, optimizerConfig));
}
exports.runKbnOptimizer = runKbnOptimizer;
