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
const map_spatial_filter_1 = require("./map_spatial_filter");
const common_1 = require("../../../../../common");
describe('mapSpatialFilter()', () => {
    test('should return the key for matching multi polygon filter', async () => {
        const filter = {
            meta: {
                key: 'location',
                alias: 'my spatial filter',
                type: common_1.FILTERS.SPATIAL_FILTER,
            },
            query: {
                bool: {
                    should: [
                        {
                            geo_polygon: {
                                geoCoordinates: { points: [] },
                            },
                        },
                    ],
                },
            },
        };
        const result = map_spatial_filter_1.mapSpatialFilter(filter);
        expect(result).toHaveProperty('key', 'location');
        expect(result).toHaveProperty('value', '');
        expect(result).toHaveProperty('type', common_1.FILTERS.SPATIAL_FILTER);
    });
    test('should return the key for matching polygon filter', async () => {
        const filter = {
            meta: {
                key: 'location',
                alias: 'my spatial filter',
                type: common_1.FILTERS.SPATIAL_FILTER,
            },
            geo_polygon: {
                geoCoordinates: { points: [] },
            },
        };
        const result = map_spatial_filter_1.mapSpatialFilter(filter);
        expect(result).toHaveProperty('key', 'location');
        expect(result).toHaveProperty('value', '');
        expect(result).toHaveProperty('type', common_1.FILTERS.SPATIAL_FILTER);
    });
    test('should return undefined for none matching', async (done) => {
        const filter = {
            meta: {
                key: 'location',
                alias: 'my spatial filter',
            },
            geo_polygon: {
                geoCoordinates: { points: [] },
            },
        };
        try {
            map_spatial_filter_1.mapSpatialFilter(filter);
        }
        catch (e) {
            expect(e).toBe(filter);
            done();
        }
    });
});
