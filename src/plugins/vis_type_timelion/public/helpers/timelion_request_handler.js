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
const public_1 = require("../../../data/public");
const get_timezone_1 = require("./get_timezone");
function getTimelionRequestHandler({ uiSettings, http, timefilter, }) {
    const timezone = get_timezone_1.getTimezone(uiSettings);
    return async function ({ timeRange, filters, query, visParams, }) {
        const expression = visParams.expression;
        if (!expression) {
            throw new Error(i18n_1.i18n.translate('timelion.emptyExpressionErrorMessage', {
                defaultMessage: 'Timelion error: No expression provided',
            }));
        }
        const esQueryConfigs = public_1.esQuery.getEsQueryConfig(uiSettings);
        // parse the time range client side to make sure it behaves like other charts
        const timeRangeBounds = timefilter.calculateBounds(timeRange);
        try {
            return await http.post('../api/timelion/run', {
                body: JSON.stringify({
                    sheet: [expression],
                    extended: {
                        es: {
                            filter: public_1.esQuery.buildEsQuery(undefined, query, filters, esQueryConfigs),
                        },
                    },
                    time: {
                        from: timeRangeBounds.min,
                        to: timeRangeBounds.max,
                        interval: visParams.interval,
                        timezone,
                    },
                }),
            });
        }
        catch (e) {
            if (e && e.body) {
                const err = new Error(`${i18n_1.i18n.translate('timelion.requestHandlerErrorTitle', {
                    defaultMessage: 'Timelion request error',
                })}: ${e.body.title} ${e.body.message}`);
                err.stack = e.stack;
                throw err;
            }
            else {
                throw e;
            }
        }
    };
}
exports.getTimelionRequestHandler = getTimelionRequestHandler;
