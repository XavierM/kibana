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
const tabify_1 = require("./tabify");
const aggs_1 = require("../aggs");
const test_helpers_1 = require("../aggs/test_helpers");
const fake_hierarchical_data_1 = require("fixtures/fake_hierarchical_data");
const mocks_1 = require("../../field_formats/mocks");
describe('tabifyAggResponse Integration', () => {
    const typesRegistry = test_helpers_1.mockAggTypesRegistry();
    const fieldFormats = mocks_1.fieldFormatsServiceMock.createStartContract();
    const createAggConfigs = (aggs = []) => {
        const field = {
            name: '@timestamp',
        };
        const indexPattern = {
            id: '1234',
            title: 'logstash-*',
            fields: {
                getByName: () => field,
                filter: () => [field],
            },
        };
        return new aggs_1.AggConfigs(indexPattern, aggs, {
            typesRegistry,
            fieldFormats,
        });
    };
    const mockAggConfig = (agg) => agg;
    test('transforms a simple response properly', () => {
        const aggConfigs = createAggConfigs([{ type: 'count' }]);
        const resp = tabify_1.tabifyAggResponse(aggConfigs, fake_hierarchical_data_1.metricOnly, {
            metricsAtAllLevels: true,
        });
        expect(resp).toHaveProperty('rows');
        expect(resp).toHaveProperty('columns');
        expect(resp.rows).toHaveLength(1);
        expect(resp.columns).toHaveLength(1);
        expect(resp.rows[0]).toEqual({ 'col-0-1': 1000 });
        expect(resp.columns[0]).toHaveProperty('aggConfig', aggConfigs.aggs[0]);
    });
    describe('transforms a complex response', () => {
        let esResp;
        let aggConfigs;
        let avg;
        let ext;
        let src;
        let os;
        beforeEach(() => {
            aggConfigs = createAggConfigs([
                mockAggConfig({ type: 'avg', schema: 'metric', params: { field: '@timestamp' } }),
                mockAggConfig({ type: 'terms', schema: 'split', params: { field: '@timestamp' } }),
                mockAggConfig({ type: 'terms', schema: 'segment', params: { field: '@timestamp' } }),
                mockAggConfig({ type: 'terms', schema: 'segment', params: { field: '@timestamp' } }),
            ]);
            [avg, ext, src, os] = aggConfigs.aggs;
            esResp = fake_hierarchical_data_1.threeTermBuckets;
            esResp.aggregations.agg_2.buckets[1].agg_3.buckets[0].agg_4.buckets = [];
        });
        // check that the columns of a table are formed properly
        function expectColumns(table, aggs) {
            expect(table.columns).toHaveLength(aggs.length);
            aggs.forEach((agg, i) => {
                expect(table.columns[i]).toHaveProperty('aggConfig', agg);
            });
        }
        // check that a row has expected values
        function expectRow(row, asserts) {
            expect(typeof row).toBe('object');
            asserts.forEach((assert, i) => {
                if (row[`col-${i}`]) {
                    assert(row[`col-${i}`]);
                }
            });
        }
        // check for two character country code
        function expectCountry(val) {
            expect(typeof val).toBe('string');
            expect(val).toHaveLength(2);
        }
        // check for an OS term
        function expectExtension(val) {
            expect(val).toMatch(/^(js|png|html|css|jpg)$/);
        }
        // check for an OS term
        function expectOS(val) {
            expect(val).toMatch(/^(win|mac|linux)$/);
        }
        // check for something like an average bytes result
        function expectAvgBytes(val) {
            expect(typeof val).toBe('number');
            expect(val === 0 || val > 1000).toBeDefined();
        }
        test('for non-hierarchical vis', () => {
            // the default for a non-hierarchical vis is to display
            // only complete rows, and only put the metrics at the end.
            const tabbed = tabify_1.tabifyAggResponse(aggConfigs, esResp, { metricsAtAllLevels: false });
            expectColumns(tabbed, [ext, src, os, avg]);
            tabbed.rows.forEach(row => {
                expectRow(row, [expectExtension, expectCountry, expectOS, expectAvgBytes]);
            });
        });
        test('for hierarchical vis', () => {
            const tabbed = tabify_1.tabifyAggResponse(aggConfigs, esResp, { metricsAtAllLevels: true });
            expectColumns(tabbed, [ext, avg, src, avg, os, avg]);
            tabbed.rows.forEach(row => {
                expectRow(row, [
                    expectExtension,
                    expectAvgBytes,
                    expectCountry,
                    expectAvgBytes,
                    expectOS,
                    expectAvgBytes,
                ]);
            });
        });
    });
});
