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
const react_dom_1 = require("react-dom");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../kibana_utils/public");
const public_2 = require("../../kibana_react/public");
const default_editor_1 = require("./default_editor");
const sidebar_1 = require("./components/sidebar");
const localStorage = new public_1.Storage(window.localStorage);
class DefaultEditorController {
    constructor(el, vis, eventEmitter, embeddableHandler) {
        this.el = el;
        const { type: visType } = vis;
        const optionTabs = [
            ...(visType.schemas.buckets || visType.schemas.metrics
                ? [
                    {
                        name: 'data',
                        title: i18n_1.i18n.translate('visDefaultEditor.sidebar.tabs.dataLabel', {
                            defaultMessage: 'Data',
                        }),
                        editor: sidebar_1.DefaultEditorDataTab,
                    },
                ]
                : []),
            ...(!visType.editorConfig.optionTabs && visType.editorConfig.optionsTemplate
                ? [
                    {
                        name: 'options',
                        title: i18n_1.i18n.translate('visDefaultEditor.sidebar.tabs.optionsLabel', {
                            defaultMessage: 'Options',
                        }),
                        editor: visType.editorConfig.optionsTemplate,
                    },
                ]
                : visType.editorConfig.optionTabs),
        ];
        this.state = {
            vis,
            optionTabs,
            eventEmitter,
            embeddableHandler,
        };
    }
    render({ data, core, ...props }) {
        react_dom_1.render(react_1.default.createElement(core.i18n.Context, null,
            react_1.default.createElement(public_2.KibanaContextProvider, { services: {
                    appName: 'vis_default_editor',
                    storage: localStorage,
                    data,
                    ...core,
                } },
                react_1.default.createElement(default_editor_1.DefaultEditor, Object.assign({}, this.state, props)))), this.el);
    }
    destroy() {
        react_dom_1.unmountComponentAtNode(this.el);
    }
}
exports.DefaultEditorController = DefaultEditorController;
