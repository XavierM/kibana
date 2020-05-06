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
const public_1 = require("../../../../../plugins/charts/public");
const public_2 = require("../../../../../plugins/maps_legacy/public");
function TileMapOptions(props) {
    const { stateParams, setValue, vis } = props;
    react_1.useEffect(() => {
        if (!stateParams.mapType) {
            setValue('mapType', vis.type.editorConfig.collections.mapTypes[0]);
        }
    }, [setValue, stateParams.mapType, vis.type.editorConfig.collections.mapTypes]);
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
            react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('tileMap.visParams.mapTypeLabel', {
                    defaultMessage: 'Map type',
                }), options: vis.type.editorConfig.collections.mapTypes, paramName: "mapType", value: stateParams.mapType, setValue: setValue }),
            stateParams.mapType === public_2.MapTypes.Heatmap ? (react_1.default.createElement(public_1.RangeOption, { label: i18n_1.i18n.translate('tileMap.visParams.clusterSizeLabel', {
                    defaultMessage: 'Cluster size',
                }), max: 3, min: 1, paramName: "heatClusterSize", step: 0.1, value: stateParams.heatClusterSize, setValue: setValue })) : (react_1.default.createElement(public_1.SelectOption, { label: i18n_1.i18n.translate('tileMap.visParams.colorSchemaLabel', {
                    defaultMessage: 'Color schema',
                }), options: vis.type.editorConfig.collections.colorSchemas, paramName: "colorSchema", value: stateParams.colorSchema, setValue: setValue })),
            react_1.default.createElement(public_1.BasicOptions, Object.assign({}, props)),
            react_1.default.createElement(public_1.SwitchOption, { disabled: !vis.type.visConfig.canDesaturate, label: i18n_1.i18n.translate('tileMap.visParams.desaturateTilesLabel', {
                    defaultMessage: 'Desaturate tiles',
                }), tooltip: i18n_1.i18n.translate('tileMap.visParams.reduceVibrancyOfTileColorsTip', {
                    defaultMessage: 'Reduce the vibrancy of tile colors. This does not work in any version of Internet Explorer.',
                }), paramName: "isDesaturated", value: stateParams.isDesaturated, setValue: setValue })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(public_2.WmsOptions, Object.assign({}, props))));
}
exports.TileMapOptions = TileMapOptions;
