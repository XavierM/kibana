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
const plugin_1 = require("./plugin");
// @ts-ignore
const colorUtil = tslib_1.__importStar(require("./map/color_util"));
exports.colorUtil = colorUtil;
// @ts-ignore
const kibana_map_1 = require("./map/kibana_map");
// @ts-ignore
const kibana_map_layer_1 = require("./map/kibana_map_layer");
exports.KibanaMapLayer = kibana_map_layer_1.KibanaMapLayer;
// @ts-ignore
const convert_to_geojson_1 = require("./map/convert_to_geojson");
exports.convertToGeoJson = convert_to_geojson_1.convertToGeoJson;
// @ts-ignore
const decode_geo_hash_1 = require("./map/decode_geo_hash");
exports.scaleBounds = decode_geo_hash_1.scaleBounds;
exports.getPrecision = decode_geo_hash_1.getPrecision;
exports.geoContains = decode_geo_hash_1.geoContains;
// @ts-ignore
const base_maps_visualization_1 = require("./map/base_maps_visualization");
// @ts-ignore
const tooltip_provider_1 = require("./tooltip_provider");
exports.mapTooltipProvider = tooltip_provider_1.mapTooltipProvider;
function plugin() {
    return new plugin_1.MapsLegacyPlugin();
}
exports.plugin = plugin;
// Due to a leaflet/leaflet-draw bug, it's not possible to consume leaflet maps w/ draw control
// through a pipeline leveraging angular. For this reason, client plugins need to
// init kibana map and the basemaps visualization directly rather than consume through
// the usual plugin interface
function getKibanaMapFactoryProvider(core) {
    plugin_1.bindSetupCoreAndPlugins(core);
    return (...args) => new kibana_map_1.KibanaMap(...args);
}
exports.getKibanaMapFactoryProvider = getKibanaMapFactoryProvider;
function getBaseMapsVis(core, serviceSettings) {
    const getKibanaMap = getKibanaMapFactoryProvider(core);
    return new base_maps_visualization_1.BaseMapsVisualizationProvider(getKibanaMap, serviceSettings);
}
exports.getBaseMapsVis = getBaseMapsVis;
tslib_1.__exportStar(require("./common/types"), exports);
var origin_1 = require("./common/constants/origin");
exports.ORIGIN = origin_1.ORIGIN;
var wms_options_1 = require("./components/wms_options");
exports.WmsOptions = wms_options_1.WmsOptions;
