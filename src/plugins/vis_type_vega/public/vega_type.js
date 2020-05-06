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
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../vis_default_editor/public");
const components_1 = require("./components");
const public_2 = require("../../kibana_utils/public");
const vega_request_handler_1 = require("./vega_request_handler");
// @ts-ignore
const vega_visualization_1 = require("./vega_visualization");
// @ts-ignore
const default_spec_hjson_1 = tslib_1.__importDefault(require("!!raw-loader!./default.spec.hjson"));
exports.createVegaTypeDefinition = (dependencies) => {
    const requestHandler = vega_request_handler_1.createVegaRequestHandler(dependencies);
    const visualization = vega_visualization_1.createVegaVisualization(dependencies);
    return {
        name: 'vega',
        title: 'Vega',
        description: i18n_1.i18n.translate('visTypeVega.type.vegaDescription', {
            defaultMessage: 'Create custom visualizations using Vega and Vega-Lite',
            description: 'Vega and Vega-Lite are product names and should not be translated',
        }),
        icon: 'visVega',
        visConfig: { defaults: { spec: default_spec_hjson_1.default } },
        editorConfig: {
            optionsTemplate: components_1.VegaVisEditor,
            enableAutoApply: true,
            defaultSize: public_1.DefaultEditorSize.MEDIUM,
        },
        visualization,
        requestHandler,
        responseHandler: 'none',
        options: {
            showIndexSelection: false,
            showQueryBar: true,
            showFilterBar: true,
        },
        stage: 'experimental',
        feedbackMessage: public_2.defaultFeedbackMessage,
    };
};
