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
const get_es_query_config_1 = require("./get_es_query_config");
const config = {
    get(item) {
        return lodash_1.get(config, item);
    },
    'query:allowLeadingWildcards': {
        allowLeadingWildcards: true,
    },
    'query:queryString:options': {
        queryStringOptions: {},
    },
    'courier:ignoreFilterIfFieldNotInIndex': {
        ignoreFilterIfFieldNotInIndex: true,
    },
    'dateFormat:tz': {
        dateFormatTZ: 'Browser',
    },
};
describe('getEsQueryConfig', () => {
    test('should return the parameters of an Elasticsearch query config requested', () => {
        const result = get_es_query_config_1.getEsQueryConfig(config);
        const expected = {
            allowLeadingWildcards: {
                allowLeadingWildcards: true,
            },
            dateFormatTZ: {
                dateFormatTZ: 'Browser',
            },
            ignoreFilterIfFieldNotInIndex: {
                ignoreFilterIfFieldNotInIndex: true,
            },
            queryStringOptions: {
                queryStringOptions: {},
            },
        };
        expect(result).toEqual(expected);
        expect(result).toHaveProperty('allowLeadingWildcards');
        expect(result).toHaveProperty('dateFormatTZ');
        expect(result).toHaveProperty('ignoreFilterIfFieldNotInIndex');
        expect(result).toHaveProperty('queryStringOptions');
    });
});
