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
const public_1 = require("../../data/public");
const public_2 = require("../../vis_default_editor/public");
const options_1 = require("./components/options");
const collections_1 = require("./utils/collections");
const vis_controller_1 = require("./vis_controller");
exports.createPieVisTypeDefinition = (deps) => ({
    name: 'pie',
    title: i18n_1.i18n.translate('visTypeVislib.pie.pieTitle', { defaultMessage: 'Pie' }),
    icon: 'visPie',
    description: i18n_1.i18n.translate('visTypeVislib.pie.pieDescription', {
        defaultMessage: 'Compare parts of a whole',
    }),
    visualization: vis_controller_1.createVislibVisController(deps),
    visConfig: {
        defaults: {
            type: 'pie',
            addTooltip: true,
            addLegend: true,
            legendPosition: collections_1.Positions.RIGHT,
            isDonut: true,
            labels: {
                show: false,
                values: true,
                last_level: true,
                truncate: 100,
            },
        },
    },
    editorConfig: {
        collections: {
            legendPositions: collections_1.getPositions(),
        },
        optionsTemplate: options_1.PieOptions,
        schemas: new public_2.Schemas([
            {
                group: public_1.AggGroupNames.Metrics,
                name: 'metric',
                title: i18n_1.i18n.translate('visTypeVislib.pie.metricTitle', {
                    defaultMessage: 'Slice size',
                }),
                min: 1,
                max: 1,
                aggFilter: ['sum', 'count', 'cardinality', 'top_hits'],
                defaults: [{ schema: 'metric', type: 'count' }],
            },
            {
                group: public_1.AggGroupNames.Buckets,
                name: 'segment',
                title: i18n_1.i18n.translate('visTypeVislib.pie.segmentTitle', {
                    defaultMessage: 'Split slices',
                }),
                min: 0,
                max: Infinity,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
            {
                group: public_1.AggGroupNames.Buckets,
                name: 'split',
                title: i18n_1.i18n.translate('visTypeVislib.pie.splitTitle', {
                    defaultMessage: 'Split chart',
                }),
                mustBeFirst: true,
                min: 0,
                max: 1,
                aggFilter: ['!geohash_grid', '!geotile_grid', '!filter'],
            },
        ]),
    },
    hierarchicalData: true,
    responseHandler: 'vislib_slices',
});
