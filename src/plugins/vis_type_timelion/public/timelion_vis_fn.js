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
const timelion_request_handler_1 = require("./helpers/timelion_request_handler");
const timelion_vis_type_1 = require("./timelion_vis_type");
exports.getTimelionVisualizationConfig = (dependencies) => ({
    name: 'timelion_vis',
    type: 'render',
    inputTypes: ['kibana_context', 'null'],
    help: i18n_1.i18n.translate('timelion.function.help', {
        defaultMessage: 'Timelion visualization',
    }),
    args: {
        expression: {
            types: ['string'],
            aliases: ['_'],
            default: '".es(*)"',
            help: '',
        },
        interval: {
            types: ['string'],
            default: 'auto',
            help: '',
        },
    },
    async fn(input, args) {
        const timelionRequestHandler = timelion_request_handler_1.getTimelionRequestHandler(dependencies);
        const visParams = { expression: args.expression, interval: args.interval };
        const response = await timelionRequestHandler({
            timeRange: lodash_1.get(input, 'timeRange'),
            query: lodash_1.get(input, 'query'),
            filters: lodash_1.get(input, 'filters'),
            visParams,
            forceFetch: true,
        });
        response.visType = timelion_vis_type_1.TIMELION_VIS_NAME;
        return {
            type: 'render',
            as: 'visualization',
            value: {
                visParams,
                visType: timelion_vis_type_1.TIMELION_VIS_NAME,
                visData: response,
            },
        };
    },
});
