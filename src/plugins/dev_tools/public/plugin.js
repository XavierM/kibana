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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
require("./index.scss");
class DevToolsPlugin {
    constructor() {
        this.devTools = new Map();
    }
    getSortedDevTools() {
        return lodash_1.sortBy([...this.devTools.values()], 'order');
    }
    setup(core, { kibanaLegacy }) {
        kibanaLegacy.registerLegacyApp({
            id: 'dev_tools',
            title: 'Dev Tools',
            mount: async (appMountContext, params) => {
                if (!this.getSortedDevTools) {
                    throw new Error('not started yet');
                }
                const { renderApp } = await Promise.resolve().then(() => __importStar(require('./application')));
                return renderApp(params.element, appMountContext, params.appBasePath, this.getSortedDevTools());
            },
        });
        return {
            register: (devTool) => {
                if (this.devTools.has(devTool.id)) {
                    throw new Error(`Dev tool with id [${devTool.id}] has already been registered. Use a unique id.`);
                }
                this.devTools.set(devTool.id, devTool);
            },
        };
    }
    start() {
        return {
            getSortedDevTools: this.getSortedDevTools.bind(this),
        };
    }
    stop() { }
}
exports.DevToolsPlugin = DevToolsPlugin;
