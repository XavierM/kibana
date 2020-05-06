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
const i18n_1 = require("@kbn/i18n");
const table_vis_response_handler_1 = require("./table_vis_response_handler");
exports.createTableVisFn = () => ({
    name: 'kibana_table',
    type: 'render',
    inputTypes: ['kibana_datatable'],
    help: i18n_1.i18n.translate('visTypeTable.function.help', {
        defaultMessage: 'Table visualization',
    }),
    args: {
        visConfig: {
            types: ['string', 'null'],
            default: '"{}"',
            help: '',
        },
    },
    fn(input, args) {
        const visConfig = args.visConfig && JSON.parse(args.visConfig);
        const convertedData = table_vis_response_handler_1.tableVisResponseHandler(input, visConfig.dimensions);
        return {
            type: 'render',
            as: 'visualization',
            value: {
                visData: convertedData,
                visType: 'table',
                visConfig,
                params: {
                    listenOnChange: true,
                },
            },
        };
    },
});
