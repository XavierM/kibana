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
const operators_1 = require("rxjs/operators");
const rxjs_1 = require("rxjs");
const sinon_1 = tslib_1.__importStar(require("sinon"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const constants_1 = require("../../constants");
const api_1 = require("./api");
const localStorageGet = sinon_1.default.stub();
const sessionStoragetGet = sinon_1.default.stub();
Object.defineProperty(window, 'localStorage', {
    value: {
        getItem: localStorageGet,
        setItem: sinon_1.stub(),
    },
    writable: true,
});
Object.defineProperty(window, 'sessionStorage', {
    value: {
        getItem: sessionStoragetGet,
        setItem: sinon_1.stub(),
    },
    writable: true,
});
describe('NewsfeedApiDriver', () => {
    const kibanaVersion = 'test_version';
    const userLanguage = 'en';
    const fetchInterval = 2000;
    const getDriver = () => new api_1.NewsfeedApiDriver(kibanaVersion, userLanguage, fetchInterval);
    afterEach(() => {
        sinon_1.default.reset();
    });
    describe('shouldFetch', () => {
        it('defaults to true', () => {
            const driver = getDriver();
            expect(driver.shouldFetch()).toBe(true);
        });
        it('returns true if last fetch time precedes page load time', () => {
            sessionStoragetGet.throws('Wrong key passed!');
            sessionStoragetGet.withArgs(constants_1.NEWSFEED_LAST_FETCH_STORAGE_KEY).returns(322642800000); // 1980-03-23
            const driver = getDriver();
            expect(driver.shouldFetch()).toBe(true);
        });
        it('returns false if last fetch time is recent enough', () => {
            sessionStoragetGet.throws('Wrong key passed!');
            sessionStoragetGet.withArgs(constants_1.NEWSFEED_LAST_FETCH_STORAGE_KEY).returns(3005017200000); // 2065-03-23
            const driver = getDriver();
            expect(driver.shouldFetch()).toBe(false);
        });
    });
    describe('updateHashes', () => {
        it('returns previous and current storage', () => {
            const driver = getDriver();
            const items = [
                {
                    title: 'Good news, everyone!',
                    description: 'good item description',
                    linkText: 'click here',
                    linkUrl: 'about:blank',
                    badge: 'test',
                    publishOn: moment_1.default(1572489035150),
                    expireOn: moment_1.default(1572489047858),
                    hash: 'hash1oneoneoneone',
                },
            ];
            expect(driver.updateHashes(items)).toMatchInlineSnapshot(`
        Object {
          "current": Array [
            "hash1oneoneoneone",
          ],
          "previous": Array [],
        }
      `);
        });
        it('concatenates the previous hashes with the current', () => {
            localStorageGet.throws('Wrong key passed!');
            localStorageGet.withArgs(constants_1.NEWSFEED_HASH_SET_STORAGE_KEY).returns('happyness');
            const driver = getDriver();
            const items = [
                {
                    title: 'Better news, everyone!',
                    description: 'better item description',
                    linkText: 'click there',
                    linkUrl: 'about:blank',
                    badge: 'concatentated',
                    publishOn: moment_1.default(1572489035150),
                    expireOn: moment_1.default(1572489047858),
                    hash: 'three33hash',
                },
            ];
            expect(driver.updateHashes(items)).toMatchInlineSnapshot(`
        Object {
          "current": Array [
            "happyness",
            "three33hash",
          ],
          "previous": Array [
            "happyness",
          ],
        }
      `);
        });
    });
    it('Validates items for required fields', () => {
        const driver = getDriver();
        expect(driver.validateItem({})).toBe(false);
        expect(driver.validateItem({
            title: 'Gadzooks!',
            description: 'gadzooks item description',
            linkText: 'click here',
            linkUrl: 'about:blank',
            badge: 'test',
            publishOn: moment_1.default(1572489035150),
            expireOn: moment_1.default(1572489047858),
            hash: 'hash2twotwotwotwotwo',
        })).toBe(true);
        expect(driver.validateItem({
            title: 'Gadzooks!',
            description: 'gadzooks item description',
            linkText: 'click here',
            linkUrl: 'about:blank',
            publishOn: moment_1.default(1572489035150),
            hash: 'hash2twotwotwotwotwo',
        })).toBe(true);
        expect(driver.validateItem({
            title: 'Gadzooks!',
            description: 'gadzooks item description',
            linkText: 'click here',
            linkUrl: 'about:blank',
            publishOn: moment_1.default(1572489035150),
        })).toBe(false);
    });
    describe('modelItems', () => {
        it('Models empty set with defaults', () => {
            const driver = getDriver();
            const apiItems = [];
            expect(driver.modelItems(apiItems)).toMatchInlineSnapshot(`
        Object {
          "error": null,
          "feedItems": Array [],
          "hasNew": false,
          "kibanaVersion": "test_version",
        }
      `);
        });
        it('Selects default language', () => {
            const driver = getDriver();
            const apiItems = [
                {
                    title: {
                        en: 'speaking English',
                        es: 'habla Espanol',
                    },
                    description: {
                        en: 'language test',
                        es: 'idiomas',
                    },
                    languages: ['en', 'es'],
                    link_text: {
                        en: 'click here',
                        es: 'aqui',
                    },
                    link_url: {
                        en: 'xyzxyzxyz',
                        es: 'abcabc',
                    },
                    badge: {
                        en: 'firefighter',
                        es: 'bombero',
                    },
                    publish_on: new Date('2014-10-31T04:23:47Z'),
                    expire_on: new Date('2049-10-31T04:23:47Z'),
                    hash: 'abcabc1231123123hash',
                },
            ];
            expect(driver.modelItems(apiItems)).toMatchObject({
                error: null,
                feedItems: [
                    {
                        badge: 'firefighter',
                        description: 'language test',
                        hash: 'abcabc1231',
                        linkText: 'click here',
                        linkUrl: 'xyzxyzxyz',
                        title: 'speaking English',
                    },
                ],
                hasNew: true,
                kibanaVersion: 'test_version',
            });
        });
        it("Falls back to English when user language isn't present", () => {
            // Set Language to French
            const driver = new api_1.NewsfeedApiDriver(kibanaVersion, 'fr', fetchInterval);
            const apiItems = [
                {
                    title: {
                        en: 'speaking English',
                        fr: 'Le Title',
                    },
                    description: {
                        en: 'not French',
                        fr: 'Le Description',
                    },
                    languages: ['en', 'fr'],
                    link_text: {
                        en: 'click here',
                        fr: 'Le Link Text',
                    },
                    link_url: {
                        en: 'xyzxyzxyz',
                        fr: 'le_url',
                    },
                    badge: {
                        en: 'firefighter',
                        fr: 'le_badge',
                    },
                    publish_on: new Date('2014-10-31T04:23:47Z'),
                    expire_on: new Date('2049-10-31T04:23:47Z'),
                    hash: 'frfrfrfr1231123123hash',
                },
                {
                    title: {
                        en: 'speaking English',
                        es: 'habla Espanol',
                    },
                    description: {
                        en: 'not French',
                        es: 'no Espanol',
                    },
                    languages: ['en', 'es'],
                    link_text: {
                        en: 'click here',
                        es: 'aqui',
                    },
                    link_url: {
                        en: 'xyzxyzxyz',
                        es: 'abcabc',
                    },
                    badge: {
                        en: 'firefighter',
                        es: 'bombero',
                    },
                    publish_on: new Date('2014-10-31T04:23:47Z'),
                    expire_on: new Date('2049-10-31T04:23:47Z'),
                    hash: 'enenenen1231123123hash',
                },
            ];
            expect(driver.modelItems(apiItems)).toMatchObject({
                error: null,
                feedItems: [
                    {
                        badge: 'le_badge',
                        description: 'Le Description',
                        hash: 'frfrfrfr12',
                        linkText: 'Le Link Text',
                        linkUrl: 'le_url',
                        title: 'Le Title',
                    },
                    {
                        badge: 'firefighter',
                        description: 'not French',
                        hash: 'enenenen12',
                        linkText: 'click here',
                        linkUrl: 'xyzxyzxyz',
                        title: 'speaking English',
                    },
                ],
                hasNew: true,
                kibanaVersion: 'test_version',
            });
        });
        it('Models multiple items into an API FetchResult', () => {
            const driver = getDriver();
            const apiItems = [
                {
                    title: {
                        en: 'guess what',
                    },
                    description: {
                        en: 'this tests the modelItems function',
                    },
                    link_text: {
                        en: 'click here',
                    },
                    link_url: {
                        en: 'about:blank',
                    },
                    publish_on: new Date('2014-10-31T04:23:47Z'),
                    expire_on: new Date('2049-10-31T04:23:47Z'),
                    hash: 'abcabc1231123123hash',
                },
                {
                    title: {
                        en: 'guess when',
                    },
                    description: {
                        en: 'this also tests the modelItems function',
                    },
                    link_text: {
                        en: 'click here',
                    },
                    link_url: {
                        en: 'about:blank',
                    },
                    badge: {
                        en: 'hero',
                    },
                    publish_on: new Date('2014-10-31T04:23:47Z'),
                    expire_on: new Date('2049-10-31T04:23:47Z'),
                    hash: 'defdefdef456456456',
                },
            ];
            expect(driver.modelItems(apiItems)).toMatchObject({
                error: null,
                feedItems: [
                    {
                        badge: null,
                        description: 'this tests the modelItems function',
                        hash: 'abcabc1231',
                        linkText: 'click here',
                        linkUrl: 'about:blank',
                        title: 'guess what',
                    },
                    {
                        badge: 'hero',
                        description: 'this also tests the modelItems function',
                        hash: 'defdefdef4',
                        linkText: 'click here',
                        linkUrl: 'about:blank',
                        title: 'guess when',
                    },
                ],
                hasNew: true,
                kibanaVersion: 'test_version',
            });
        });
        it('Filters expired', () => {
            const driver = getDriver();
            const apiItems = [
                {
                    title: {
                        en: 'guess what',
                    },
                    description: {
                        en: 'this tests the modelItems function',
                    },
                    link_text: {
                        en: 'click here',
                    },
                    link_url: {
                        en: 'about:blank',
                    },
                    publish_on: new Date('2013-10-31T04:23:47Z'),
                    expire_on: new Date('2014-10-31T04:23:47Z'),
                    hash: 'abcabc1231123123hash',
                },
            ];
            expect(driver.modelItems(apiItems)).toMatchInlineSnapshot(`
        Object {
          "error": null,
          "feedItems": Array [],
          "hasNew": false,
          "kibanaVersion": "test_version",
        }
      `);
        });
        it('Filters pre-published', () => {
            const driver = getDriver();
            const apiItems = [
                {
                    title: {
                        en: 'guess what',
                    },
                    description: {
                        en: 'this tests the modelItems function',
                    },
                    link_text: {
                        en: 'click here',
                    },
                    link_url: {
                        en: 'about:blank',
                    },
                    publish_on: new Date('2055-10-31T04:23:47Z'),
                    expire_on: new Date('2056-10-31T04:23:47Z'),
                    hash: 'abcabc1231123123hash',
                },
            ];
            expect(driver.modelItems(apiItems)).toMatchInlineSnapshot(`
        Object {
          "error": null,
          "feedItems": Array [],
          "hasNew": false,
          "kibanaVersion": "test_version",
        }
      `);
        });
    });
});
describe('getApi', () => {
    const mockHttpGet = jest.fn();
    let httpMock = {
        fetch: mockHttpGet,
    };
    const getHttpMockWithItems = (mockApiItems) => (arg1, arg2) => {
        if (arg1 === 'http://fakenews.co/kibana-test/v6.8.2.json' &&
            arg2.method &&
            arg2.method === 'GET') {
            return Promise.resolve({ items: mockApiItems });
        }
        return Promise.reject('wrong args!');
    };
    let configMock;
    afterEach(() => {
        jest.resetAllMocks();
    });
    beforeEach(() => {
        configMock = {
            newsfeed: {
                service: {
                    urlRoot: 'http://fakenews.co',
                    pathTemplate: '/kibana-test/v{VERSION}.json',
                },
                defaultLanguage: 'en',
                mainInterval: 86400000,
                fetchInterval: 86400000,
            },
        };
        httpMock = {
            fetch: mockHttpGet,
        };
    });
    it('creates a result', done => {
        mockHttpGet.mockImplementationOnce(() => Promise.resolve({ items: [] }));
        api_1.getApi(httpMock, configMock.newsfeed, '6.8.2').subscribe(result => {
            expect(result).toMatchInlineSnapshot(`
        Object {
          "error": null,
          "feedItems": Array [],
          "hasNew": false,
          "kibanaVersion": "6.8.2",
        }
      `);
            done();
        });
    });
    it('hasNew is true when the service returns hashes not in the cache', done => {
        const mockApiItems = [
            {
                title: {
                    en: 'speaking English',
                    es: 'habla Espanol',
                },
                description: {
                    en: 'language test',
                    es: 'idiomas',
                },
                languages: ['en', 'es'],
                link_text: {
                    en: 'click here',
                    es: 'aqui',
                },
                link_url: {
                    en: 'xyzxyzxyz',
                    es: 'abcabc',
                },
                badge: {
                    en: 'firefighter',
                    es: 'bombero',
                },
                publish_on: new Date('2014-10-31T04:23:47Z'),
                expire_on: new Date('2049-10-31T04:23:47Z'),
                hash: 'abcabc1231123123hash',
            },
        ];
        mockHttpGet.mockImplementationOnce(getHttpMockWithItems(mockApiItems));
        api_1.getApi(httpMock, configMock.newsfeed, '6.8.2').subscribe(result => {
            expect(result).toMatchInlineSnapshot(`
        Object {
          "error": null,
          "feedItems": Array [
            Object {
              "badge": "firefighter",
              "description": "language test",
              "expireOn": "2049-10-31T04:23:47.000Z",
              "hash": "abcabc1231",
              "linkText": "click here",
              "linkUrl": "xyzxyzxyz",
              "publishOn": "2014-10-31T04:23:47.000Z",
              "title": "speaking English",
            },
          ],
          "hasNew": true,
          "kibanaVersion": "6.8.2",
        }
      `);
            done();
        });
    });
    it('hasNew is false when service returns hashes that are all stored', done => {
        localStorageGet.throws('Wrong key passed!');
        localStorageGet.withArgs(constants_1.NEWSFEED_HASH_SET_STORAGE_KEY).returns('happyness');
        const mockApiItems = [
            {
                title: { en: 'hasNew test' },
                description: { en: 'test' },
                link_text: { en: 'click here' },
                link_url: { en: 'xyzxyzxyz' },
                badge: { en: 'firefighter' },
                publish_on: new Date('2014-10-31T04:23:47Z'),
                expire_on: new Date('2049-10-31T04:23:47Z'),
                hash: 'happyness',
            },
        ];
        mockHttpGet.mockImplementationOnce(getHttpMockWithItems(mockApiItems));
        api_1.getApi(httpMock, configMock.newsfeed, '6.8.2').subscribe(result => {
            expect(result).toMatchInlineSnapshot(`
        Object {
          "error": null,
          "feedItems": Array [
            Object {
              "badge": "firefighter",
              "description": "test",
              "expireOn": "2049-10-31T04:23:47.000Z",
              "hash": "happyness",
              "linkText": "click here",
              "linkUrl": "xyzxyzxyz",
              "publishOn": "2014-10-31T04:23:47.000Z",
              "title": "hasNew test",
            },
          ],
          "hasNew": false,
          "kibanaVersion": "6.8.2",
        }
      `);
            done();
        });
    });
    it('forwards an error', done => {
        mockHttpGet.mockImplementationOnce((arg1, arg2) => Promise.reject('sorry, try again later!'));
        api_1.getApi(httpMock, configMock.newsfeed, '6.8.2').subscribe(result => {
            expect(result).toMatchInlineSnapshot(`
        Object {
          "error": "sorry, try again later!",
          "feedItems": Array [],
          "hasNew": false,
          "kibanaVersion": "6.8.2",
        }
      `);
            done();
        });
    });
    describe('Retry fetching', () => {
        const successItems = [
            {
                title: { en: 'hasNew test' },
                description: { en: 'test' },
                link_text: { en: 'click here' },
                link_url: { en: 'xyzxyzxyz' },
                badge: { en: 'firefighter' },
                publish_on: new Date('2014-10-31T04:23:47Z'),
                expire_on: new Date('2049-10-31T04:23:47Z'),
                hash: 'happyness',
            },
        ];
        it("retries until fetch doesn't error", done => {
            configMock.newsfeed.mainInterval = 10; // fast retry for testing
            mockHttpGet
                .mockImplementationOnce(() => Promise.reject('Sorry, try again later!'))
                .mockImplementationOnce(() => Promise.reject('Sorry, internal server error!'))
                .mockImplementationOnce(() => Promise.reject("Sorry, it's too cold to go outside!"))
                .mockImplementationOnce(getHttpMockWithItems(successItems));
            api_1.getApi(httpMock, configMock.newsfeed, '6.8.2')
                .pipe(operators_1.take(4), operators_1.toArray())
                .subscribe(result => {
                expect(result).toMatchInlineSnapshot(`
            Array [
              Object {
                "error": "Sorry, try again later!",
                "feedItems": Array [],
                "hasNew": false,
                "kibanaVersion": "6.8.2",
              },
              Object {
                "error": "Sorry, internal server error!",
                "feedItems": Array [],
                "hasNew": false,
                "kibanaVersion": "6.8.2",
              },
              Object {
                "error": "Sorry, it's too cold to go outside!",
                "feedItems": Array [],
                "hasNew": false,
                "kibanaVersion": "6.8.2",
              },
              Object {
                "error": null,
                "feedItems": Array [
                  Object {
                    "badge": "firefighter",
                    "description": "test",
                    "expireOn": "2049-10-31T04:23:47.000Z",
                    "hash": "happyness",
                    "linkText": "click here",
                    "linkUrl": "xyzxyzxyz",
                    "publishOn": "2014-10-31T04:23:47.000Z",
                    "title": "hasNew test",
                  },
                ],
                "hasNew": false,
                "kibanaVersion": "6.8.2",
              },
            ]
          `);
                done();
            });
        });
        it("doesn't retry if fetch succeeds", done => {
            configMock.newsfeed.mainInterval = 10; // fast retry for testing
            mockHttpGet.mockImplementation(getHttpMockWithItems(successItems));
            const timeout$ = rxjs_1.interval(1000); // lets us capture some results after a short time
            let timesFetched = 0;
            const get$ = api_1.getApi(httpMock, configMock.newsfeed, '6.8.2').pipe(operators_1.tap(() => {
                timesFetched++;
            }));
            rxjs_1.race(get$, timeout$).subscribe(() => {
                expect(timesFetched).toBe(1); // first fetch was successful, so there was no retry
                done();
            });
        });
    });
});
