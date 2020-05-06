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
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const vega_request_handler_1 = require("./vega_request_handler");
exports.createVegaFn = (dependencies) => ({
    name: 'vega',
    type: 'render',
    inputTypes: ['kibana_context', 'null'],
    help: i18n_1.i18n.translate('visTypeVega.function.help', {
        defaultMessage: 'Vega visualization',
    }),
    args: {
        spec: {
            types: ['string'],
            default: '',
            help: '',
        },
    },
    async fn(input, args) {
        const vegaRequestHandler = vega_request_handler_1.createVegaRequestHandler(dependencies);
        const response = await vegaRequestHandler({
            timeRange: lodash_1.get(input, 'timeRange'),
            query: lodash_1.get(input, 'query'),
            filters: lodash_1.get(input, 'filters'),
            visParams: { spec: args.spec },
        });
        return {
            type: 'render',
            as: 'visualization',
            value: {
                visData: response,
                visType: 'vega',
                visConfig: {
                    spec: args.spec,
                },
            },
        };
    },
});
