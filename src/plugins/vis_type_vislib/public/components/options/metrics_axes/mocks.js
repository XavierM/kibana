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
const collections_1 = require("../../../utils/collections");
const defaultValueAxisId = 'ValueAxis-1';
exports.defaultValueAxisId = defaultValueAxisId;
const axis = {
    show: true,
    style: {},
    title: {
        text: '',
    },
    labels: {
        show: true,
        filter: true,
        truncate: 0,
        color: 'black',
    },
};
const categoryAxis = {
    ...axis,
    id: 'CategoryAxis-1',
    type: collections_1.AxisTypes.CATEGORY,
    position: collections_1.Positions.BOTTOM,
    scale: {
        type: collections_1.ScaleTypes.LINEAR,
    },
};
exports.categoryAxis = categoryAxis;
const valueAxis = {
    ...axis,
    id: defaultValueAxisId,
    name: 'ValueAxis-1',
    type: collections_1.AxisTypes.VALUE,
    position: collections_1.Positions.LEFT,
    scale: {
        type: collections_1.ScaleTypes.LINEAR,
        boundsMargin: 1,
        defaultYExtents: true,
        min: 1,
        max: 2,
        setYExtents: true,
    },
};
exports.valueAxis = valueAxis;
const seriesParam = {
    show: true,
    type: collections_1.ChartTypes.HISTOGRAM,
    mode: collections_1.ChartModes.STACKED,
    data: {
        label: 'Count',
        id: '1',
    },
    drawLinesBetweenPoints: true,
    lineWidth: 2,
    showCircles: true,
    interpolate: collections_1.InterpolationModes.LINEAR,
    valueAxis: defaultValueAxisId,
};
exports.seriesParam = seriesParam;
const positions = collections_1.getPositions();
const axisModes = collections_1.getAxisModes();
const scaleTypes = collections_1.getScaleTypes();
const interpolationModes = collections_1.getInterpolationModes();
const vis = {
    type: {
        editorConfig: {
            collections: { scaleTypes, axisModes, positions, interpolationModes },
        },
    },
};
exports.vis = vis;
