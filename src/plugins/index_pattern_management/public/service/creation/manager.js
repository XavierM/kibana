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
class IndexPatternCreationManager {
    constructor() {
        this.addCreationConfig = (httpClient) => (Config) => {
            const config = new Config({ httpClient });
            if (this.configs.findIndex(c => c.key === config.key) !== -1) {
                throw new Error(`${config.key} exists in IndexPatternCreationManager.`);
            }
            this.configs.push(config);
        };
        this.setup = (httpClient) => ({
            addCreationConfig: this.addCreationConfig(httpClient).bind(this),
        });
        this.start = () => ({
            getType: this.getType.bind(this),
            getIndexPatternCreationOptions: this.getIndexPatternCreationOptions.bind(this),
        });
        this.configs = [];
    }
    getType(key) {
        if (key) {
            const index = this.configs.findIndex(config => config.key === key);
            return this.configs[index] || null;
        }
        else {
            return this.getType('default');
        }
    }
    async getIndexPatternCreationOptions(urlHandler) {
        const options = [];
        await Promise.all(this.configs.map(async (config) => {
            const option = config.getIndexPatternCreationOption
                ? await config.getIndexPatternCreationOption(urlHandler)
                : null;
            if (option) {
                options.push(option);
            }
        }));
        return options;
    }
}
exports.IndexPatternCreationManager = IndexPatternCreationManager;
