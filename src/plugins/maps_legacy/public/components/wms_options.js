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
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../charts/public");
const wms_internal_options_1 = require("./wms_internal_options");
const mapLayerForOption = ({ id }) => ({ text: id, value: id });
function WmsOptions({ stateParams, setValue, vis }) {
    const { wms } = stateParams;
    const { tmsLayers } = vis.type.editorConfig.collections;
    const tmsLayerOptions = react_1.useMemo(() => tmsLayers.map(mapLayerForOption), [tmsLayers]);
    const setWmsOption = (paramName, value) => setValue('wms', {
        ...wms,
        [paramName]: value,
    });
    const selectTmsLayer = (id) => {
        const layer = tmsLayers.find((l) => l.id === id);
        if (layer) {
            setWmsOption('selectedTmsLayer', layer);
        }
    };
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h2", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.baseLayerSettingsTitle", defaultMessage: "Base layer settings" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('maps_legacy.wmsOptions.wmsMapServerLabel', {
                defaultMessage: 'WMS map server',
            }), tooltip: i18n_1.i18n.translate('maps_legacy.wmsOptions.useWMSCompliantMapTileServerTip', {
                defaultMessage: 'Use WMS compliant map tile server. For advanced users only.',
            }), paramName: "enabled", value: wms.enabled, setValue: setWmsOption }),
        !wms.enabled && (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.SelectOption, { id: "wmsOptionsSelectTmsLayer", label: i18n_1.i18n.translate('maps_legacy.wmsOptions.layersLabel', {
                    defaultMessage: 'Layers',
                }), options: tmsLayerOptions, paramName: "selectedTmsLayer", value: wms.selectedTmsLayer && wms.selectedTmsLayer.id, setValue: (param, value) => selectTmsLayer(value) }))),
        wms.enabled && react_1.default.createElement(wms_internal_options_1.WmsInternalOptions, { wms: wms, setValue: setWmsOption })));
}
exports.WmsOptions = WmsOptions;
