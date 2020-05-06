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
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../../charts/public");
exports.Positions = Object.freeze({
    RIGHT: 'right',
    LEFT: 'left',
    TOP: 'top',
    BOTTOM: 'bottom',
});
const getPositions = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.legendPositions.topText', {
            defaultMessage: 'Top',
        }),
        value: exports.Positions.TOP,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.legendPositions.leftText', {
            defaultMessage: 'Left',
        }),
        value: exports.Positions.LEFT,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.legendPositions.rightText', {
            defaultMessage: 'Right',
        }),
        value: exports.Positions.RIGHT,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.legendPositions.bottomText', {
            defaultMessage: 'Bottom',
        }),
        value: exports.Positions.BOTTOM,
    },
];
exports.getPositions = getPositions;
exports.ChartTypes = Object.freeze({
    LINE: 'line',
    AREA: 'area',
    HISTOGRAM: 'histogram',
});
const getChartTypes = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.chartTypes.lineText', {
            defaultMessage: 'Line',
        }),
        value: exports.ChartTypes.LINE,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.chartTypes.areaText', {
            defaultMessage: 'Area',
        }),
        value: exports.ChartTypes.AREA,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.chartTypes.barText', {
            defaultMessage: 'Bar',
        }),
        value: exports.ChartTypes.HISTOGRAM,
    },
];
exports.getChartTypes = getChartTypes;
exports.ChartModes = Object.freeze({
    NORMAL: 'normal',
    STACKED: 'stacked',
});
const getChartModes = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.chartModes.normalText', {
            defaultMessage: 'Normal',
        }),
        value: exports.ChartModes.NORMAL,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.chartModes.stackedText', {
            defaultMessage: 'Stacked',
        }),
        value: exports.ChartModes.STACKED,
    },
];
exports.getChartModes = getChartModes;
exports.InterpolationModes = Object.freeze({
    LINEAR: 'linear',
    CARDINAL: 'cardinal',
    STEP_AFTER: 'step-after',
});
const getInterpolationModes = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.interpolationModes.straightText', {
            defaultMessage: 'Straight',
        }),
        value: exports.InterpolationModes.LINEAR,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.interpolationModes.smoothedText', {
            defaultMessage: 'Smoothed',
        }),
        value: exports.InterpolationModes.CARDINAL,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.interpolationModes.steppedText', {
            defaultMessage: 'Stepped',
        }),
        value: exports.InterpolationModes.STEP_AFTER,
    },
];
exports.getInterpolationModes = getInterpolationModes;
exports.AxisTypes = Object.freeze({
    CATEGORY: 'category',
    VALUE: 'value',
});
exports.ScaleTypes = Object.freeze({
    LINEAR: 'linear',
    LOG: 'log',
    SQUARE_ROOT: 'square root',
});
const getScaleTypes = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.scaleTypes.linearText', {
            defaultMessage: 'Linear',
        }),
        value: exports.ScaleTypes.LINEAR,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.scaleTypes.logText', {
            defaultMessage: 'Log',
        }),
        value: exports.ScaleTypes.LOG,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.scaleTypes.squareRootText', {
            defaultMessage: 'Square root',
        }),
        value: exports.ScaleTypes.SQUARE_ROOT,
    },
];
exports.getScaleTypes = getScaleTypes;
exports.AxisModes = Object.freeze({
    NORMAL: 'normal',
    PERCENTAGE: 'percentage',
    WIGGLE: 'wiggle',
    SILHOUETTE: 'silhouette',
});
const getAxisModes = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.axisModes.normalText', {
            defaultMessage: 'Normal',
        }),
        value: exports.AxisModes.NORMAL,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.axisModes.percentageText', {
            defaultMessage: 'Percentage',
        }),
        value: exports.AxisModes.PERCENTAGE,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.axisModes.wiggleText', {
            defaultMessage: 'Wiggle',
        }),
        value: exports.AxisModes.WIGGLE,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.axisModes.silhouetteText', {
            defaultMessage: 'Silhouette',
        }),
        value: exports.AxisModes.SILHOUETTE,
    },
];
exports.getAxisModes = getAxisModes;
exports.ThresholdLineStyles = Object.freeze({
    FULL: 'full',
    DASHED: 'dashed',
    DOT_DASHED: 'dot-dashed',
});
const getThresholdLineStyles = () => [
    {
        value: exports.ThresholdLineStyles.FULL,
        text: i18n_1.i18n.translate('visTypeVislib.thresholdLine.style.fullText', {
            defaultMessage: 'Full',
        }),
    },
    {
        value: exports.ThresholdLineStyles.DASHED,
        text: i18n_1.i18n.translate('visTypeVislib.thresholdLine.style.dashedText', {
            defaultMessage: 'Dashed',
        }),
    },
    {
        value: exports.ThresholdLineStyles.DOT_DASHED,
        text: i18n_1.i18n.translate('visTypeVislib.thresholdLine.style.dotdashedText', {
            defaultMessage: 'Dot-dashed',
        }),
    },
];
const getRotateOptions = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.categoryAxis.rotate.horizontalText', {
            defaultMessage: 'Horizontal',
        }),
        value: public_1.Rotates.HORIZONTAL,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.categoryAxis.rotate.verticalText', {
            defaultMessage: 'Vertical',
        }),
        value: public_1.Rotates.VERTICAL,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.categoryAxis.rotate.angledText', {
            defaultMessage: 'Angled',
        }),
        value: public_1.Rotates.ANGLED,
    },
];
exports.getRotateOptions = getRotateOptions;
exports.GaugeTypes = Object.freeze({
    ARC: 'Arc',
    CIRCLE: 'Circle',
});
const getGaugeTypes = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.gauge.gaugeTypes.arcText', {
            defaultMessage: 'Arc',
        }),
        value: exports.GaugeTypes.ARC,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.gauge.gaugeTypes.circleText', {
            defaultMessage: 'Circle',
        }),
        value: exports.GaugeTypes.CIRCLE,
    },
];
exports.Alignments = Object.freeze({
    AUTOMATIC: 'automatic',
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
});
const getAlignments = () => [
    {
        text: i18n_1.i18n.translate('visTypeVislib.gauge.alignmentAutomaticTitle', {
            defaultMessage: 'Automatic',
        }),
        value: exports.Alignments.AUTOMATIC,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.gauge.alignmentHorizontalTitle', {
            defaultMessage: 'Horizontal',
        }),
        value: exports.Alignments.HORIZONTAL,
    },
    {
        text: i18n_1.i18n.translate('visTypeVislib.gauge.alignmentVerticalTitle', {
            defaultMessage: 'Vertical',
        }),
        value: exports.Alignments.VERTICAL,
    },
];
const getConfigCollections = () => ({
    legendPositions: getPositions(),
    positions: getPositions(),
    chartTypes: getChartTypes(),
    axisModes: getAxisModes(),
    scaleTypes: getScaleTypes(),
    chartModes: getChartModes(),
    interpolationModes: getInterpolationModes(),
    thresholdLineStyles: getThresholdLineStyles(),
});
exports.getConfigCollections = getConfigCollections;
const getGaugeCollections = () => ({
    gaugeTypes: getGaugeTypes(),
    alignments: getAlignments(),
    colorSchemas: public_1.colorSchemas,
});
exports.getGaugeCollections = getGaugeCollections;
const getHeatmapCollections = () => ({
    legendPositions: getPositions(),
    scales: getScaleTypes(),
    colorSchemas: public_1.colorSchemas,
});
exports.getHeatmapCollections = getHeatmapCollections;
