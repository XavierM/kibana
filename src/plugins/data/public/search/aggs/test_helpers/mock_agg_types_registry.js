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
const mocks_1 = require("../../../../../../../src/core/public/mocks");
const agg_types_registry_1 = require("../agg_types_registry");
const agg_types_1 = require("../agg_types");
const bucket_agg_type_1 = require("../buckets/bucket_agg_type");
const metric_agg_type_1 = require("../metrics/metric_agg_type");
const mocks_2 = require("../../../query/mocks");
const mocks_3 = require("../../../field_formats/mocks");
/**
 * Testing utility which creates a new instance of AggTypesRegistry,
 * registers the provided agg types, and returns AggTypesRegistry.start()
 *
 * This is useful if your test depends on a certain agg type to be present
 * in the registry.
 *
 * @param [types] - Optional array of AggTypes to register.
 * If no value is provided, all default types will be registered.
 *
 * @internal
 */
function mockAggTypesRegistry(types) {
    const registry = new agg_types_registry_1.AggTypesRegistry();
    const registrySetup = registry.setup();
    if (types) {
        types.forEach(type => {
            if (type instanceof bucket_agg_type_1.BucketAggType) {
                registrySetup.registerBucket(type);
            }
            else if (type instanceof metric_agg_type_1.MetricAggType) {
                registrySetup.registerMetric(type);
            }
        });
    }
    else {
        const coreSetup = mocks_1.coreMock.createSetup();
        const coreStart = mocks_1.coreMock.createStart();
        const aggTypes = agg_types_1.getAggTypes({
            uiSettings: coreSetup.uiSettings,
            query: mocks_2.queryServiceMock.createSetupContract(),
            getInternalStartServices: () => ({
                fieldFormats: mocks_3.fieldFormatsServiceMock.createStartContract(),
                notifications: mocks_1.notificationServiceMock.createStartContract(),
                uiSettings: coreStart.uiSettings,
                injectedMetadata: coreStart.injectedMetadata,
            }),
        });
        aggTypes.buckets.forEach(type => registrySetup.registerBucket(type));
        aggTypes.metrics.forEach(type => registrySetup.registerMetric(type));
    }
    return registry.start();
}
exports.mockAggTypesRegistry = mockAggTypesRegistry;
