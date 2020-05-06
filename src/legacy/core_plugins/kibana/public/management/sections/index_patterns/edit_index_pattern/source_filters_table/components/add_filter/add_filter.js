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
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const sourcePlaceholder = i18n_1.i18n.translate('kbn.management.editIndexPattern.sourcePlaceholder', {
    defaultMessage: "source filter, accepts wildcards (e.g., `user*` to filter fields starting with 'user')",
});
exports.AddFilter = ({ onAddFilter }) => {
    const [filter, setFilter] = react_1.useState('');
    const onAddButtonClick = react_1.useCallback(() => {
        onAddFilter(filter);
        setFilter('');
    }, [filter, onAddFilter]);
    return (react_1.default.createElement(eui_1.EuiFlexGroup, null,
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: 10 },
            react_1.default.createElement(eui_1.EuiFieldText, { fullWidth: true, value: filter, onChange: e => setFilter(e.target.value.trim()), placeholder: sourcePlaceholder })),
        react_1.default.createElement(eui_1.EuiFlexItem, null,
            react_1.default.createElement(eui_1.EuiButton, { isDisabled: filter.length === 0, onClick: onAddButtonClick },
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.source.addButtonLabel", defaultMessage: "Add" })))));
};
