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
const injected_metadata_service_1 = require("./injected_metadata_service");
describe('setup.getKibanaBuildNumber()', () => {
    it('returns buildNumber from injectedMetadata', () => {
        const setup = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                buildNumber: 'foo',
            },
        }).setup();
        expect(setup.getKibanaBuildNumber()).toBe('foo');
    });
});
describe('setup.getCspConfig()', () => {
    it('returns injectedMetadata.csp', () => {
        const setup = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                csp: {
                    warnLegacyBrowsers: true,
                },
            },
        }).setup();
        expect(setup.getCspConfig()).toEqual({
            warnLegacyBrowsers: true,
        });
    });
    it('csp config is frozen', () => {
        const injectedMetadata = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                csp: {
                    warnLegacyBrowsers: true,
                },
            },
        });
        const csp = injectedMetadata.setup().getCspConfig();
        expect(() => {
            // @ts-ignore TS knows this shouldn't be possible
            csp.warnLegacyBrowsers = false;
        }).toThrowError();
    });
});
describe('setup.getPlugins()', () => {
    it('returns injectedMetadata.uiPlugins', () => {
        const injectedMetadata = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                uiPlugins: [
                    { id: 'plugin-1', plugin: {}, config: { clientProp: 'clientValue' } },
                    { id: 'plugin-2', plugin: {} },
                ],
            },
        });
        const plugins = injectedMetadata.setup().getPlugins();
        expect(plugins).toEqual([
            { id: 'plugin-1', plugin: {}, config: { clientProp: 'clientValue' } },
            { id: 'plugin-2', plugin: {} },
        ]);
    });
    it('returns frozen version of uiPlugins', () => {
        const injectedMetadata = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                uiPlugins: [
                    { id: 'plugin-1', plugin: {} },
                    { id: 'plugin-2', plugin: {} },
                ],
            },
        });
        const plugins = injectedMetadata.setup().getPlugins();
        expect(() => {
            plugins.pop();
        }).toThrowError();
        expect(() => {
            plugins.push({ id: 'new-plugin', plugin: {} });
        }).toThrowError();
        expect(() => {
            // @ts-ignore TS knows this shouldn't be possible
            plugins[0].name = 'changed';
        }).toThrowError();
        expect(() => {
            // @ts-ignore TS knows this shouldn't be possible
            plugins[0].newProp = 'changed';
        }).toThrowError();
    });
});
describe('setup.getLegacyMetadata()', () => {
    it('returns injectedMetadata.legacyMetadata', () => {
        const injectedMetadata = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                legacyMetadata: 'foo',
            },
        });
        const contract = injectedMetadata.setup();
        expect(contract.getLegacyMetadata()).toBe('foo');
    });
    it('exposes frozen version of legacyMetadata', () => {
        const injectedMetadata = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                legacyMetadata: {
                    foo: true,
                },
            },
        });
        const legacyMetadata = injectedMetadata.setup().getLegacyMetadata();
        expect(legacyMetadata).toEqual({
            foo: true,
        });
        expect(() => {
            // @ts-ignore TS knows this shouldn't be possible
            legacyMetadata.foo = false;
        }).toThrowError();
    });
});
describe('setup.getInjectedVar()', () => {
    it('returns values from injectedMetadata.vars', () => {
        const setup = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                vars: {
                    foo: {
                        bar: '1',
                    },
                    'baz:box': {
                        foo: 2,
                    },
                },
            },
        }).setup();
        expect(setup.getInjectedVar('foo')).toEqual({
            bar: '1',
        });
        expect(setup.getInjectedVar('foo.bar')).toBe('1');
        expect(setup.getInjectedVar('baz:box')).toEqual({
            foo: 2,
        });
        expect(setup.getInjectedVar('')).toBe(undefined);
    });
    it('returns read-only values', () => {
        const setup = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                vars: {
                    foo: {
                        bar: 1,
                    },
                },
            },
        }).setup();
        const foo = setup.getInjectedVar('foo');
        expect(() => {
            foo.bar = 2;
        }).toThrowErrorMatchingInlineSnapshot(`"Cannot assign to read only property 'bar' of object '#<Object>'"`);
        expect(() => {
            foo.newProp = 2;
        }).toThrowErrorMatchingInlineSnapshot(`"Cannot add property newProp, object is not extensible"`);
    });
});
describe('setup.getInjectedVars()', () => {
    it('returns all injected vars, readonly', () => {
        const setup = new injected_metadata_service_1.InjectedMetadataService({
            injectedMetadata: {
                vars: {
                    foo: {
                        bar: 1,
                    },
                },
            },
        }).setup();
        const vars = setup.getInjectedVars();
        expect(() => {
            vars.foo = 2;
        }).toThrowErrorMatchingInlineSnapshot(`"Cannot assign to read only property 'foo' of object '#<Object>'"`);
        expect(() => {
            vars.newProp = 2;
        }).toThrowErrorMatchingInlineSnapshot(`"Cannot add property newProp, object is not extensible"`);
    });
});
