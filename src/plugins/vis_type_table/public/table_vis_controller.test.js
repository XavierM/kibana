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
const tslib_1 = require("tslib");
const angular_1 = tslib_1.__importDefault(require("angular"));
require("angular-mocks");
require("angular-sanitize");
const jquery_1 = tslib_1.__importDefault(require("jquery"));
// @ts-ignore
const stub_index_pattern_1 = tslib_1.__importDefault(require("test_utils/stub_index_pattern"));
const get_inner_angular_1 = require("./get_inner_angular");
const table_vis_legacy_module_1 = require("./table_vis_legacy_module");
const table_vis_type_1 = require("./table_vis_type");
// eslint-disable-next-line
const stubs_1 = require("../../data/public/stubs");
// eslint-disable-next-line
const table_vis_response_handler_1 = require("./table_vis_response_handler");
const mocks_1 = require("../../../core/public/mocks");
const public_1 = require("../../data/public");
// TODO: remove linting disable
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const mocks_2 = require("../../data/public/search/mocks");
const { createAggConfigs } = mocks_2.searchStartMock.aggs;
const { tabifyAggResponse } = public_1.search;
jest.mock('../../kibana_legacy/public/angular/angular_config', () => ({
    configureAppAngularModule: () => { },
}));
const oneRangeBucket = {
    hits: {
        total: 6039,
        max_score: 0,
        hits: [],
    },
    aggregations: {
        agg_2: {
            buckets: {
                '0.0-1000.0': {
                    from: 0,
                    from_as_string: '0.0',
                    to: 1000,
                    to_as_string: '1000.0',
                    doc_count: 606,
                },
                '1000.0-2000.0': {
                    from: 1000,
                    from_as_string: '1000.0',
                    to: 2000,
                    to_as_string: '2000.0',
                    doc_count: 298,
                },
            },
        },
    },
};
describe('Table Vis - Controller', () => {
    let $rootScope;
    let $compile;
    let $scope;
    let $el;
    let tableAggResponse;
    let tabifiedResponse;
    let stubIndexPattern;
    const initLocalAngular = () => {
        const tableVisModule = get_inner_angular_1.getAngularModule('kibana/table_vis', mocks_1.coreMock.createStart(), mocks_1.coreMock.createPluginInitializerContext());
        table_vis_legacy_module_1.initTableVisLegacyModule(tableVisModule);
    };
    beforeEach(initLocalAngular);
    beforeEach(angular_1.default.mock.module('kibana/table_vis'));
    beforeEach(angular_1.default.mock.inject((_$rootScope_, _$compile_) => {
        $rootScope = _$rootScope_;
        $compile = _$compile_;
        tableAggResponse = table_vis_response_handler_1.tableVisResponseHandler;
    }));
    beforeEach(() => {
        stubIndexPattern = new stub_index_pattern_1.default('logstash-*', (cfg) => cfg, 'time', stubs_1.stubFields, mocks_1.coreMock.createSetup());
    });
    const tableVisTypeDefinition = table_vis_type_1.getTableVisTypeDefinition(mocks_1.coreMock.createSetup(), mocks_1.coreMock.createPluginInitializerContext());
    function getRangeVis(params) {
        return {
            type: tableVisTypeDefinition,
            params: Object.assign({}, tableVisTypeDefinition.visConfig.defaults, params),
            data: {
                aggs: createAggConfigs(stubIndexPattern, [
                    { type: 'count', schema: 'metric' },
                    {
                        type: 'range',
                        schema: 'bucket',
                        params: {
                            field: 'bytes',
                            ranges: [
                                { from: 0, to: 1000 },
                                { from: 1000, to: 2000 },
                            ],
                        },
                    },
                ]),
            },
        };
    }
    const dimensions = {
        buckets: [
            {
                accessor: 0,
            },
        ],
        metrics: [
            {
                accessor: 1,
                format: { id: 'range' },
            },
        ],
    };
    // basically a parameterized beforeEach
    function initController(vis) {
        vis.data.aggs.aggs.forEach((agg, i) => {
            agg.id = 'agg_' + (i + 1);
        });
        tabifiedResponse = tabifyAggResponse(vis.data.aggs, oneRangeBucket);
        $rootScope.vis = vis;
        $rootScope.visParams = vis.params;
        $rootScope.uiState = {
            get: jest.fn(),
            set: jest.fn(),
        };
        $rootScope.renderComplete = () => { };
        $rootScope.newScope = (scope) => {
            $scope = scope;
        };
        $el = jquery_1.default('<div>')
            .attr('ng-controller', 'KbnTableVisController')
            .attr('ng-init', 'newScope(this)');
        $compile($el)($rootScope);
    }
    // put a response into the controller
    function attachEsResponseToScope(resp) {
        $rootScope.esResponse = resp;
        $rootScope.$apply();
    }
    // remove the response from the controller
    function removeEsResponseFromScope() {
        delete $rootScope.esResponse;
        $rootScope.renderComplete = () => { };
        $rootScope.$apply();
    }
    test('exposes #tableGroups and #hasSomeRows when a response is attached to scope', async () => {
        const vis = getRangeVis();
        initController(vis);
        expect(!$scope.tableGroups).toBeTruthy();
        expect(!$scope.hasSomeRows).toBeTruthy();
        attachEsResponseToScope(await tableAggResponse(tabifiedResponse, dimensions));
        expect($scope.hasSomeRows).toBeTruthy();
        expect($scope.tableGroups.tables).toBeDefined();
        expect($scope.tableGroups.tables.length).toBe(1);
        expect($scope.tableGroups.tables[0].columns.length).toBe(2);
        expect($scope.tableGroups.tables[0].rows.length).toBe(2);
    });
    test('clears #tableGroups and #hasSomeRows when the response is removed', async () => {
        const vis = getRangeVis();
        initController(vis);
        attachEsResponseToScope(await tableAggResponse(tabifiedResponse, dimensions));
        removeEsResponseFromScope();
        expect(!$scope.hasSomeRows).toBeTruthy();
        expect(!$scope.tableGroups).toBeTruthy();
    });
    test('sets the sort on the scope when it is passed as a vis param', async () => {
        const sortObj = {
            columnIndex: 1,
            direction: 'asc',
        };
        const vis = getRangeVis({ sort: sortObj });
        initController(vis);
        attachEsResponseToScope(await tableAggResponse(tabifiedResponse, dimensions));
        expect($scope.sort.columnIndex).toEqual(sortObj.columnIndex);
        expect($scope.sort.direction).toEqual(sortObj.direction);
    });
    test('sets #hasSomeRows properly if the table group is empty', async () => {
        const vis = getRangeVis();
        initController(vis);
        tabifiedResponse.rows = [];
        attachEsResponseToScope(await tableAggResponse(tabifiedResponse, dimensions));
        expect($scope.hasSomeRows).toBeFalsy();
        expect(!$scope.tableGroups).toBeTruthy();
    });
    test('passes partialRows:true to tabify based on the vis params', () => {
        const vis = getRangeVis({ showPartialRows: true });
        initController(vis);
        expect(vis.type.hierarchicalData(vis)).toEqual(true);
    });
    test('passes partialRows:false to tabify based on the vis params', () => {
        const vis = getRangeVis({ showPartialRows: false });
        initController(vis);
        expect(vis.type.hierarchicalData(vis)).toEqual(false);
    });
});
