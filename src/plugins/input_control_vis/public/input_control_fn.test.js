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
const input_control_fn_1 = require("./input_control_fn");
const utils_1 = require("../../expressions/common/expression_functions/specs/tests/utils");
describe('interpreter/functions#input_control_vis', () => {
    const fn = utils_1.functionWrapper(input_control_fn_1.createInputControlVisFn());
    const visConfig = {
        controls: [
            {
                id: '123',
                fieldName: 'geo.src',
                label: 'Source Country',
                type: 'list',
                options: {
                    type: 'terms',
                    multiselect: true,
                    size: 100,
                    order: 'desc',
                },
                parent: '',
                indexPatternRefName: 'control_0_index_pattern',
            },
        ],
        updateFiltersOnChange: false,
        useTimeFilter: false,
        pinFilters: false,
    };
    test('returns an object with the correct structure', async () => {
        const actual = await fn(null, { visConfig: JSON.stringify(visConfig) });
        expect(actual).toMatchSnapshot();
    });
});
