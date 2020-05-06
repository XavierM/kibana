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
const mock_1 = require("../../storage/hashed_item_store/mock");
const hashed_item_store_1 = require("../../storage/hashed_item_store");
const hash_unhash_url_1 = require("./hash_unhash_url");
describe('hash unhash url', () => {
    beforeEach(() => {
        mock_1.mockStorage.clear();
        mock_1.mockStorage.setStubbedSizeLimit(5000000);
    });
    describe('hash url', () => {
        describe('does nothing', () => {
            it('if url is empty', () => {
                const url = '';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if just a host and port', () => {
                const url = 'https://localhost:5601';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if just a path', () => {
                const url = 'https://localhost:5601/app/kibana';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if just a path and query', () => {
                const url = 'https://localhost:5601/app/kibana?foo=bar';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if empty hash with query', () => {
                const url = 'https://localhost:5601/app/kibana?foo=bar#';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if query parameter matches and there is no hash', () => {
                const url = 'https://localhost:5601/app/kibana?testParam=(yes:!t)';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it(`if query parameter matches and it's before the hash`, () => {
                const url = 'https://localhost:5601/app/kibana?testParam=(yes:!t)';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if empty hash without query', () => {
                const url = 'https://localhost:5601/app/kibana#';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if hash is just a path', () => {
                const url = 'https://localhost:5601/app/kibana#/discover';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
            it('if hash does not have matching query string vals', () => {
                const url = 'https://localhost:5601/app/kibana#/discover?foo=bar';
                expect(hash_unhash_url_1.hashUrl(url)).toBe(url);
            });
        });
        describe('replaces expanded state with hash', () => {
            it('if uses single state param', () => {
                const stateParamKey = '_g';
                const stateParamValue = '(yes:!t)';
                const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey}=${stateParamValue}`;
                const result = hash_unhash_url_1.hashUrl(url);
                expect(result).toMatchInlineSnapshot(`"https://localhost:5601/app/kibana#/discover?foo=bar&_g=h@4e60e02"`);
                expect(mock_1.mockStorage.getItem('kbn.hashedItemsIndex.v1')).toBeTruthy();
                expect(mock_1.mockStorage.getItem('h@4e60e02')).toEqual(JSON.stringify({ yes: true }));
            });
            it('if uses multiple states params', () => {
                const stateParamKey1 = '_g';
                const stateParamValue1 = '(yes:!t)';
                const stateParamKey2 = '_a';
                const stateParamValue2 = '(yes:!f)';
                const stateParamKey3 = '_b';
                const stateParamValue3 = '(yes:!f)';
                const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey1}=${stateParamValue1}&${stateParamKey2}=${stateParamValue2}&${stateParamKey3}=${stateParamValue3}`;
                const result = hash_unhash_url_1.hashUrl(url);
                expect(result).toMatchInlineSnapshot(`"https://localhost:5601/app/kibana#/discover?foo=bar&_g=h@4e60e02&_a=h@61fa078&_b=(yes:!f)"`);
                expect(mock_1.mockStorage.getItem('h@4e60e02')).toEqual(JSON.stringify({ yes: true }));
                expect(mock_1.mockStorage.getItem('h@61fa078')).toEqual(JSON.stringify({ yes: false }));
                if (!hashed_item_store_1.HashedItemStore.PERSISTED_INDEX_KEY) {
                    // This is very brittle and depends upon HashedItemStore implementation details,
                    // so let's protect ourselves from accidentally breaking this test.
                    throw new Error('Missing HashedItemStore.PERSISTED_INDEX_KEY');
                }
                expect(mock_1.mockStorage.getItem(hashed_item_store_1.HashedItemStore.PERSISTED_INDEX_KEY)).toBeTruthy();
                expect(mock_1.mockStorage.length).toBe(3);
            });
            it('hashes only whitelisted properties', () => {
                const stateParamKey1 = '_g';
                const stateParamValue1 = '(yes:!t)';
                const stateParamKey2 = '_a';
                const stateParamValue2 = '(yes:!f)';
                const stateParamKey3 = '_someother';
                const stateParamValue3 = '(yes:!f)';
                const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey1}=${stateParamValue1}&${stateParamKey2}=${stateParamValue2}&${stateParamKey3}=${stateParamValue3}`;
                const result = hash_unhash_url_1.hashUrl(url);
                expect(result).toMatchInlineSnapshot(`"https://localhost:5601/app/kibana#/discover?foo=bar&_g=h@4e60e02&_a=h@61fa078&_someother=(yes:!f)"`);
                expect(mock_1.mockStorage.length).toBe(3); // 2 hashes + HashedItemStoreSingleton.PERSISTED_INDEX_KEY
            });
        });
        it('throws error if unable to hash url', () => {
            const stateParamKey1 = '_g';
            const stateParamValue1 = '(yes:!t)';
            mock_1.mockStorage.setStubbedSizeLimit(1);
            const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey1}=${stateParamValue1}`;
            expect(() => hash_unhash_url_1.hashUrl(url)).toThrowError();
        });
    });
    describe('unhash url', () => {
        describe('does nothing', () => {
            it('if missing input', () => {
                expect(() => {
                    // @ts-ignore
                }).not.toThrowError();
            });
            it('if just a host and port', () => {
                const url = 'https://localhost:5601';
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
            it('if just a path', () => {
                const url = 'https://localhost:5601/app/kibana';
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
            it('if just a path and query', () => {
                const url = 'https://localhost:5601/app/kibana?foo=bar';
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
            it('if empty hash with query', () => {
                const url = 'https://localhost:5601/app/kibana?foo=bar#';
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
            it('if empty hash without query', () => {
                const url = 'https://localhost:5601/app/kibana#';
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
            it('if hash is just a path', () => {
                const url = 'https://localhost:5601/app/kibana#/discover';
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
            it('if hash does not have matching query string vals', () => {
                const url = 'https://localhost:5601/app/kibana#/discover?foo=bar';
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
            it("if hash has matching query, but it isn't hashed", () => {
                const stateParamKey = '_g';
                const stateParamValue = '(yes:!t)';
                const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey}=${stateParamValue}`;
                expect(hash_unhash_url_1.unhashUrl(url)).toBe(url);
            });
        });
        describe('replaces expanded state with hash', () => {
            it('if uses single state param', () => {
                const stateParamKey = '_g';
                const stateParamValueHashed = 'h@4e60e02';
                const state = { yes: true };
                mock_1.mockStorage.setItem(stateParamValueHashed, JSON.stringify(state));
                const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey}=${stateParamValueHashed}`;
                const result = hash_unhash_url_1.unhashUrl(url);
                expect(result).toMatchInlineSnapshot(`"https://localhost:5601/app/kibana#/discover?foo=bar&_g=(yes:!t)"`);
            });
            it('if uses multiple state param', () => {
                const stateParamKey1 = '_g';
                const stateParamValueHashed1 = 'h@4e60e02';
                const state1 = { yes: true };
                const stateParamKey2 = '_a';
                const stateParamValueHashed2 = 'h@61fa078';
                const state2 = { yes: false };
                mock_1.mockStorage.setItem(stateParamValueHashed1, JSON.stringify(state1));
                mock_1.mockStorage.setItem(stateParamValueHashed2, JSON.stringify(state2));
                const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey1}=${stateParamValueHashed1}&${stateParamKey2}=${stateParamValueHashed2}`;
                const result = hash_unhash_url_1.unhashUrl(url);
                expect(result).toMatchInlineSnapshot(`"https://localhost:5601/app/kibana#/discover?foo=bar&_g=(yes:!t)&_a=(yes:!f)"`);
            });
            it('unhashes only whitelisted properties', () => {
                const stateParamKey1 = '_g';
                const stateParamValueHashed1 = 'h@4e60e02';
                const state1 = { yes: true };
                const stateParamKey2 = '_a';
                const stateParamValueHashed2 = 'h@61fa078';
                const state2 = { yes: false };
                const stateParamKey3 = '_someother';
                const stateParamValueHashed3 = 'h@61fa078';
                const state3 = { yes: false };
                mock_1.mockStorage.setItem(stateParamValueHashed1, JSON.stringify(state1));
                mock_1.mockStorage.setItem(stateParamValueHashed2, JSON.stringify(state2));
                mock_1.mockStorage.setItem(stateParamValueHashed3, JSON.stringify(state3));
                const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey1}=${stateParamValueHashed1}&${stateParamKey2}=${stateParamValueHashed2}&${stateParamKey3}=${stateParamValueHashed3}`;
                const result = hash_unhash_url_1.unhashUrl(url);
                expect(result).toMatchInlineSnapshot(`"https://localhost:5601/app/kibana#/discover?foo=bar&_g=(yes:!t)&_a=(yes:!f)&_someother=h@61fa078"`);
            });
        });
        it('throws error if unable to restore the url', () => {
            const stateParamKey1 = '_g';
            const stateParamValueHashed1 = 'h@4e60e02';
            const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey1}=${stateParamValueHashed1}`;
            expect(() => hash_unhash_url_1.unhashUrl(url)).toThrowErrorMatchingInlineSnapshot(`"Unable to completely restore the URL, be sure to use the share functionality."`);
        });
    });
    describe('hash unhash url integration', () => {
        it('hashing and unhashing url should produce the same result', () => {
            const stateParamKey1 = '_g';
            const stateParamValue1 = '(yes:!t)';
            const stateParamKey2 = '_a';
            const stateParamValue2 = '(yes:!f)';
            const stateParamKey3 = '_someother';
            const stateParamValue3 = '(yes:!f)';
            const url = `https://localhost:5601/app/kibana#/discover?foo=bar&${stateParamKey1}=${stateParamValue1}&${stateParamKey2}=${stateParamValue2}&${stateParamKey3}=${stateParamValue3}`;
            const result = hash_unhash_url_1.unhashUrl(hash_unhash_url_1.hashUrl(url));
            expect(url).toEqual(result);
        });
    });
});
