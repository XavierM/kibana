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
const i18n_1 = require("@kbn/i18n");
const collections_1 = require("../../../utils/collections");
const public_1 = require("../../../../../charts/public");
const rangeError = i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.minErrorMessage', {
    defaultMessage: 'Min should be less than Max.',
});
const minError = i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.minNeededScaleText', {
    defaultMessage: 'Min must exceed 0 when a log scale is selected.',
});
function areExtentsValid(min = null, max = null) {
    if (min === null || max === null) {
        return true;
    }
    return max > min;
}
function isNullOrUndefined(value) {
    return value === null || value === undefined;
}
function YExtents({ scale, setScale, setMultipleValidity }) {
    const { min, max, type } = scale;
    const errors = [];
    if (!areExtentsValid(min, max)) {
        errors.push(rangeError);
    }
    if (type === collections_1.ScaleTypes.LOG && (isNullOrUndefined(min) || min <= 0)) {
        errors.push(minError);
    }
    const isValid = !errors.length;
    const setExtents = react_1.useCallback((paramName, value) => {
        setScale(paramName, value === '' ? null : value);
    }, [setScale]);
    react_1.useEffect(() => {
        setMultipleValidity('yExtents', isValid);
        return () => setMultipleValidity('yExtents', true);
    }, [isValid, setMultipleValidity]);
    return (react_1.default.createElement(eui_1.EuiFormRow, { error: errors, isInvalid: !!errors.length, fullWidth: true, compressed: true },
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(public_1.NumberInputOption, { "data-test-subj": "yAxisYExtentsMin", isInvalid: !!errors.length, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.minLabel', {
                            defaultMessage: 'Min',
                        }), step: 0.1, paramName: "min", value: isNullOrUndefined(min) ? '' : min, setValue: setExtents })),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(public_1.NumberInputOption, { "data-test-subj": "yAxisYExtentsMax", label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.maxLabel', {
                            defaultMessage: 'Max',
                        }), step: 0.1, paramName: "max", value: isNullOrUndefined(max) ? '' : max, setValue: setExtents }))))));
}
exports.YExtents = YExtents;
