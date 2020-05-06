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
const history_1 = require("history");
const kbn_url_storage_1 = require("./kbn_url_storage");
const hash_unhash_url_1 = require("./hash_unhash_url");
/**
 * Listens to history changes and optionally to global state changes and updates the nav link url of
 * a given app to point to the last visited page within the app.
 *
 * This includes the following parts:
 * * When the app is currently active, the nav link points to the configurable default url of the app.
 * * When the app is not active the last visited url is set to the nav link.
 * * When a provided observable emits a new value, the state parameter in the url of the nav link is updated
 * as long as the app is not active.
 */
function createKbnUrlTracker({ baseUrl, defaultSubUrl, storageKey, stateParams, navLinkUpdater$, toastNotifications, history, getHistory, storage, shouldTrackUrlUpdate = pathname => {
    const currentAppName = defaultSubUrl.slice(2); // cut hash and slash symbols
    const targetAppName = pathname.split('/')[1];
    return currentAppName === targetAppName;
}, }) {
    const storageInstance = storage || sessionStorage;
    // local state storing current listeners and active url
    let activeUrl = '';
    let unsubscribeURLHistory;
    let unsubscribeGlobalState;
    function setNavLink(hash) {
        navLinkUpdater$.next(() => ({ activeUrl: baseUrl + hash }));
    }
    function getActiveSubUrl(url) {
        // remove baseUrl prefix (just storing the sub url part)
        return url.substr(baseUrl.length);
    }
    function unsubscribe() {
        if (unsubscribeURLHistory) {
            unsubscribeURLHistory();
            unsubscribeURLHistory = undefined;
        }
        if (unsubscribeGlobalState) {
            unsubscribeGlobalState.forEach(sub => sub.unsubscribe());
            unsubscribeGlobalState = undefined;
        }
    }
    function setActiveUrl(newUrl) {
        const urlWithHashes = baseUrl + '#' + newUrl;
        let urlWithStates = '';
        try {
            urlWithStates = hash_unhash_url_1.unhashUrl(urlWithHashes);
        }
        catch (e) {
            toastNotifications.addDanger(e.message);
        }
        activeUrl = getActiveSubUrl(urlWithStates || urlWithHashes);
        storageInstance.setItem(storageKey, activeUrl);
    }
    function onMountApp() {
        unsubscribe();
        const historyInstance = history || (getHistory && getHistory()) || history_1.createHashHistory();
        // track current hash when within app
        unsubscribeURLHistory = historyInstance.listen(location => {
            if (shouldTrackUrlUpdate(location.pathname)) {
                setActiveUrl(location.pathname + location.search);
            }
        });
    }
    function onUnmountApp() {
        unsubscribe();
        // propagate state updates when in other apps
        unsubscribeGlobalState = stateParams.map(({ stateUpdate$, kbnUrlKey }) => stateUpdate$.subscribe(state => {
            const updatedUrl = kbn_url_storage_1.setStateToKbnUrl(kbnUrlKey, state, { useHash: false }, baseUrl + (activeUrl || defaultSubUrl));
            // remove baseUrl prefix (just storing the sub url part)
            activeUrl = getActiveSubUrl(updatedUrl);
            storageInstance.setItem(storageKey, activeUrl);
            setNavLink(activeUrl);
        }));
    }
    // register listeners for unmounted app initially
    onUnmountApp();
    // initialize nav link and internal state
    const storedUrl = storageInstance.getItem(storageKey);
    if (storedUrl) {
        activeUrl = storedUrl;
        setNavLink(storedUrl);
    }
    return {
        appMounted() {
            onMountApp();
            setNavLink(defaultSubUrl);
        },
        appUnMounted() {
            onUnmountApp();
            setNavLink(activeUrl);
        },
        stop() {
            unsubscribe();
        },
        setActiveUrl,
    };
}
exports.createKbnUrlTracker = createKbnUrlTracker;
