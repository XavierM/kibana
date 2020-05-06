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
const deprecation_factory_1 = require("../../config/deprecation/deprecation_factory");
const apply_deprecations_1 = require("../../config/deprecation/apply_deprecations");
const legacy_deprecation_adapters_1 = require("./legacy_deprecation_adapters");
jest.spyOn(deprecation_factory_1.configDeprecationFactory, 'unusedFromRoot');
jest.spyOn(deprecation_factory_1.configDeprecationFactory, 'renameFromRoot');
const executeHandlers = (handlers) => {
    handlers.forEach(handler => {
        handler({}, '', () => null);
    });
};
describe('convertLegacyDeprecationProvider', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it('returns the same number of handlers', async () => {
        const legacyProvider = ({ rename, unused }) => [
            rename('a', 'b'),
            unused('c'),
            unused('d'),
        ];
        const migrated = await legacy_deprecation_adapters_1.convertLegacyDeprecationProvider(legacyProvider);
        const handlers = migrated(deprecation_factory_1.configDeprecationFactory);
        expect(handlers).toHaveLength(3);
    });
    it('invokes the factory "unusedFromRoot" when using legacy "unused"', async () => {
        const legacyProvider = ({ rename, unused }) => [
            rename('a', 'b'),
            unused('c'),
            unused('d'),
        ];
        const migrated = await legacy_deprecation_adapters_1.convertLegacyDeprecationProvider(legacyProvider);
        const handlers = migrated(deprecation_factory_1.configDeprecationFactory);
        executeHandlers(handlers);
        expect(deprecation_factory_1.configDeprecationFactory.unusedFromRoot).toHaveBeenCalledTimes(2);
        expect(deprecation_factory_1.configDeprecationFactory.unusedFromRoot).toHaveBeenCalledWith('c');
        expect(deprecation_factory_1.configDeprecationFactory.unusedFromRoot).toHaveBeenCalledWith('d');
    });
    it('invokes the factory "renameFromRoot" when using legacy "rename"', async () => {
        const legacyProvider = ({ rename, unused }) => [
            rename('a', 'b'),
            unused('c'),
            rename('d', 'e'),
        ];
        const migrated = await legacy_deprecation_adapters_1.convertLegacyDeprecationProvider(legacyProvider);
        const handlers = migrated(deprecation_factory_1.configDeprecationFactory);
        executeHandlers(handlers);
        expect(deprecation_factory_1.configDeprecationFactory.renameFromRoot).toHaveBeenCalledTimes(2);
        expect(deprecation_factory_1.configDeprecationFactory.renameFromRoot).toHaveBeenCalledWith('a', 'b');
        expect(deprecation_factory_1.configDeprecationFactory.renameFromRoot).toHaveBeenCalledWith('d', 'e');
    });
    it('properly works in a real use case', async () => {
        const legacyProvider = ({ rename, unused }) => [
            rename('old', 'new'),
            unused('unused'),
            unused('notpresent'),
        ];
        const convertedProvider = await legacy_deprecation_adapters_1.convertLegacyDeprecationProvider(legacyProvider);
        const handlers = convertedProvider(deprecation_factory_1.configDeprecationFactory);
        const rawConfig = {
            old: 'oldvalue',
            unused: 'unused',
            goodValue: 'good',
        };
        const migrated = apply_deprecations_1.applyDeprecations(rawConfig, handlers.map(handler => ({ deprecation: handler, path: '' })));
        expect(migrated).toEqual({ new: 'oldvalue', goodValue: 'good' });
    });
});
