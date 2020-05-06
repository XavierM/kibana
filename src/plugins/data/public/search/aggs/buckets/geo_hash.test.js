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
const geo_hash_1 = require("./geo_hash");
const agg_configs_1 = require("../agg_configs");
const test_helpers_1 = require("../test_helpers");
const bucket_agg_types_1 = require("./bucket_agg_types");
const mocks_1 = require("../../../../../../../src/core/public/mocks");
const mocks_2 = require("../../../field_formats/mocks");
describe('Geohash Agg', () => {
    let aggTypesDependencies;
    let geoHashBucketAgg;
    beforeEach(() => {
        aggTypesDependencies = {
            getInternalStartServices: () => ({
                fieldFormats: mocks_2.fieldFormatsServiceMock.createStartContract(),
                notifications: mocks_1.notificationServiceMock.createStartContract(),
            }),
        };
        geoHashBucketAgg = geo_hash_1.getGeoHashBucketAgg(aggTypesDependencies);
    });
    const getAggConfigs = (params) => {
        const indexPattern = {
            id: '1234',
            title: 'logstash-*',
            fields: {
                getByName: () => field,
                filter: () => [field],
            },
        };
        const field = {
            name: 'location',
            indexPattern,
        };
        return new agg_configs_1.AggConfigs(indexPattern, [
            {
                id: bucket_agg_types_1.BUCKET_TYPES.GEOHASH_GRID,
                type: bucket_agg_types_1.BUCKET_TYPES.GEOHASH_GRID,
                schema: 'segment',
                params: {
                    field: {
                        name: 'location',
                    },
                    isFilteredByCollar: true,
                    useGeocentroid: true,
                    mapZoom: 10,
                    mapBounds: {
                        top_left: { lat: 1.0, lon: -1.0 },
                        bottom_right: { lat: -1.0, lon: 1.0 },
                    },
                    ...params,
                },
            },
        ], {
            typesRegistry: test_helpers_1.mockAggTypesRegistry(),
            fieldFormats: aggTypesDependencies.getInternalStartServices().fieldFormats,
        });
    };
    describe('precision parameter', () => {
        const PRECISION_PARAM_INDEX = 2;
        let precisionParam;
        beforeEach(() => {
            precisionParam = geoHashBucketAgg.params[PRECISION_PARAM_INDEX];
        });
        test('should select precision parameter', () => {
            expect(precisionParam.name).toEqual('precision');
        });
    });
    describe('getRequestAggs', () => {
        describe('initial aggregation creation', () => {
            let aggConfigs;
            let geoHashGridAgg;
            beforeEach(() => {
                aggConfigs = getAggConfigs();
                geoHashGridAgg = aggConfigs.aggs[0];
            });
            test('should create filter, geohash_grid, and geo_centroid aggregations', () => {
                const requestAggs = geoHashBucketAgg.getRequestAggs(geoHashGridAgg);
                expect(requestAggs.length).toEqual(3);
                expect(requestAggs[0].type.name).toEqual('filter');
                expect(requestAggs[1].type.name).toEqual('geohash_grid');
                expect(requestAggs[2].type.name).toEqual('geo_centroid');
            });
        });
    });
    describe('aggregation options', () => {
        test('should only create geohash_grid and geo_centroid aggregations when isFilteredByCollar is false', () => {
            const aggConfigs = getAggConfigs({ isFilteredByCollar: false });
            const requestAggs = geoHashBucketAgg.getRequestAggs(aggConfigs.aggs[0]);
            expect(requestAggs.length).toEqual(2);
            expect(requestAggs[0].type.name).toEqual('geohash_grid');
            expect(requestAggs[1].type.name).toEqual('geo_centroid');
        });
        test('should only create filter and geohash_grid aggregations when useGeocentroid is false', () => {
            const aggConfigs = getAggConfigs({ useGeocentroid: false });
            const requestAggs = geoHashBucketAgg.getRequestAggs(aggConfigs.aggs[0]);
            expect(requestAggs.length).toEqual(2);
            expect(requestAggs[0].type.name).toEqual('filter');
            expect(requestAggs[1].type.name).toEqual('geohash_grid');
        });
    });
    describe('aggregation creation after map interaction', () => {
        let originalRequestAggs;
        beforeEach(() => {
            originalRequestAggs = geoHashBucketAgg.getRequestAggs(getAggConfigs({
                boundingBox: {
                    top_left: { lat: 1, lon: -1 },
                    bottom_right: { lat: -1, lon: 1 },
                },
            }).aggs[0]);
        });
        test('should change geo_bounding_box filter aggregation and vis session state when map movement is outside map collar', () => {
            const [, geoBoxingBox] = geoHashBucketAgg.getRequestAggs(getAggConfigs({
                boundingBox: {
                    top_left: { lat: 10.0, lon: -10.0 },
                    bottom_right: { lat: 9.0, lon: -9.0 },
                },
            }).aggs[0]);
            expect(originalRequestAggs[1].params).not.toEqual(geoBoxingBox.params);
        });
        test('should not change geo_bounding_box filter aggregation and vis session state when map movement is within map collar', () => {
            const [, geoBoxingBox] = geoHashBucketAgg.getRequestAggs(getAggConfigs({
                boundingBox: {
                    top_left: { lat: 1, lon: -1 },
                    bottom_right: { lat: -1, lon: 1 },
                },
            }).aggs[0]);
            expect(originalRequestAggs[1].params).toEqual(geoBoxingBox.params);
        });
    });
});
