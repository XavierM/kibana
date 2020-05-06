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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const components_1 = require("./components");
function TimelionOptions({ stateParams, setValue, setValidity }) {
    const setInterval = react_1.useCallback((value) => setValue('interval', value), [
        setValue,
    ]);
    const setExpressionInput = react_1.useCallback((value) => setValue('expression', value), [setValue]);
    return (react_1.default.createElement(eui_1.EuiPanel, { className: "visEditorSidebar__timelionOptions", paddingSize: "s" },
        react_1.default.createElement(components_1.TimelionInterval, { value: stateParams.interval, setValue: setInterval, setValidity: setValidity }),
        react_1.default.createElement(components_1.TimelionExpressionInput, { value: stateParams.expression, setValue: setExpressionInput })));
}
exports.TimelionOptions = TimelionOptions;
