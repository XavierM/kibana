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
const public_1 = require("../../../../../plugins/charts/public");
const public_2 = require("../../../../../plugins/maps_legacy/public");
const mapLayerForOption = ({ layerId, name }) => ({
    text: name,
    value: layerId,
});
const mapFieldForOption = ({ description, name }) => ({
    text: description,
    value: name,
});
function RegionMapOptions(props) {
    const { serviceSettings, stateParams, vis, setValue } = props;
    const { vectorLayers } = vis.type.editorConfig.collections;
    const vectorLayerOptions = react_1.useMemo(() => vectorLayers.map(mapLayerForOption), [vectorLayers]);
    const fieldOptions = react_1.useMemo(() => ((stateParams.selectedLayer && stateParams.selectedLayer.fields) || []).map(mapFieldForOption), [stateParams.selectedLayer]);
    const setEmsHotLink = react_1.useCallback(async (layer) => {
        const emsHotLink = await serviceSettings.getEMSHotLink(layer);
        setValue('emsHotLink', emsHotLink);
    }, [setValue, serviceSettings]);
    const setLayer = react_1.useCallback(async (paramName, value) => {
        const newLayer = vectorLayers.find(({ layerId }) => layerId === value);
        if (newLayer) {
            setValue(paramName, newLayer);
            setValue('selectedJoinField', newLayer.fields[0]);
            setEmsHotLink(newLayer);
        }
    }, [vectorLayers, setEmsHotLink, setValue]);
    const setField = react_1.useCallback((paramName, value) => {
        if (stateParams.selectedLayer) {
            setValue(paramName, stateParams.selectedLayer.fields.find(f => f.name === value));
        }
    }, [setValue, stateParams.selectedLayer]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h2", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "regionMap.visParams.layerSettingsTitle", defaultMessage: "Layer settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.SelectOption, { id: "regionMapOptionsSelectLayer", label: i18n_1.i18n.translate('regionMap.visParams.vectorMapLabel', {
                    defaultMessage: 'Vector map',
                }), labelAppend: stateParams.emsHotLink && (react_1.default.createElement(eui_1.EuiText, { size: "xs" },
                    react_1.default.createElement(eui_1.EuiLink, { href: stateParams.emsHotLink, target: "_blank", title: i18n_1.i18n.translate('regionMap.visParams.previewOnEMSLinkTitle', {
                            defaultMessage: 'Preview {selectedLayerName} on the Elastic Maps Service',
                            values: {
                                selectedLayerName: stateParams.selectedLayer && stateParams.selectedLayer.name,
                            },
                        }) },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "regionMap.visParams.previewOnEMSLinkText", defaultMessage: "Preview on EMS" }),
                        ' ',
                        react_1.default.createElement(eui_1.EuiIcon, { type: "popout", size: "s" })))), options: vectorLayerOptions, paramName: "selectedLayer", value: stateParams.selectedLayer && stateParams.selectedLayer.layerId, setValue: setLayer }),
            react_1.default.createElement(public_1.SelectOption, { id: "regionMapOptionsSelectJoinField", label: i18n_1.i18n.translate('regionMap.visParams.joinFieldLabel', {
                    defaultMessage: 'Join field',
                }), options: fieldOptions, paramName: "selectedJoinField", value: stateParams.selectedJoinField && stateParams.selectedJoinField.name, setValue: setField }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('regionMap.visParams.displayWarningsLabel', {
                    defaultMessage: 'Display warnings',
                }), tooltip: i18n_1.i18n.translate('regionMap.visParams.switchWarningsTipText', {
                    defaultMessage: 'Turns on/off warnings. When turned on, warning will be shown for each term that cannot be matched to a shape in the vector layer based on the join field. When turned off, these warnings will be turned off.',
                }), paramName: "isDisplayWarning", value: stateParams.isDisplayWarning, setValue: setValue }),
            react_1.default.createElement(public_1.SwitchOption, { label: i18n_1.i18n.translate('regionMap.visParams.showAllShapesLabel', {
                    defaultMessage: 'Show all shapes',
                }), tooltip: i18n_1.i18n.translate('regionMap.visParams.turnOffShowingAllShapesTipText', {
                    defaultMessage: 'Turning this off only shows the shapes that were matched with a corresponding term.',
                }), paramName: "showAllShapes", value: stateParams.showAllShapes, setValue: setValue })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
                react_1.default.createElement("h2", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "regionMap.visParams.styleSettingsLabel", defaultMessage: "Style settings" }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('regionMap.visParams.colorSchemaLabel', {
                    defaultMessage: 'Color schema',
                }), options: vis.type.editorConfig.collections.colorSchemas, paramName: "colorSchema", value: stateParams.colorSchema, setValue: setValue }),
            react_1.default.createElement(public_1.NumberInputOption, { label: i18n_1.i18n.translate('regionMap.visParams.outlineWeightLabel', {
                    defaultMessage: 'Border thickness',
                }), min: 0, paramName: "outlineWeight", value: stateParams.outlineWeight, setValue: setValue })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_2.WmsOptions, Object.assign({}, props))));
}
exports.RegionMapOptions = RegionMapOptions;
