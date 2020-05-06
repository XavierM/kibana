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
const services_1 = require("../services");
jest.mock('./helpers', () => ({
    buildHierarchicalData: jest.fn(() => ({})),
    buildPointSeriesData: jest.fn(() => ({})),
}));
// @ts-ignore
const response_handler_1 = require("./response_handler");
const helpers_1 = require("./helpers");
describe('response_handler', () => {
    describe('vislibSlicesResponseHandler', () => {
        test('should not call buildHierarchicalData when no columns', () => {
            response_handler_1.vislibSlicesResponseHandler({ rows: [] }, {});
            expect(helpers_1.buildHierarchicalData).not.toHaveBeenCalled();
        });
        test('should call buildHierarchicalData', () => {
            const response = {
                rows: [{ 'col-0-1': 1 }],
                columns: [{ id: 'col-0-1', name: 'Count' }],
            };
            const dimensions = { metric: { accessor: 0 } };
            response_handler_1.vislibSlicesResponseHandler(response, dimensions);
            expect(helpers_1.buildHierarchicalData).toHaveBeenCalledWith({ columns: [...response.columns], rows: [...response.rows] }, dimensions);
        });
    });
    describe('vislibSeriesResponseHandler', () => {
        let resp;
        let expected;
        beforeAll(() => {
            services_1.setFormatService({
                deserialize: () => ({
                    convert: jest.fn(v => v),
                }),
            });
        });
        beforeAll(() => {
            resp = {
                rows: [
                    { 'col-0-3': 158599872, 'col-1-1': 1 },
                    { 'col-0-3': 158599893, 'col-1-1': 2 },
                    { 'col-0-3': 158599908, 'col-1-1': 1 },
                ],
                columns: [
                    { id: 'col-0-3', name: 'timestamp per 30 seconds' },
                    { id: 'col-1-1', name: 'Count' },
                ],
            };
            const colId = resp.columns[0].id;
            expected = [
                { label: `${resp.rows[0][colId]}: ${resp.columns[0].name}` },
                { label: `${resp.rows[1][colId]}: ${resp.columns[0].name}` },
                { label: `${resp.rows[2][colId]}: ${resp.columns[0].name}` },
            ];
        });
        test('should not call buildPointSeriesData when no columns', () => {
            response_handler_1.vislibSeriesResponseHandler({ rows: [] }, {});
            expect(helpers_1.buildPointSeriesData).not.toHaveBeenCalled();
        });
        test('should call buildPointSeriesData', () => {
            const response = {
                rows: [{ 'col-0-1': 1 }],
                columns: [{ id: 'col-0-1', name: 'Count' }],
            };
            const dimensions = { x: null, y: { accessor: 0 } };
            response_handler_1.vislibSeriesResponseHandler(response, dimensions);
            expect(helpers_1.buildPointSeriesData).toHaveBeenCalledWith({ columns: [...response.columns], rows: [...response.rows] }, dimensions);
        });
        test('should split columns', () => {
            const dimensions = {
                x: null,
                y: [{ accessor: 1 }],
                splitColumn: [{ accessor: 0 }],
            };
            const convertedResp = response_handler_1.vislibSlicesResponseHandler(resp, dimensions);
            expect(convertedResp.columns).toHaveLength(resp.rows.length);
            expect(convertedResp.columns).toEqual(expected);
        });
        test('should split rows', () => {
            const dimensions = {
                x: null,
                y: [{ accessor: 1 }],
                splitRow: [{ accessor: 0 }],
            };
            const convertedResp = response_handler_1.vislibSlicesResponseHandler(resp, dimensions);
            expect(convertedResp.rows).toHaveLength(resp.rows.length);
            expect(convertedResp.rows).toEqual(expected);
        });
    });
});
