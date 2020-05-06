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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const json_stringify_pretty_compact_1 = tslib_1.__importDefault(require("json-stringify-pretty-compact"));
// @ts-ignore
const hjson_1 = tslib_1.__importDefault(require("hjson"));
const i18n_1 = require("@kbn/i18n");
const services_1 = require("../services");
const vega_help_menu_1 = require("./vega_help_menu");
const vega_actions_menu_1 = require("./vega_actions_menu");
const aceOptions = {
    maxLines: Infinity,
    highlightActiveLine: false,
    showPrintMargin: false,
    tabSize: 2,
    useSoftTabs: true,
    wrap: true,
};
const hjsonStringifyOptions = {
    bracesSameLine: true,
    keepWsc: true,
};
function format(value, stringify, options) {
    try {
        const spec = hjson_1.default.parse(value, { legacyRoot: false, keepWsc: true });
        return stringify(spec, options);
    }
    catch (err) {
        // This is a common case - user tries to format an invalid HJSON text
        services_1.getNotifications().toasts.addError(err, {
            title: i18n_1.i18n.translate('visTypeVega.editor.formatError', {
                defaultMessage: 'Error formatting spec',
            }),
        });
        return value;
    }
}
function VegaVisEditor({ stateParams, setValue }) {
    const onChange = react_1.useCallback((value) => {
        setValue('spec', value);
    }, [setValue]);
    const formatJson = react_1.useCallback(() => setValue('spec', format(stateParams.spec, json_stringify_pretty_compact_1.default)), [setValue, stateParams.spec]);
    const formatHJson = react_1.useCallback(() => setValue('spec', format(stateParams.spec, hjson_1.default.stringify, hjsonStringifyOptions)), [setValue, stateParams.spec]);
    return (react_1.default.createElement("div", { className: "vgaEditor" },
        react_1.default.createElement(eui_1.EuiCodeEditor, { "data-test-subj": "vega-editor", mode: "hjson", theme: "textmate", width: "100%", height: "auto", onChange: onChange, value: stateParams.spec, setOptions: aceOptions }),
        react_1.default.createElement("div", { className: "vgaEditor__aceEditorActions" },
            react_1.default.createElement(vega_help_menu_1.VegaHelpMenu, null),
            react_1.default.createElement(vega_actions_menu_1.VegaActionsMenu, { formatHJson: formatHJson, formatJson: formatJson }))));
}
exports.VegaVisEditor = VegaVisEditor;
