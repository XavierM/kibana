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
const moment_1 = tslib_1.__importDefault(require("moment"));
const i18n_1 = require("@kbn/i18n");
const operators_1 = require("rxjs/operators");
const constants_1 = require("../../constants");
class NewsfeedApiDriver {
    constructor(kibanaVersion, userLanguage, fetchInterval) {
        this.kibanaVersion = kibanaVersion;
        this.userLanguage = userLanguage;
        this.fetchInterval = fetchInterval;
        this.loadedTime = moment_1.default().utc(); // the date is compared to time in UTC format coming from the service
    }
    shouldFetch() {
        const lastFetchUtc = sessionStorage.getItem(constants_1.NEWSFEED_LAST_FETCH_STORAGE_KEY);
        if (lastFetchUtc == null) {
            return true;
        }
        const last = moment_1.default(lastFetchUtc, 'x'); // parse as unix ms timestamp (already is UTC)
        // does the last fetch time precede the time that the page was loaded?
        if (this.loadedTime.diff(last) > 0) {
            return true;
        }
        const now = moment_1.default.utc(); // always use UTC to compare timestamps that came from the service
        const duration = moment_1.default.duration(now.diff(last));
        return duration.asMilliseconds() > this.fetchInterval;
    }
    updateLastFetch() {
        sessionStorage.setItem(constants_1.NEWSFEED_LAST_FETCH_STORAGE_KEY, Date.now().toString());
    }
    updateHashes(items) {
        // replace localStorage hashes with new hashes
        const stored = localStorage.getItem(constants_1.NEWSFEED_HASH_SET_STORAGE_KEY);
        let old = [];
        if (stored != null) {
            old = stored.split(',');
        }
        const newHashes = items.map(i => i.hash);
        const updatedHashes = [...new Set(old.concat(newHashes))];
        localStorage.setItem(constants_1.NEWSFEED_HASH_SET_STORAGE_KEY, updatedHashes.join(','));
        return { previous: old, current: updatedHashes };
    }
    fetchNewsfeedItems(http, config) {
        const urlPath = config.pathTemplate.replace('{VERSION}', this.kibanaVersion);
        const fullUrl = config.urlRoot + urlPath;
        return Rx.from(http
            .fetch(fullUrl, {
            method: 'GET',
        })
            .then(({ items }) => this.modelItems(items)));
    }
    validateItem(item) {
        const hasMissing = [
            item.title,
            item.description,
            item.linkText,
            item.linkUrl,
            item.publishOn,
            item.hash,
        ].includes(undefined);
        return !hasMissing;
    }
    modelItems(items) {
        const feedItems = items.reduce((accum, it) => {
            let chosenLanguage = this.userLanguage;
            const { expire_on: expireOnUtc, publish_on: publishOnUtc, languages, title, description, link_text: linkText, link_url: linkUrl, badge, hash, } = it;
            if (moment_1.default(expireOnUtc).isBefore(Date.now())) {
                return accum; // ignore item if expired
            }
            if (moment_1.default(publishOnUtc).isAfter(Date.now())) {
                return accum; // ignore item if publish date hasn't occurred yet (pre-published)
            }
            if (languages && !languages.includes(chosenLanguage)) {
                chosenLanguage = constants_1.NEWSFEED_FALLBACK_LANGUAGE; // don't remove the item: fallback on a language
            }
            const tempItem = {
                title: title[chosenLanguage],
                description: description[chosenLanguage],
                linkText: linkText[chosenLanguage],
                linkUrl: linkUrl[chosenLanguage],
                badge: badge != null ? badge[chosenLanguage] : null,
                publishOn: moment_1.default(publishOnUtc),
                expireOn: moment_1.default(expireOnUtc),
                hash: hash.slice(0, 10),
            };
            if (!this.validateItem(tempItem)) {
                return accum; // ignore if title, description, etc is missing
            }
            return [...accum, tempItem];
        }, []);
        // calculate hasNew
        const { previous, current } = this.updateHashes(feedItems);
        const hasNew = current.length > previous.length;
        return {
            error: null,
            kibanaVersion: this.kibanaVersion,
            hasNew,
            feedItems,
        };
    }
}
exports.NewsfeedApiDriver = NewsfeedApiDriver;
/*
 * Creates an Observable to newsfeed items, powered by the main interval
 * Computes hasNew value from new item hashes saved in localStorage
 */
function getApi(http, config, kibanaVersion) {
    const userLanguage = i18n_1.i18n.getLocale() || config.defaultLanguage;
    const fetchInterval = config.fetchInterval;
    const driver = new NewsfeedApiDriver(kibanaVersion, userLanguage, fetchInterval);
    return Rx.timer(0, config.mainInterval).pipe(operators_1.filter(() => driver.shouldFetch()), operators_1.mergeMap(() => driver.fetchNewsfeedItems(http, config.service).pipe(operators_1.catchError(err => {
        window.console.error(err);
        return Rx.of({
            error: err,
            kibanaVersion,
            hasNew: false,
            feedItems: [],
        });
    }))), operators_1.tap(() => driver.updateLastFetch()));
}
exports.getApi = getApi;
