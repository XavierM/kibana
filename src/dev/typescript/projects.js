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
const glob_1 = tslib_1.__importDefault(require("glob"));
const path_1 = require("path");
const constants_1 = require("../constants");
const project_1 = require("./project");
exports.PROJECTS = [
    new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, 'tsconfig.json')),
    new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, 'test/tsconfig.json'), { name: 'kibana/test' }),
    new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, 'x-pack/tsconfig.json')),
    new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, 'x-pack/test/tsconfig.json'), { name: 'x-pack/test' }),
    new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, 'x-pack/plugins/siem/cypress/tsconfig.json'), {
        name: 'siem/cypress',
    }),
    new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, 'x-pack/legacy/plugins/apm/e2e/tsconfig.json'), {
        name: 'apm/cypress',
        disableTypeCheck: true,
    }),
    // NOTE: using glob.sync rather than glob-all or globby
    // because it takes less than 10 ms, while the other modules
    // both took closer to 1000ms.
    ...glob_1.default
        .sync('packages/*/tsconfig.json', { cwd: constants_1.REPO_ROOT })
        .map(path => new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, path))),
    ...glob_1.default
        .sync('examples/*/tsconfig.json', { cwd: constants_1.REPO_ROOT })
        .map(path => new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, path))),
    ...glob_1.default
        .sync('x-pack/examples/*/tsconfig.json', { cwd: constants_1.REPO_ROOT })
        .map(path => new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, path))),
    ...glob_1.default
        .sync('test/plugin_functional/plugins/*/tsconfig.json', { cwd: constants_1.REPO_ROOT })
        .map(path => new project_1.Project(path_1.resolve(constants_1.REPO_ROOT, path))),
];
function filterProjectsByFlag(projectFlag) {
    if (!projectFlag) {
        return exports.PROJECTS;
    }
    const tsConfigPath = path_1.resolve(projectFlag);
    return exports.PROJECTS.filter(project => project.tsConfigPath === tsConfigPath);
}
exports.filterProjectsByFlag = filterProjectsByFlag;
