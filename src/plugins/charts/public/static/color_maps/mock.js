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
const color_maps_1 = require("./color_maps");
const heatmap_color_1 = require("./heatmap_color");
const truncated_color_maps_1 = require("./truncated_color_maps");
// Note: Using actual values due to existing test dependencies
exports.colorMapsMock = {
    getHeatmapColors: jest.fn(heatmap_color_1.getHeatmapColors),
    vislibColorMaps: color_maps_1.vislibColorMaps,
    colorSchemas: color_maps_1.colorSchemas,
    truncatedColorMaps: truncated_color_maps_1.truncatedColorMaps,
    truncatedColorSchemas: truncated_color_maps_1.truncatedColorSchemas,
};
