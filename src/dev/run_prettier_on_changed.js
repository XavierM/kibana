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
const execa_1 = tslib_1.__importDefault(require("execa"));
// @ts-ignore
const simple_git_1 = tslib_1.__importDefault(require("simple-git"));
const dev_utils_1 = require("@kbn/dev-utils");
const dedent_1 = tslib_1.__importDefault(require("dedent"));
const util_1 = tslib_1.__importDefault(require("util"));
const package_json_1 = tslib_1.__importDefault(require("../../package.json"));
const constants_1 = require("./constants");
const file_1 = require("./file");
const Eslint = tslib_1.__importStar(require("./eslint"));
dev_utils_1.run(async function getChangedFiles({ log }) {
    const simpleGit = new simple_git_1.default(constants_1.REPO_ROOT);
    const getStatus = util_1.default.promisify(simpleGit.status.bind(simpleGit));
    const gitStatus = await getStatus();
    if (gitStatus.files.length > 0) {
        throw new Error(dedent_1.default(`You should run prettier formatter on a clean branch.
        Found not committed changes to:
        ${gitStatus.files.map((f) => f.path).join('\n')}`));
    }
    const revParse = util_1.default.promisify(simpleGit.revparse.bind(simpleGit));
    const currentBranch = await revParse(['--abbrev-ref', 'HEAD']);
    const headBranch = package_json_1.default.branch;
    const diff = util_1.default.promisify(simpleGit.diff.bind(simpleGit));
    const changedFileStatuses = await diff([
        '--name-status',
        `${headBranch}...${currentBranch}`,
    ]);
    const changedFiles = changedFileStatuses
        .split('\n')
        // Ignore blank lines
        .filter(line => line.trim().length > 0)
        // git diff --name-status outputs lines with two OR three parts
        // separated by a tab character
        .map(line => line.trim().split('\t'))
        .map(([status, ...paths]) => {
        // ignore deleted files
        if (status === 'D') {
            return undefined;
        }
        // the status is always in the first column
        // .. If the file is edited the line will only have two columns
        // .. If the file is renamed it will have three columns
        // .. In any case, the last column is the CURRENT path to the file
        return new file_1.File(paths[paths.length - 1]);
    })
        .filter((file) => Boolean(file));
    const pathsToLint = Eslint.pickFilesToLint(log, changedFiles).map(f => f.getAbsolutePath());
    if (pathsToLint.length > 0) {
        log.debug('[prettier] run on %j files: ', pathsToLint.length, pathsToLint);
    }
    while (pathsToLint.length > 0) {
        await execa_1.default('npx', ['prettier@2.0.4', '--write', ...pathsToLint.splice(0, 100)]);
    }
});
