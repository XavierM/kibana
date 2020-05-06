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
// @ts-ignore
const services_1 = require("@elastic/eui/lib/services");
const public_1 = require("../../data/public");
const public_2 = require("../../vis_default_editor/public");
const collections_1 = require("./utils/collections");
const common_config_1 = require("./utils/common_config");
const vis_controller_1 = require("./vis_controller");
const public_3 = require("../../charts/public");
exports.createAreaVisTypeDefinition = (deps) => ({
    name: 'area',
    title: i18n_1.i18n.translate('visTypeVislib.area.areaTitle', { defaultMessage: 'Area' }),
    icon: 'visArea',
    description: i18n_1.i18n.translate('visTypeVislib.area.areaDescription', {
        defaultMessage: 'Emphasize the quantity beneath a line chart',
    }),
    visualization: vis_controller_1.createVislibVisController(deps),
    visConfig: {
        defaults: {
            type: 'area',
            grid: {
                categoryLines: false,
            },
            categoryAxes: [
                {
                    id: 'CategoryAxis-1',
                    type: collections_1.AxisTypes.CATEGORY,
                    position: collections_1.Positions.BOTTOM,
                    show: true,
                    style: {},
                    scale: {
                        type: collections_1.ScaleTypes.LINEAR,
                    },
                    labels: {
                        show: true,
                        filter: true,
                        truncate: 100,
                    },
                    title: {},
                },
            ],
            valueAxes: [
                {
                    id: 'ValueAxis-1',
                    name: 'LeftAxis-1',
                    type: collections_1.AxisTypes.VALUE,
                    position: collections_1.Positions.LEFT,
                    show: true,
                    style: {},
                    scale: {
                        type: collections_1.ScaleTypes.LINEAR,
                        mode: collections_1.AxisModes.NORMAL,
                    },
                    labels: {
                        show: true,
                        rotate: public_3.Rotates.HORIZONTAL,
                        filter: false,
                        truncate: 100,
                    },
                    title: {
                        text: common_config_1.countLabel,
                    },
                },
            ],
            seriesParams: [
                {
                    show: true,
                    type: collections_1.ChartTypes.AREA,
                    mode: collections_1.ChartModes.STACKED,
                    data: {
                        label: common_config_1.countLabel,
                        id: '1',
                    },
                    drawLinesBetweenPoints: true,
                    lineWidth: 2,
                    showCircles: true,
                    interpolate: collections_1.InterpolationModes.LINEAR,
                    valueAxis: 'ValueAxis-1',
                },
            ],
            addTooltip: true,
            addLegend: true,
            legendPosition: collections_1.Positions.RIGHT,
            times: [],
            addTimeMarker: false,
            thresholdLine: {
                show: false,
                value: 10,
                width: 1,
                style: collections_1.ThresholdLineStyles.FULL,
                color: services_1.euiPaletteColorBlind()[9],
            },
            labels: {},
        },
    },
    events: {
        brush: { disabled: false },
    },
    editorConfig: {
        collections: collections_1.getConfigCollections(),
        optionTabs: common_config_1.getAreaOptionTabs(),
        schemas: new public_2.Schemas([
            {
                group: public_1.AggGroupNames.Metrics,
                name: 'metric',
                title: i18n_1.i18n.translate('visTypeVislib.area.metricsTitle', {
                    defaultMessage: 'Y-axis',
                }),
                aggFilter: ['!geo_centroid', '!geo_bounds'],
                min: 1,
                defaults: [{ schema: 'metric', type: 'count' }],
            },
            {
                group: public_1.AggGroupNames.Metrics,
                name: 'radius',
                title: i18n_1.i18n.translate('visTypeVislib.area.radiusTitle', {
                    defaultMessage: 'Dot size',
                }),
                min: 0,
                max: 1,
                aggFilter: ['count', 'avg', 'sum', 'min', 'max', 'cardinality'],
            },
            {
                group: public_1.AggGroupNames.Buckets,
                name: 'segment',
                title: i18n_1.i18n.translate('visTypeVislib.area.segmentTitle', {
                    defaultMessage: 'X-axis',
                }),
                min: 0,
                max: 1,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
            {
                group: public_1.AggGroupNames.Buckets,
                name: 'group',
                title: i18n_1.i18n.translate('visTypeVislib.area.groupTitle', {
                    defaultMessage: 'Split series',
                }),
                min: 0,
                max: 3,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
            {
                group: public_1.AggGroupNames.Buckets,
                name: 'split',
                title: i18n_1.i18n.translate('visTypeVislib.area.splitTitle', {
                    defaultMessage: 'Split chart',
                }),
                min: 0,
                max: 1,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
        ]),
    },
});
