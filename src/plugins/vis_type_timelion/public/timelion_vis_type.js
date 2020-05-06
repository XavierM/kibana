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
const react_1 = tslib_1.__importDefault(require("react"));
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../kibana_react/public");
const public_2 = require("../../vis_default_editor/public");
const timelion_request_handler_1 = require("./helpers/timelion_request_handler");
const components_1 = require("./components");
const timelion_options_1 = require("./timelion_options");
exports.TIMELION_VIS_NAME = 'timelion';
function getTimelionVisDefinition(dependencies) {
    const timelionRequestHandler = timelion_request_handler_1.getTimelionRequestHandler(dependencies);
    // return the visType object, which kibana will use to display and configure new
    // Vis object of this type.
    return {
        name: exports.TIMELION_VIS_NAME,
        title: 'Timelion',
        icon: 'visTimelion',
        description: i18n_1.i18n.translate('timelion.timelionDescription', {
            defaultMessage: 'Build time-series using functional expressions',
        }),
        visConfig: {
            defaults: {
                expression: '.es(*)',
                interval: 'auto',
            },
            component: (props) => (react_1.default.createElement(public_1.KibanaContextProvider, { services: { ...dependencies } },
                react_1.default.createElement(components_1.TimelionVisComponent, Object.assign({}, props)))),
        },
        editorConfig: {
            optionsTemplate: (props) => (react_1.default.createElement(public_1.KibanaContextProvider, { services: { ...dependencies } },
                react_1.default.createElement(timelion_options_1.TimelionOptions, Object.assign({}, props)))),
            defaultSize: public_2.DefaultEditorSize.MEDIUM,
        },
        requestHandler: timelionRequestHandler,
        responseHandler: 'none',
        options: {
            showIndexSelection: false,
            showQueryBar: false,
            showFilterBar: false,
        },
    };
}
exports.getTimelionVisDefinition = getTimelionVisDefinition;
