"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const public_1 = require("../../../../../../../plugins/kibana_utils/public");
const public_2 = require("../../../../../../../plugins/data/public");
const GLOBAL_STATE_URL_KEY = '_g';
const APP_STATE_URL_KEY = '_a';
/**
 * Builds and returns appState and globalState containers
 * provides helper functions to start/stop syncing with URL
 */
function getState({ defaultStepSize, timeFieldName, storeInSessionStorage = false, history, }) {
    const stateStorage = public_1.createKbnUrlStateStorage({
        useHash: storeInSessionStorage,
        history,
    });
    const globalStateInitial = stateStorage.get(GLOBAL_STATE_URL_KEY);
    const globalStateContainer = public_1.createStateContainer(globalStateInitial);
    const appStateFromUrl = stateStorage.get(APP_STATE_URL_KEY);
    const appStateInitial = createInitialAppState(defaultStepSize, timeFieldName, appStateFromUrl);
    const appStateContainer = public_1.createStateContainer(appStateInitial);
    const { start, stop } = public_1.syncStates([
        {
            storageKey: GLOBAL_STATE_URL_KEY,
            stateContainer: {
                ...globalStateContainer,
                ...{
                    set: (value) => {
                        if (value) {
                            globalStateContainer.set(value);
                        }
                    },
                },
            },
            stateStorage,
        },
        {
            storageKey: APP_STATE_URL_KEY,
            stateContainer: {
                ...appStateContainer,
                ...{
                    set: (value) => {
                        if (value) {
                            appStateContainer.set(value);
                        }
                    },
                },
            },
            stateStorage,
        },
    ]);
    return {
        globalState: globalStateContainer,
        appState: appStateContainer,
        startSync: start,
        stopSync: stop,
        setAppState: (newState) => {
            const oldState = appStateContainer.getState();
            const mergedState = { ...oldState, ...newState };
            if (!isEqualState(oldState, mergedState)) {
                appStateContainer.set(mergedState);
            }
        },
        getFilters: () => [
            ...getFilters(globalStateContainer.getState()),
            ...getFilters(appStateContainer.getState()),
        ],
        setFilters: (filterManager) => {
            // global state filters
            const globalFilters = filterManager.getGlobalFilters();
            const globalFilterChanged = !isEqualFilters(globalFilters, getFilters(globalStateContainer.getState()));
            if (globalFilterChanged) {
                globalStateContainer.set({ filters: globalFilters });
            }
            // app state filters
            const appFilters = filterManager.getAppFilters();
            const appFilterChanged = !isEqualFilters(appFilters, getFilters(appStateContainer.getState()));
            if (appFilterChanged) {
                appStateContainer.set({ ...appStateContainer.getState(), ...{ filters: appFilters } });
            }
        },
        // helper function just needed for testing
        flushToUrl: (replace) => stateStorage.flush({ replace }),
    };
}
exports.getState = getState;
/**
 * Helper function to compare 2 different filter states
 */
function isEqualFilters(filtersA, filtersB) {
    if (!filtersA && !filtersB) {
        return true;
    }
    else if (!filtersA || !filtersB) {
        return false;
    }
    return public_2.esFilters.compareFilters(filtersA, filtersB, public_2.esFilters.COMPARE_ALL_OPTIONS);
}
exports.isEqualFilters = isEqualFilters;
/**
 * Helper function to compare 2 different states, is needed since comparing filters
 * works differently, doesn't work with _.isEqual
 */
function isEqualState(stateA, stateB) {
    if (!stateA && !stateB) {
        return true;
    }
    else if (!stateA || !stateB) {
        return false;
    }
    const { filters: stateAFilters = [], ...stateAPartial } = stateA;
    const { filters: stateBFilters = [], ...stateBPartial } = stateB;
    return (lodash_1.default.isEqual(stateAPartial, stateBPartial) &&
        public_2.esFilters.compareFilters(stateAFilters, stateBFilters, public_2.esFilters.COMPARE_ALL_OPTIONS));
}
/**
 * Helper function to return array of filter object of a given state
 */
function getFilters(state) {
    if (!state || !Array.isArray(state.filters)) {
        return [];
    }
    return state.filters;
}
/**
 * Helper function to return the initial app state, which is a merged object of url state and
 * default state. The default size is the default number of successor/predecessor records to fetch
 */
function createInitialAppState(defaultSize, timeFieldName, urlState) {
    const defaultState = {
        columns: ['_source'],
        filters: [],
        predecessorCount: parseInt(defaultSize, 10),
        sort: [timeFieldName, 'desc'],
        successorCount: parseInt(defaultSize, 10),
    };
    if (typeof urlState !== 'object') {
        return defaultState;
    }
    return {
        ...defaultState,
        ...urlState,
    };
}
