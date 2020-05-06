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
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
function IndexPatternSelectFormRowUi(props) {
    const { controlIndex, indexPatternId, intl, onChange } = props;
    const selectId = `indexPatternSelect-${controlIndex}`;
    return (react_1.default.createElement(eui_1.EuiFormRow, { id: selectId, label: intl.formatMessage({
            id: 'inputControl.editor.indexPatternSelect.patternLabel',
            defaultMessage: 'Index Pattern',
        }) },
        react_1.default.createElement(props.IndexPatternSelect, { placeholder: intl.formatMessage({
                id: 'inputControl.editor.indexPatternSelect.patternPlaceholder',
                defaultMessage: 'Select index pattern...',
            }), indexPatternId: indexPatternId, onChange: onChange, "data-test-subj": selectId, 
            // TODO: supply actual savedObjectsClient here
            savedObjectsClient: {} })));
}
exports.IndexPatternSelectFormRow = react_2.injectI18n(IndexPatternSelectFormRowUi);
