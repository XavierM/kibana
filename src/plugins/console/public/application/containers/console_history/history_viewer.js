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
const i18n_1 = require("@kbn/i18n");
const subscribe_console_resize_checker_1 = require("../editor/legacy/subscribe_console_resize_checker");
// @ts-ignore
const InputMode = tslib_1.__importStar(require("../../models/legacy_core_editor/mode/input"));
const inputMode = new InputMode.Mode();
const editor = tslib_1.__importStar(require("../../models/legacy_core_editor"));
const apply_editor_settings_1 = require("../editor/legacy/console_editor/apply_editor_settings");
function HistoryViewer({ settings, req }) {
    const divRef = react_1.useRef(null);
    const viewerRef = react_1.useRef(null);
    react_1.useEffect(() => {
        const viewer = editor.createReadOnlyAceEditor(divRef.current);
        viewerRef.current = viewer;
        const unsubscribe = subscribe_console_resize_checker_1.subscribeResizeChecker(divRef.current, viewer);
        return () => unsubscribe();
    }, []);
    react_1.useEffect(() => {
        apply_editor_settings_1.applyCurrentSettings(viewerRef.current, settings);
    }, [settings]);
    if (viewerRef.current) {
        const { current: viewer } = viewerRef;
        if (req) {
            const s = req.method + ' ' + req.endpoint + '\n' + (req.data || '');
            viewer.update(s, inputMode);
            viewer.clearSelection();
        }
        else {
            viewer.update(i18n_1.i18n.translate('console.historyPage.noHistoryTextMessage', {
                defaultMessage: 'No history available',
            }), inputMode);
        }
    }
    return react_1.default.createElement("div", { className: "conHistory__viewer", ref: divRef });
}
exports.HistoryViewer = HistoryViewer;
