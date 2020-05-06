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
const creation_1 = require("./creation");
const list_1 = require("./list");
/**
 * Index patterns management service
 *
 * @internal
 */
class IndexPatternManagementService {
    constructor() {
        this.indexPatternCreationManager = new creation_1.IndexPatternCreationManager();
        this.indexPatternListConfig = new list_1.IndexPatternListManager();
    }
    setup({ httpClient }) {
        const creationManagerSetup = this.indexPatternCreationManager.setup(httpClient);
        creationManagerSetup.addCreationConfig(creation_1.IndexPatternCreationConfig);
        this.indexPatternListConfig.setup().addListConfig(list_1.IndexPatternListConfig);
        return {
            creation: creationManagerSetup,
            list: this.indexPatternListConfig.setup(),
        };
    }
    start() {
        return {
            creation: this.indexPatternCreationManager.start(),
            list: this.indexPatternListConfig.start(),
        };
    }
    stop() {
        // nothing to do here yet.
    }
}
exports.IndexPatternManagementService = IndexPatternManagementService;
