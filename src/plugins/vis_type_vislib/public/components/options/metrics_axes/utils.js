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
const lodash_1 = require("lodash");
const collections_1 = require("../../../utils/collections");
const makeSerie = (id, label, defaultValueAxis, lastSerie) => {
    const data = { id, label };
    const defaultSerie = {
        show: true,
        mode: collections_1.ChartModes.NORMAL,
        type: collections_1.ChartTypes.LINE,
        drawLinesBetweenPoints: true,
        showCircles: true,
        interpolate: collections_1.InterpolationModes.LINEAR,
        lineWidth: 2,
        valueAxis: defaultValueAxis,
        data,
    };
    return lastSerie ? { ...lastSerie, data } : defaultSerie;
};
exports.makeSerie = makeSerie;
const isAxisHorizontal = (position) => [collections_1.Positions.TOP, collections_1.Positions.BOTTOM].includes(position);
exports.isAxisHorizontal = isAxisHorizontal;
const RADIX = 10;
function countNextAxisNumber(axisName, axisProp = 'id') {
    return (value, axis) => {
        const nameLength = axisName.length;
        if (axis[axisProp].substr(0, nameLength) === axisName) {
            const num = parseInt(axis[axisProp].substr(nameLength), RADIX);
            if (num >= value) {
                value = num + 1;
            }
        }
        return value;
    };
}
exports.countNextAxisNumber = countNextAxisNumber;
const AXIS_PREFIX = 'Axis-';
const getUpdatedAxisName = (axisPosition, valueAxes) => {
    const axisName = lodash_1.capitalize(axisPosition) + AXIS_PREFIX;
    const nextAxisNameNumber = valueAxes.reduce(countNextAxisNumber(axisName, 'name'), 1);
    return `${axisName}${nextAxisNameNumber}`;
};
exports.getUpdatedAxisName = getUpdatedAxisName;
function mapPositionOpposite(position) {
    switch (position) {
        case collections_1.Positions.BOTTOM:
            return collections_1.Positions.TOP;
        case collections_1.Positions.TOP:
            return collections_1.Positions.BOTTOM;
        case collections_1.Positions.LEFT:
            return collections_1.Positions.RIGHT;
        case collections_1.Positions.RIGHT:
            return collections_1.Positions.LEFT;
        default:
            throw new Error('Invalid legend position.');
    }
}
exports.mapPositionOpposite = mapPositionOpposite;
function mapPosition(position) {
    switch (position) {
        case collections_1.Positions.BOTTOM:
            return collections_1.Positions.LEFT;
        case collections_1.Positions.TOP:
            return collections_1.Positions.RIGHT;
        case collections_1.Positions.LEFT:
            return collections_1.Positions.BOTTOM;
        case collections_1.Positions.RIGHT:
            return collections_1.Positions.TOP;
    }
}
exports.mapPosition = mapPosition;
