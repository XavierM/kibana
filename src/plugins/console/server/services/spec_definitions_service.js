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
const lodash_1 = tslib_1.__importStar(require("lodash"));
const glob_1 = tslib_1.__importDefault(require("glob"));
const path_1 = require("path");
const fs_1 = require("fs");
const lib_1 = require("../lib");
const PATH_TO_OSS_JSON_SPEC = path_1.resolve(__dirname, '../lib/spec_definitions/json');
class SpecDefinitionsService {
    constructor() {
        this.name = 'es';
        this.globalRules = {};
        this.endpoints = {};
        this.extensionSpecFilePaths = [];
        this.hasLoadedSpec = false;
    }
    addGlobalAutocompleteRules(parentNode, rules) {
        this.globalRules[parentNode] = rules;
    }
    addEndpointDescription(endpoint, description = {}) {
        let copiedDescription = {};
        if (this.endpoints[endpoint]) {
            copiedDescription = { ...this.endpoints[endpoint] };
        }
        let urlParamsDef;
        lodash_1.default.each(description.patterns || [], function (p) {
            if (p.indexOf('{indices}') >= 0) {
                urlParamsDef = urlParamsDef || {};
                urlParamsDef.ignore_unavailable = '__flag__';
                urlParamsDef.allow_no_indices = '__flag__';
                urlParamsDef.expand_wildcards = ['open', 'closed'];
            }
        });
        if (urlParamsDef) {
            description.url_params = lodash_1.default.extend(description.url_params || {}, copiedDescription.url_params);
            lodash_1.default.defaults(description.url_params, urlParamsDef);
        }
        lodash_1.default.extend(copiedDescription, description);
        lodash_1.default.defaults(copiedDescription, {
            id: endpoint,
            patterns: [endpoint],
            methods: ['GET'],
        });
        this.endpoints[endpoint] = copiedDescription;
    }
    asJson() {
        return {
            name: this.name,
            globals: this.globalRules,
            endpoints: this.endpoints,
        };
    }
    addExtensionSpecFilePath(path) {
        this.extensionSpecFilePaths.push(path);
    }
    addProcessorDefinition(processor) {
        if (!this.hasLoadedSpec) {
            throw new Error('Cannot add a processor definition because spec definitions have not loaded!');
        }
        this.endpoints._processor.data_autocomplete_rules.__one_of.push(processor);
    }
    setup() {
        return {
            addExtensionSpecFilePath: this.addExtensionSpecFilePath.bind(this),
        };
    }
    start() {
        if (!this.hasLoadedSpec) {
            this.loadJsonSpec();
            this.loadJSSpec();
            this.hasLoadedSpec = true;
            return {
                addProcessorDefinition: this.addProcessorDefinition.bind(this),
            };
        }
        else {
            throw new Error('Service has already started!');
        }
    }
    loadJSONSpecInDir(dirname) {
        const generatedFiles = glob_1.default.sync(path_1.join(dirname, 'generated', '*.json'));
        const overrideFiles = glob_1.default.sync(path_1.join(dirname, 'overrides', '*.json'));
        return generatedFiles.reduce((acc, file) => {
            const overrideFile = overrideFiles.find(f => path_1.basename(f) === path_1.basename(file));
            const loadedSpec = JSON.parse(fs_1.readFileSync(file, 'utf8'));
            if (overrideFile) {
                lodash_1.merge(loadedSpec, JSON.parse(fs_1.readFileSync(overrideFile, 'utf8')));
            }
            const spec = {};
            Object.entries(loadedSpec).forEach(([key, value]) => {
                if (acc[key]) {
                    // add time to remove key collision
                    spec[`${key}${Date.now()}`] = value;
                }
                else {
                    spec[key] = value;
                }
            });
            return { ...acc, ...spec };
        }, {});
    }
    loadJsonSpec() {
        const result = this.loadJSONSpecInDir(PATH_TO_OSS_JSON_SPEC);
        this.extensionSpecFilePaths.forEach(extensionSpecFilePath => {
            lodash_1.merge(result, this.loadJSONSpecInDir(extensionSpecFilePath));
        });
        Object.keys(result).forEach(endpoint => {
            this.addEndpointDescription(endpoint, result[endpoint]);
        });
    }
    loadJSSpec() {
        lib_1.jsSpecLoaders.forEach(addJsSpec => addJsSpec(this));
    }
}
exports.SpecDefinitionsService = SpecDefinitionsService;
