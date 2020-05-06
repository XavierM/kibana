"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
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
const history_1 = require("history");
const public_1 = require("../../../../../plugins/kibana_utils/public");
const public_2 = require("../../../../../plugins/data/public");
let angularModule = null;
let services = null;
/**
 * set bootstrapped inner angular module
 */
function setAngularModule(module) {
    angularModule = module;
}
exports.setAngularModule = setAngularModule;
/**
 * get boostrapped inner angular module
 */
function getAngularModule() {
    return angularModule;
}
exports.getAngularModule = getAngularModule;
function getServices() {
    if (!services) {
        throw new Error('Discover services are not yet available');
    }
    return services;
}
exports.getServices = getServices;
function setServices(newServices) {
    services = newServices;
}
exports.setServices = setServices;
_a = __read(public_1.createGetterSetter('urlTracker'), 2), exports.getUrlTracker = _a[0], exports.setUrlTracker = _a[1];
/**
 * Makes sure discover and context are using one instance of history
 */
exports.getHistory = _.once(() => history_1.createHashHistory());
exports.getRequestInspectorStats = public_2.search.getRequestInspectorStats, exports.getResponseInspectorStats = public_2.search.getResponseInspectorStats, exports.tabifyAggResponse = public_2.search.tabifyAggResponse;
var public_3 = require("../../../../../plugins/kibana_utils/public");
exports.unhashUrl = public_3.unhashUrl;
exports.redirectWhenMissing = public_3.redirectWhenMissing;
var public_4 = require("../../../../../plugins/kibana_legacy/public");
exports.formatMsg = public_4.formatMsg;
exports.formatStack = public_4.formatStack;
exports.subscribeWithScope = public_4.subscribeWithScope;
// EXPORT types
var public_5 = require("../../../../../plugins/data/public");
exports.IndexPattern = public_5.IndexPattern;
exports.indexPatterns = public_5.indexPatterns;
exports.SortDirection = public_5.SortDirection;
