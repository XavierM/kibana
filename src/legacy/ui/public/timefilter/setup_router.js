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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const chrome_1 = tslib_1.__importDefault(require("ui/chrome"));
const rxjs_1 = require("rxjs");
const fatal_error_1 = require("ui/notify/fatal_error");
const public_1 = require("../../../../plugins/kibana_legacy/public");
// TODO
// remove everything underneath once globalState is no longer an angular service
// and listener can be registered without angular.
function convertISO8601(stringTime) {
    const obj = moment_1.default(stringTime, 'YYYY-MM-DDTHH:mm:ss.SSSZ', true);
    return obj.isValid() ? obj.toISOString() : stringTime;
}
function getTimefilterConfig() {
    const settings = chrome_1.default.getUiSettingsClient();
    return {
        timeDefaults: settings.get('timepicker:timeDefaults'),
        refreshIntervalDefaults: settings.get('timepicker:refreshIntervalDefaults'),
    };
}
exports.getTimefilterConfig = getTimefilterConfig;
exports.registerTimefilterWithGlobalStateFactory = (timefilter, globalState, $rootScope) => {
    // settings have to be re-fetched here, to make sure that settings changed by overrideLocalDefault are taken into account.
    const config = getTimefilterConfig();
    timefilter.setTime(lodash_1.default.defaults(globalState.time || {}, config.timeDefaults));
    timefilter.setRefreshInterval(lodash_1.default.defaults(globalState.refreshInterval || {}, config.refreshIntervalDefaults));
    globalState.on('fetch_with_changes', () => {
        // clone and default to {} in one
        const newTime = lodash_1.default.defaults({}, globalState.time, config.timeDefaults);
        const newRefreshInterval = lodash_1.default.defaults({}, globalState.refreshInterval, config.refreshIntervalDefaults);
        if (newTime) {
            if (newTime.to)
                newTime.to = convertISO8601(newTime.to);
            if (newTime.from)
                newTime.from = convertISO8601(newTime.from);
        }
        timefilter.setTime(newTime);
        timefilter.setRefreshInterval(newRefreshInterval);
    });
    const updateGlobalStateWithTime = () => {
        globalState.time = timefilter.getTime();
        globalState.refreshInterval = timefilter.getRefreshInterval();
        globalState.save();
    };
    const subscriptions = new rxjs_1.Subscription();
    subscriptions.add(public_1.subscribeWithScope($rootScope, timefilter.getRefreshIntervalUpdate$(), {
        next: updateGlobalStateWithTime,
    }, fatal_error_1.fatalError));
    subscriptions.add(public_1.subscribeWithScope($rootScope, timefilter.getTimeUpdate$(), {
        next: updateGlobalStateWithTime,
    }, fatal_error_1.fatalError));
    $rootScope.$on('$destroy', () => {
        subscriptions.unsubscribe();
    });
};
// Currently some parts of Kibana (index patterns, timefilter) rely on addSetupWork in the uiRouter
// and require it to be executed to properly function.
// This function is exposed for applications that do not use uiRoutes like APM
// Kibana issue https://github.com/elastic/kibana/issues/19110 tracks the removal of this dependency on uiRouter
exports.registerTimefilterWithGlobalState = lodash_1.default.once(exports.registerTimefilterWithGlobalStateFactory);
