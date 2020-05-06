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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
const public_1 = require("../../kibana_utils/public");
_a = __read(public_1.createGetterSetter('UISettings'), 2), exports.getUISettings = _a[0], exports.setUISettings = _a[1];
_b = __read(public_1.createGetterSetter('FieldFormats'), 2), exports.getFieldFormats = _b[0], exports.setFieldFormats = _b[1];
_c = __read(public_1.createGetterSetter('SavedObjectsClient'), 2), exports.getSavedObjectsClient = _c[0], exports.setSavedObjectsClient = _c[1];
_d = __read(public_1.createGetterSetter('CoreStart'), 2), exports.getCoreStart = _d[0], exports.setCoreStart = _d[1];
_e = __read(public_1.createGetterSetter('DataStart'), 2), exports.getDataStart = _e[0], exports.setDataStart = _e[1];
_f = __read(public_1.createGetterSetter('I18n'), 2), exports.getI18n = _f[0], exports.setI18n = _f[1];
_g = __read(public_1.createGetterSetter('ChartsPluginSetup'), 2), exports.getChartsSetup = _g[0], exports.setChartsSetup = _g[1];
