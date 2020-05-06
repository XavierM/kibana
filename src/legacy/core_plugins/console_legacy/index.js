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
const operators_1 = require("rxjs/operators");
const lodash_1 = require("lodash");
const url_1 = tslib_1.__importDefault(require("url"));
// TODO: Remove this hack once we can get the ES config we need for Console proxy a better way.
let _legacyEsConfig;
exports.readLegacyEsConfig = () => {
    return _legacyEsConfig;
};
// eslint-disable-next-line import/no-default-export
function default_1(kibana) {
    return new kibana.Plugin({
        id: 'console_legacy',
        async init(server) {
            _legacyEsConfig = await server.newPlatform.__internals.elasticsearch.legacy.config$
                .pipe(operators_1.first())
                .toPromise();
        },
        uiExports: {
            injectDefaultVars: () => ({
                elasticsearchUrl: url_1.default.format(Object.assign(url_1.default.parse(lodash_1.head(_legacyEsConfig.hosts)), { auth: false })),
            }),
        },
    });
}
exports.default = default_1;
