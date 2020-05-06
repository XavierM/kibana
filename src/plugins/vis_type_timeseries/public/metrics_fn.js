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
const i18n_1 = require("@kbn/i18n");
// @ts-ignore
const request_handler_1 = require("./request_handler");
exports.createMetricsFn = () => ({
    name: 'tsvb',
    type: 'render',
    inputTypes: ['kibana_context', 'null'],
    help: i18n_1.i18n.translate('visTypeTimeseries.function.help', {
        defaultMessage: 'TSVB visualization',
    }),
    args: {
        params: {
            types: ['string'],
            default: '"{}"',
            help: '',
        },
        uiState: {
            types: ['string'],
            default: '"{}"',
            help: '',
        },
        savedObjectId: {
            types: ['null', 'string'],
            default: null,
            help: '',
        },
    },
    async fn(input, args) {
        const params = JSON.parse(args.params);
        const uiStateParams = JSON.parse(args.uiState);
        const savedObjectId = args.savedObjectId;
        const { PersistedState } = await Promise.resolve().then(() => __importStar(require('../../visualizations/public')));
        const uiState = new PersistedState(uiStateParams);
        const response = await request_handler_1.metricsRequestHandler({
            timeRange: lodash_1.get(input, 'timeRange', null),
            query: lodash_1.get(input, 'query', null),
            filters: lodash_1.get(input, 'filters', null),
            visParams: params,
            uiState,
            savedObjectId,
        });
        response.visType = 'metrics';
        return {
            type: 'render',
            as: 'visualization',
            value: {
                uiState,
                visType: 'metrics',
                visConfig: params,
                visData: response,
            },
        };
    },
});
