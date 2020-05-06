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
const feature_catalogue_registry_1 = require("./feature_catalogue_registry");
const DASHBOARD_FEATURE = {
    id: 'dashboard',
    title: 'Dashboard',
    description: 'Display and share a collection of visualizations and saved searches.',
    icon: 'dashboardApp',
    path: `/app/kibana#dashboard`,
    showOnHomePage: true,
    category: feature_catalogue_registry_1.FeatureCatalogueCategory.DATA,
};
describe('FeatureCatalogueRegistry', () => {
    describe('setup', () => {
        test('throws when registering duplicate id', () => {
            const setup = new feature_catalogue_registry_1.FeatureCatalogueRegistry().setup();
            setup.register(DASHBOARD_FEATURE);
            expect(() => setup.register(DASHBOARD_FEATURE)).toThrowErrorMatchingInlineSnapshot(`"Feature with id [dashboard] has already been registered. Use a unique id."`);
        });
    });
    describe('start', () => {
        describe('capabilities filtering', () => {
            test('retains items with no entry in capabilities', () => {
                const service = new feature_catalogue_registry_1.FeatureCatalogueRegistry();
                service.setup().register(DASHBOARD_FEATURE);
                const capabilities = { catalogue: {} };
                service.start({ capabilities });
                expect(service.get()).toEqual([DASHBOARD_FEATURE]);
            });
            test('retains items with true in capabilities', () => {
                const service = new feature_catalogue_registry_1.FeatureCatalogueRegistry();
                service.setup().register(DASHBOARD_FEATURE);
                const capabilities = { catalogue: { dashboard: true } };
                service.start({ capabilities });
                expect(service.get()).toEqual([DASHBOARD_FEATURE]);
            });
            test('removes items with false in capabilities', () => {
                const service = new feature_catalogue_registry_1.FeatureCatalogueRegistry();
                service.setup().register(DASHBOARD_FEATURE);
                const capabilities = { catalogue: { dashboard: false } };
                service.start({ capabilities });
                expect(service.get()).toEqual([]);
            });
        });
    });
    describe('title sorting', () => {
        test('sorts by title ascending', () => {
            const service = new feature_catalogue_registry_1.FeatureCatalogueRegistry();
            const setup = service.setup();
            setup.register({ id: '1', title: 'Orange' });
            setup.register({ id: '2', title: 'Apple' });
            setup.register({ id: '3', title: 'Banana' });
            const capabilities = { catalogue: {} };
            service.start({ capabilities });
            expect(service.get()).toEqual([
                { id: '2', title: 'Apple' },
                { id: '3', title: 'Banana' },
                { id: '1', title: 'Orange' },
            ]);
        });
    });
});
