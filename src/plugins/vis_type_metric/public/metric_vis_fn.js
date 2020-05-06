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
const types_1 = require("./types");
const public_1 = require("../../charts/public");
exports.createMetricVisFn = () => ({
    name: 'metricVis',
    type: 'render',
    inputTypes: ['kibana_datatable'],
    help: i18n_1.i18n.translate('visTypeMetric.function.help', {
        defaultMessage: 'Metric visualization',
    }),
    args: {
        percentageMode: {
            types: ['boolean'],
            default: false,
            help: i18n_1.i18n.translate('visTypeMetric.function.percentageMode.help', {
                defaultMessage: 'Shows metric in percentage mode. Requires colorRange to be set.',
            }),
        },
        colorSchema: {
            types: ['string'],
            default: '"Green to Red"',
            options: Object.values(public_1.vislibColorMaps).map((value) => value.id),
            help: i18n_1.i18n.translate('visTypeMetric.function.colorSchema.help', {
                defaultMessage: 'Color schema to use',
            }),
        },
        colorMode: {
            types: ['string'],
            default: '"None"',
            options: [public_1.ColorModes.NONE, public_1.ColorModes.LABELS, public_1.ColorModes.BACKGROUND],
            help: i18n_1.i18n.translate('visTypeMetric.function.colorMode.help', {
                defaultMessage: 'Which part of metric to color',
            }),
        },
        colorRange: {
            types: ['range'],
            multi: true,
            default: '{range from=0 to=10000}',
            help: i18n_1.i18n.translate('visTypeMetric.function.colorRange.help', {
                defaultMessage: 'A range object specifying groups of values to which different colors should be applied.',
            }),
        },
        useRanges: {
            types: ['boolean'],
            default: false,
            help: i18n_1.i18n.translate('visTypeMetric.function.useRanges.help', {
                defaultMessage: 'Enabled color ranges.',
            }),
        },
        invertColors: {
            types: ['boolean'],
            default: false,
            help: i18n_1.i18n.translate('visTypeMetric.function.invertColors.help', {
                defaultMessage: 'Inverts the color ranges',
            }),
        },
        showLabels: {
            types: ['boolean'],
            default: true,
            help: i18n_1.i18n.translate('visTypeMetric.function.showLabels.help', {
                defaultMessage: 'Shows labels under the metric values.',
            }),
        },
        bgFill: {
            types: ['string'],
            default: '"#000"',
            aliases: ['backgroundFill', 'bgColor', 'backgroundColor'],
            help: i18n_1.i18n.translate('visTypeMetric.function.bgFill.help', {
                defaultMessage: 'Color as html hex code (#123456), html color (red, blue) or rgba value (rgba(255,255,255,1)).',
            }),
        },
        font: {
            types: ['style'],
            help: i18n_1.i18n.translate('visTypeMetric.function.font.help', {
                defaultMessage: 'Font settings.',
            }),
            default: '{font size=60}',
        },
        subText: {
            types: ['string'],
            aliases: ['label', 'text', 'description'],
            default: '""',
            help: i18n_1.i18n.translate('visTypeMetric.function.subText.help', {
                defaultMessage: 'Custom text to show under the metric',
            }),
        },
        metric: {
            types: ['vis_dimension'],
            help: i18n_1.i18n.translate('visTypeMetric.function.metric.help', {
                defaultMessage: 'metric dimension configuration',
            }),
            required: true,
            multi: true,
        },
        bucket: {
            types: ['vis_dimension'],
            help: i18n_1.i18n.translate('visTypeMetric.function.bucket.help', {
                defaultMessage: 'bucket dimension configuration',
            }),
        },
    },
    fn(input, args) {
        const dimensions = {
            metrics: args.metric,
        };
        if (args.bucket) {
            dimensions.bucket = args.bucket;
        }
        if (args.percentageMode && (!args.colorRange || args.colorRange.length === 0)) {
            throw new Error('colorRange must be provided when using percentageMode');
        }
        const fontSize = Number.parseInt(args.font.spec.fontSize || '', 10);
        return {
            type: 'render',
            as: 'visualization',
            value: {
                visData: input,
                visType: types_1.visType,
                visConfig: {
                    metric: {
                        percentageMode: args.percentageMode,
                        useRanges: args.useRanges,
                        colorSchema: args.colorSchema,
                        metricColorMode: args.colorMode,
                        colorsRange: args.colorRange,
                        labels: {
                            show: args.showLabels,
                        },
                        invertColors: args.invertColors,
                        style: {
                            bgFill: args.bgFill,
                            bgColor: args.colorMode === public_1.ColorModes.BACKGROUND,
                            labelColor: args.colorMode === public_1.ColorModes.LABELS,
                            subText: args.subText,
                            fontSize,
                        },
                    },
                    dimensions,
                },
                params: {
                    listenOnChange: true,
                },
            },
        };
    },
});
