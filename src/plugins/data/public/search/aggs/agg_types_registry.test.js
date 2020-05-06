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
const agg_types_registry_1 = require("./agg_types_registry");
const bucketType = { name: 'terms', type: 'bucket' };
const metricType = { name: 'count', type: 'metric' };
describe('AggTypesRegistry', () => {
    let registry;
    let setup;
    let start;
    beforeEach(() => {
        registry = new agg_types_registry_1.AggTypesRegistry();
        setup = registry.setup();
        start = registry.start();
    });
    it('registerBucket adds new buckets', () => {
        setup.registerBucket(bucketType);
        expect(start.getBuckets()).toEqual([bucketType]);
    });
    it('registerBucket throws error when registering duplicate bucket', () => {
        expect(() => {
            setup.registerBucket(bucketType);
            setup.registerBucket(bucketType);
        }).toThrow(/already been registered with name: terms/);
    });
    it('registerMetric adds new metrics', () => {
        setup.registerMetric(metricType);
        expect(start.getMetrics()).toEqual([metricType]);
    });
    it('registerMetric throws error when registering duplicate metric', () => {
        expect(() => {
            setup.registerMetric(metricType);
            setup.registerMetric(metricType);
        }).toThrow(/already been registered with name: count/);
    });
    it('gets either buckets or metrics by id', () => {
        setup.registerBucket(bucketType);
        setup.registerMetric(metricType);
        expect(start.get('terms')).toEqual(bucketType);
        expect(start.get('count')).toEqual(metricType);
    });
    it('getBuckets retrieves only buckets', () => {
        setup.registerBucket(bucketType);
        expect(start.getBuckets()).toEqual([bucketType]);
    });
    it('getMetrics retrieves only metrics', () => {
        setup.registerMetric(metricType);
        expect(start.getMetrics()).toEqual([metricType]);
    });
    it('getAll returns all buckets and metrics', () => {
        setup.registerBucket(bucketType);
        setup.registerMetric(metricType);
        expect(start.getAll()).toEqual({
            buckets: [bucketType],
            metrics: [metricType],
        });
    });
});
