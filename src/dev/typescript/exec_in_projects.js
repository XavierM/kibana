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
const os_1 = tslib_1.__importDefault(require("os"));
const chalk_1 = tslib_1.__importDefault(require("chalk"));
const execa_1 = tslib_1.__importDefault(require("execa"));
const listr_1 = tslib_1.__importDefault(require("listr"));
class ProjectFailure {
    constructor(project, error) {
        this.project = project;
        this.error = error;
    }
}
function execInProjects(log, projects, cmd, getArgs) {
    const list = new listr_1.default(projects.map(project => ({
        task: () => execa_1.default(cmd, getArgs(project), {
            // execute in the current working directory so that relative paths in errors
            // are relative from the right location
            cwd: process.cwd(),
            env: chalk_1.default.enabled ? { FORCE_COLOR: 'true' } : {},
            stdio: ['ignore', 'pipe', 'pipe'],
            preferLocal: true,
        }).catch(error => {
            throw new ProjectFailure(project, error);
        }),
        title: project.name,
    })), {
        concurrent: Math.min(4, Math.round((os_1.default.cpus() || []).length / 2) || 1) || false,
        exitOnError: false,
    });
    list.run().catch((error) => {
        process.exitCode = 1;
        if (!error.errors) {
            log.error('Unhandled exception!');
            log.error(error);
            process.exit();
        }
        for (const e of error.errors) {
            if (e instanceof ProjectFailure) {
                log.write('');
                // stdout contains errors from tsc
                // stderr conatins tsc crash report
                log.error(`${e.project.name} failed\n${e.error.stdout || e.error.stderr}`);
            }
            else {
                log.error(e);
            }
        }
    });
}
exports.execInProjects = execInProjects;
