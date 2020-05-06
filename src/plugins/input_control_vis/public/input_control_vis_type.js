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
const vis_controller_1 = require("./vis_controller");
const controls_tab_1 = require("./components/editor/controls_tab");
const options_tab_1 = require("./components/editor/options_tab");
const public_1 = require("../../kibana_utils/public");
function createInputControlVisTypeDefinition(deps) {
    const InputControlVisController = vis_controller_1.createInputControlVisController(deps);
    const ControlsTab = controls_tab_1.getControlsTab(deps);
    return {
        name: 'input_control_vis',
        title: i18n_1.i18n.translate('inputControl.register.controlsTitle', {
            defaultMessage: 'Controls',
        }),
        icon: 'controlsHorizontal',
        description: i18n_1.i18n.translate('inputControl.register.controlsDescription', {
            defaultMessage: 'Create interactive controls for easy dashboard manipulation.',
        }),
        stage: 'experimental',
        feedbackMessage: public_1.defaultFeedbackMessage,
        visualization: InputControlVisController,
        visConfig: {
            defaults: {
                controls: [],
                updateFiltersOnChange: false,
                useTimeFilter: false,
                pinFilters: false,
            },
        },
        editorConfig: {
            optionTabs: [
                {
                    name: 'controls',
                    title: i18n_1.i18n.translate('inputControl.register.tabs.controlsTitle', {
                        defaultMessage: 'Controls',
                    }),
                    editor: ControlsTab,
                },
                {
                    name: 'options',
                    title: i18n_1.i18n.translate('inputControl.register.tabs.optionsTitle', {
                        defaultMessage: 'Options',
                    }),
                    editor: options_tab_1.OptionsTab,
                },
            ],
        },
        requestHandler: 'none',
        responseHandler: 'none',
    };
}
exports.createInputControlVisTypeDefinition = createInputControlVisTypeDefinition;
