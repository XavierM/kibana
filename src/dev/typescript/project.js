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
const fs_1 = require("fs");
const path_1 = require("path");
const minimatch_1 = require("minimatch");
const typescript_1 = require("typescript");
const constants_1 = require("../constants");
function makeMatchers(directory, patterns) {
    return patterns.map(pattern => new minimatch_1.Minimatch(path_1.resolve(directory, pattern), {
        dot: true,
    }));
}
function parseTsConfig(path) {
    const { error, config } = typescript_1.parseConfigFileTextToJson(path, fs_1.readFileSync(path, 'utf8'));
    if (error) {
        throw error;
    }
    return config;
}
function testMatchers(matchers, path) {
    return matchers.some(matcher => matcher.match(path));
}
class Project {
    constructor(tsConfigPath, options = {}) {
        this.tsConfigPath = tsConfigPath;
        this.config = parseTsConfig(tsConfigPath);
        const { files, include, exclude = [] } = this.config;
        if (files || !include) {
            throw new Error('tsconfig.json files in the Kibana repo must use "include" keys and not "files"');
        }
        this.directory = path_1.dirname(this.tsConfigPath);
        this.disableTypeCheck = options.disableTypeCheck || false;
        this.name = options.name || path_1.relative(constants_1.REPO_ROOT, this.directory) || path_1.basename(this.directory);
        this.include = makeMatchers(this.directory, include);
        this.exclude = makeMatchers(this.directory, exclude);
    }
    isAbsolutePathSelected(path) {
        return testMatchers(this.exclude, path) ? false : testMatchers(this.include, path);
    }
}
exports.Project = Project;
