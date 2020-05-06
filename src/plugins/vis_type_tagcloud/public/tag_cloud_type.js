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
const tag_cloud_options_1 = require("./components/tag_cloud_options");
// @ts-ignore
const tag_cloud_visualization_1 = require("./components/tag_cloud_visualization");
exports.createTagCloudVisTypeDefinition = (deps) => ({
    name: 'tagcloud',
    title: i18n_1.i18n.translate('visTypeTagCloud.vis.tagCloudTitle', { defaultMessage: 'Tag Cloud' }),
    icon: 'visTagCloud',
    description: i18n_1.i18n.translate('visTypeTagCloud.vis.tagCloudDescription', {
        defaultMessage: 'A group of words, sized according to their importance',
    }),
    visConfig: {
        defaults: {
            scale: 'linear',
            orientation: 'single',
            minFontSize: 18,
            maxFontSize: 72,
            showLabel: true,
        },
    },
    visualization: tag_cloud_visualization_1.createTagCloudVisualization(deps),
    editorConfig: {
        collections: {
            scales: [
                {
                    text: i18n_1.i18n.translate('visTypeTagCloud.vis.editorConfig.scales.linearText', {
                        defaultMessage: 'Linear',
                    }),
                    value: 'linear',
                },
                {
                    text: i18n_1.i18n.translate('visTypeTagCloud.vis.editorConfig.scales.logText', {
                        defaultMessage: 'Log',
                    }),
                    value: 'log',
                },
                {
                    text: i18n_1.i18n.translate('visTypeTagCloud.vis.editorConfig.scales.squareRootText', {
                        defaultMessage: 'Square root',
                    }),
                    value: 'square root',
                },
            ],
            orientations: [
                {
                    text: i18n_1.i18n.translate('visTypeTagCloud.vis.editorConfig.orientations.singleText', {
                        defaultMessage: 'Single',
                    }),
                    value: 'single',
                },
                {
                    text: i18n_1.i18n.translate('visTypeTagCloud.vis.editorConfig.orientations.rightAngledText', {
                        defaultMessage: 'Right angled',
                    }),
                    value: 'right angled',
                },
                {
                    text: i18n_1.i18n.translate('visTypeTagCloud.vis.editorConfig.orientations.multipleText', {
                        defaultMessage: 'Multiple',
                    }),
                    value: 'multiple',
                },
            ],
        },
        optionsTemplate: tag_cloud_options_1.TagCloudOptions,
        schemas: new public_1.Schemas([
            {
                group: 'metrics',
                name: 'metric',
                title: i18n_1.i18n.translate('visTypeTagCloud.vis.schemas.metricTitle', {
                    defaultMessage: 'Tag size',
                }),
                min: 1,
                max: 1,
                aggFilter: [
                    '!std_dev',
                    '!percentiles',
                    '!percentile_ranks',
                    '!derivative',
                    '!geo_bounds',
                    '!geo_centroid',
                ],
                defaults: [{ schema: 'metric', type: 'count' }],
            },
            {
                group: 'buckets',
                name: 'segment',
                title: i18n_1.i18n.translate('visTypeTagCloud.vis.schemas.segmentTitle', {
                    defaultMessage: 'Tags',
                }),
                min: 1,
                max: 1,
                aggFilter: ['terms', 'significant_terms'],
            },
        ]),
    },
    useCustomNoDataScreen: true,
});
