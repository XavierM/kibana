"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const lodash_1 = require("lodash");
const operators_1 = require("rxjs/operators");
// @ts-ignore
const get_index_pattern_1 = require("./vis_data/helpers/get_index_pattern");
const server_1 = require("../../../data/server");
const server_2 = require("../../../data/server");
async function getFields(requestContext, request, framework, indexPattern) {
    // NOTE / TODO: This facade has been put in place to make migrating to the New Platform easier. It
    // removes the need to refactor many layers of dependencies on "req", and instead just augments the top
    // level object passed from here. The layers should be refactored fully at some point, but for now
    // this works and we are still using the New Platform services for these vis data portions.
    const reqFacade = {
        ...request,
        framework,
        payload: {},
        pre: {
            indexPatternsService: new server_2.IndexPatternsFetcher(requestContext.core.elasticsearch.dataClient.callAsCurrentUser),
        },
        getUiSettingsService: () => requestContext.core.uiSettings.client,
        getSavedObjectsClient: () => requestContext.core.savedObjects.client,
        server: {
            plugins: {
                elasticsearch: {
                    getCluster: () => {
                        return {
                            callWithRequest: async (req, endpoint, params) => {
                                return await requestContext.core.elasticsearch.dataClient.callAsCurrentUser(endpoint, params);
                            },
                        };
                    },
                },
            },
        },
        getEsShardTimeout: async () => {
            return await framework.globalConfig$
                .pipe(operators_1.first(), operators_1.map(config => config.elasticsearch.shardTimeout.asMilliseconds()))
                .toPromise();
        },
    };
    const { indexPatternString } = await get_index_pattern_1.getIndexPatternObject(reqFacade, indexPattern);
    const { searchStrategy, capabilities, } = (await framework.searchStrategyRegistry.getViableStrategy(reqFacade, indexPatternString));
    const fields = (await searchStrategy.getFieldsForWildcard(reqFacade, indexPatternString, capabilities)).filter(field => field.aggregatable && !server_1.indexPatterns.isNestedField(field));
    return lodash_1.uniq(fields, field => field.name);
}
exports.getFields = getFields;
