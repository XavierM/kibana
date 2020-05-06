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
const path_1 = require("path");
const init_1 = require("./init");
// eslint-disable-next-line
function InterpreterPlugin(kibana) {
    const config = {
        id: 'interpreter',
        require: ['kibana', 'elasticsearch'],
        publicDir: path_1.resolve(__dirname, 'public'),
        uiExports: {
            injectDefaultVars: server => ({
                serverBasePath: server.config().get('server.basePath'),
            }),
        },
        config: (Joi) => {
            return Joi.object({
                enabled: Joi.boolean().default(true),
            }).default();
        },
        init: init_1.init,
    };
    return new kibana.Plugin(config);
}
exports.default = InterpreterPlugin;
