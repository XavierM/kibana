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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../kibana_react/public");
const public_2 = require("../../../charts/public");
function TagCloudOptions({ stateParams, setValue, vis }) {
    const handleFontSizeChange = ([minFontSize, maxFontSize]) => {
        setValue('minFontSize', Number(minFontSize));
        setValue('maxFontSize', Number(maxFontSize));
    };
    const fontSizeRangeLabel = i18n_1.i18n.translate('visTypeTagCloud.visParams.fontSizeLabel', {
        defaultMessage: 'Font size range in pixels',
    });
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(public_2.SelectOption, { label: i18n_1.i18n.translate('visTypeTagCloud.visParams.textScaleLabel', {
                defaultMessage: 'Text scale',
            }), options: vis.type.editorConfig.collections.scales, paramName: "scale", value: stateParams.scale, setValue: setValue }),
        react_1.default.createElement(public_2.SelectOption, { label: i18n_1.i18n.translate('visTypeTagCloud.visParams.orientationsLabel', {
                defaultMessage: 'Orientations',
            }), options: vis.type.editorConfig.collections.orientations, paramName: "orientation", value: stateParams.orientation, setValue: setValue }),
        react_1.default.createElement(public_1.ValidatedDualRange, { allowEmptyRange: false, "aria-label": fontSizeRangeLabel, compressed: true, fullWidth: true, label: fontSizeRangeLabel, max: 100, min: 1, value: [stateParams.minFontSize, stateParams.maxFontSize], onChange: handleFontSizeChange, showInput: true }),
        react_1.default.createElement(public_2.SwitchOption, { label: i18n_1.i18n.translate('visTypeTagCloud.visParams.showLabelToggleLabel', {
                defaultMessage: 'Show label',
            }), paramName: "showLabel", value: stateParams.showLabel, setValue: setValue })));
}
exports.TagCloudOptions = TagCloudOptions;
