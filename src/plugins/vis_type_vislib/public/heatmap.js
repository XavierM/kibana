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
const public_1 = require("../../vis_default_editor/public");
const public_2 = require("../../data/public");
const collections_1 = require("./utils/collections");
const options_1 = require("./components/options");
const vis_controller_1 = require("./vis_controller");
const public_3 = require("../../charts/public");
exports.createHeatmapVisTypeDefinition = (deps) => ({
    name: 'heatmap',
    title: i18n_1.i18n.translate('visTypeVislib.heatmap.heatmapTitle', { defaultMessage: 'Heat Map' }),
    icon: 'heatmap',
    description: i18n_1.i18n.translate('visTypeVislib.heatmap.heatmapDescription', {
        defaultMessage: 'Shade cells within a matrix',
    }),
    visualization: vis_controller_1.createVislibVisController(deps),
    visConfig: {
        defaults: {
            type: 'heatmap',
            addTooltip: true,
            addLegend: true,
            enableHover: false,
            legendPosition: collections_1.Positions.RIGHT,
            times: [],
            colorsNumber: 4,
            colorSchema: public_3.ColorSchemas.Greens,
            setColorRange: false,
            colorsRange: [],
            invertColors: false,
            percentageMode: false,
            valueAxes: [
                {
                    show: false,
                    id: 'ValueAxis-1',
                    type: collections_1.AxisTypes.VALUE,
                    scale: {
                        type: collections_1.ScaleTypes.LINEAR,
                        defaultYExtents: false,
                    },
                    labels: {
                        show: false,
                        rotate: 0,
                        overwriteColor: false,
                        color: 'black',
                    },
                },
            ],
        },
    },
    events: {
        brush: { disabled: false },
    },
    editorConfig: {
        collections: collections_1.getHeatmapCollections(),
        optionsTemplate: options_1.HeatmapOptions,
        schemas: new public_1.Schemas([
            {
                group: public_2.AggGroupNames.Metrics,
                name: 'metric',
                title: i18n_1.i18n.translate('visTypeVislib.heatmap.metricTitle', { defaultMessage: 'Value' }),
                min: 1,
                max: 1,
                aggFilter: [
                    'count',
                    'avg',
                    'median',
                    'sum',
                    'min',
                    'max',
                    'cardinality',
                    'std_dev',
                    'top_hits',
                ],
                defaults: [{ schema: 'metric', type: 'count' }],
            },
            {
                group: public_2.AggGroupNames.Buckets,
                name: 'segment',
                title: i18n_1.i18n.translate('visTypeVislib.heatmap.segmentTitle', {
                    defaultMessage: 'X-axis',
                }),
                min: 0,
                max: 1,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
            {
                group: public_2.AggGroupNames.Buckets,
                name: 'group',
                title: i18n_1.i18n.translate('visTypeVislib.heatmap.groupTitle', { defaultMessage: 'Y-axis' }),
                min: 0,
                max: 1,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
            {
                group: public_2.AggGroupNames.Buckets,
                name: 'split',
                title: i18n_1.i18n.translate('visTypeVislib.heatmap.splitTitle', {
                    defaultMessage: 'Split chart',
                }),
                min: 0,
                max: 1,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
        ]),
    },
});
