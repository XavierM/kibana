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
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../../../charts/public");
const y_extents_1 = require("./y_extents");
function CustomExtentsOptions({ axisScale, setMultipleValidity, setValueAxis, setValueAxisScale, }) {
    const invalidBoundsMarginMessage = i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.scaleToDataBounds.minNeededBoundsMargin', { defaultMessage: 'Bounds margin must be greater than or equal to 0.' });
    const isBoundsMarginValid = !axisScale.defaultYExtents || !axisScale.boundsMargin || axisScale.boundsMargin >= 0;
    const setBoundsMargin = react_1.useCallback((paramName, value) => setValueAxisScale(paramName, value === '' ? undefined : value), [setValueAxisScale]);
    const onDefaultYExtentsChange = react_1.useCallback((paramName, value) => {
        const scale = { ...axisScale, [paramName]: value };
        if (!scale.defaultYExtents) {
            delete scale.boundsMargin;
        }
        setValueAxis('scale', scale);
    }, [axisScale, setValueAxis]);
    const onSetYExtentsChange = react_1.useCallback((paramName, value) => {
        const scale = { ...axisScale, [paramName]: value };
        if (!scale.setYExtents) {
            delete scale.min;
            delete scale.max;
        }
        setValueAxis('scale', scale);
    }, [axisScale, setValueAxis]);
    react_1.useEffect(() => {
        setMultipleValidity('boundsMargin', isBoundsMarginValid);
        return () => setMultipleValidity('boundsMargin', true);
    }, [isBoundsMarginValid, setMultipleValidity]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.scaleToDataBoundsLabel', {
                defaultMessage: 'Scale to data bounds',
            }), paramName: "defaultYExtents", value: axisScale.defaultYExtents, setValue: onDefaultYExtentsChange }),
        axisScale.defaultYExtents && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(public_1.NumberInputOption, { error: !isBoundsMarginValid && invalidBoundsMarginMessage, isInvalid: !isBoundsMarginValid, label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.scaleToDataBounds.boundsMargin', {
                    defaultMessage: 'Bounds margin',
                }), step: 0.1, min: 0, paramName: "boundsMargin", value: axisScale.boundsMargin, setValue: setBoundsMargin }))),
        react_1.default.createElement(public_1.SwitchOption, { "data-test-subj": "yAxisSetYExtents", label: i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.valueAxes.setAxisExtentsLabel', {
                defaultMessage: 'Set axis extents',
            }), paramName: "setYExtents", value: axisScale.setYExtents, setValue: onSetYExtentsChange }),
        axisScale.setYExtents && (react_1.default.createElement(y_extents_1.YExtents, { scale: axisScale, setScale: setValueAxisScale, setMultipleValidity: setMultipleValidity }))));
}
exports.CustomExtentsOptions = CustomExtentsOptions;
