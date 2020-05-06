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
const Rx = tslib_1.__importStar(require("rxjs"));
const badge_test_mocks_1 = require("./badge.test.mocks");
const badge_1 = require("./badge");
function setup() {
    const getBadge$ = new Rx.BehaviorSubject(undefined);
    badge_test_mocks_1.newPlatformChrome.getBadge$.mockReturnValue(getBadge$);
    const chrome = {};
    badge_1.initChromeBadgeApi(chrome);
    return { chrome, getBadge$ };
}
afterEach(() => {
    jest.resetAllMocks();
});
describe('badge', () => {
    describe('#get$()', () => {
        it('returns newPlatformChrome.getBadge$()', () => {
            const { chrome } = setup();
            expect(chrome.badge.get$()).toBe(badge_test_mocks_1.newPlatformChrome.getBadge$());
        });
    });
    describe('#set()', () => {
        it('calls newPlatformChrome.setBadge', () => {
            const { chrome } = setup();
            const badge = {
                text: 'foo',
                tooltip: `foo's tooltip`,
                iconType: 'alert',
            };
            chrome.badge.set(badge);
            expect(badge_test_mocks_1.newPlatformChrome.setBadge).toHaveBeenCalledTimes(1);
            expect(badge_test_mocks_1.newPlatformChrome.setBadge).toHaveBeenCalledWith(badge);
        });
    });
});
