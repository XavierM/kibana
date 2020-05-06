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
const d3_1 = tslib_1.__importDefault(require("d3"));
const jquery_1 = tslib_1.__importDefault(require("jquery"));
class Binder {
    constructor($scope) {
        this.disposal = [];
        // support auto-binding to $scope objects
        if ($scope) {
            $scope.$on('$destroy', () => this.destroy());
        }
    }
    on(emitter, ...args) {
        const on = emitter.on || emitter.addListener;
        const off = emitter.off || emitter.removeListener;
        on.apply(emitter, args);
        this.disposal.push(() => off.apply(emitter, args));
    }
    destroy() {
        const destroyers = this.disposal;
        this.disposal = [];
        destroyers.forEach(fn => fn());
    }
    jqOn(el, ...args) {
        const $el = jquery_1.default(el);
        $el.on(...args);
        this.disposal.push(() => $el.off(...args));
    }
    fakeD3Bind(el, event, handler) {
        this.jqOn(el, event, (e) => {
            // mimic https://github.com/mbostock/d3/blob/3abb00113662463e5c19eb87cd33f6d0ddc23bc0/src/selection/on.js#L87-L94
            const o = d3_1.default.event; // Events can be reentrant (e.g., focus).
            d3_1.default.event = e;
            try {
                // @ts-ignore
                handler.apply(this, [this.__data__]);
            }
            finally {
                d3_1.default.event = o;
            }
        });
    }
}
exports.Binder = Binder;
