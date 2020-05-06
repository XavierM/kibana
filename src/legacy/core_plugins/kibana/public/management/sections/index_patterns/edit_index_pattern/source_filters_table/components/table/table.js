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
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const filterHeader = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.filterHeader', {
    defaultMessage: 'Filter',
});
const filterDescription = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.filterDescription', { defaultMessage: 'Filter name' });
const matchesHeader = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.matchesHeader', {
    defaultMessage: 'Matches',
});
const matchesDescription = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.matchesDescription', { defaultMessage: 'Language used for the field' });
const editAria = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.editAria', {
    defaultMessage: 'Edit',
});
const saveAria = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.saveAria', {
    defaultMessage: 'Save',
});
const deleteAria = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.deleteAria', {
    defaultMessage: 'Delete',
});
const cancelAria = i18n_1.i18n.translate('kbn.management.editIndexPattern.source.table.cancelAria', {
    defaultMessage: 'Cancel',
});
class Table extends react_1.Component {
    constructor(props) {
        super(props);
        this.startEditingFilter = (editingFilterId, editingFilterValue) => this.setState({ editingFilterId, editingFilterValue });
        this.stopEditingFilter = () => this.setState({ editingFilterId: '' });
        this.onEditingFilterChange = (e) => this.setState({ editingFilterValue: e.target.value });
        this.onEditFieldKeyDown = ({ keyCode }) => {
            if (eui_1.keyCodes.ENTER === keyCode && this.state.editingFilterId && this.state.editingFilterValue) {
                this.props.saveFilter({
                    clientId: this.state.editingFilterId,
                    value: this.state.editingFilterValue,
                });
                this.stopEditingFilter();
            }
            if (eui_1.keyCodes.ESCAPE === keyCode) {
                this.stopEditingFilter();
            }
        };
        this.state = {
            editingFilterId: '',
            editingFilterValue: '',
        };
    }
    getColumns() {
        const { deleteFilter, fieldWildcardMatcher, indexPattern, saveFilter } = this.props;
        return [
            {
                field: 'value',
                name: filterHeader,
                description: filterDescription,
                dataType: 'string',
                sortable: true,
                render: (value, filter) => {
                    if (this.state.editingFilterId && this.state.editingFilterId === filter.clientId) {
                        return (react_1.default.createElement(eui_1.EuiFieldText, { autoFocus: true, value: this.state.editingFilterValue, onChange: this.onEditingFilterChange, onKeyDown: this.onEditFieldKeyDown }));
                    }
                    return react_1.default.createElement("span", null, value);
                },
            },
            {
                field: 'value',
                name: matchesHeader,
                description: matchesDescription,
                dataType: 'string',
                sortable: true,
                render: (value, filter) => {
                    const wildcardMatcher = fieldWildcardMatcher([
                        this.state.editingFilterId === filter.clientId ? this.state.editingFilterValue : value,
                    ]);
                    const matches = indexPattern
                        .getNonScriptedFields()
                        .map((currentFilter) => currentFilter.name)
                        .filter(wildcardMatcher)
                        .sort();
                    if (matches.length) {
                        return react_1.default.createElement("span", null, matches.join(', '));
                    }
                    return (react_1.default.createElement("em", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.editIndexPattern.source.table.notMatchedLabel", defaultMessage: "The source filter doesn't match any known fields." })));
                },
            },
            {
                name: '',
                align: eui_1.RIGHT_ALIGNMENT,
                width: '100',
                render: (filter) => {
                    if (this.state.editingFilterId === filter.clientId) {
                        return (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(eui_1.EuiButtonIcon, { size: "s", onClick: () => {
                                    saveFilter({
                                        clientId: this.state.editingFilterId,
                                        value: this.state.editingFilterValue,
                                    });
                                    this.stopEditingFilter();
                                }, iconType: "checkInCircleFilled", "aria-label": saveAria }),
                            react_1.default.createElement(eui_1.EuiButtonIcon, { size: "s", onClick: () => {
                                    this.stopEditingFilter();
                                }, iconType: "cross", "aria-label": cancelAria })));
                    }
                    return (react_1.default.createElement(react_1.default.Fragment, null,
                        react_1.default.createElement(eui_1.EuiButtonIcon, { size: "s", onClick: () => this.startEditingFilter(filter.clientId, filter.value), iconType: "pencil", "aria-label": editAria }),
                        react_1.default.createElement(eui_1.EuiButtonIcon, { size: "s", color: "danger", onClick: () => deleteFilter(filter), iconType: "trash", "aria-label": deleteAria })));
                },
            },
        ];
    }
    render() {
        const { items, isSaving } = this.props;
        const columns = this.getColumns();
        const pagination = {
            initialPageSize: 10,
            pageSizeOptions: [5, 10, 25, 50],
        };
        return (react_1.default.createElement(eui_1.EuiInMemoryTable, { loading: isSaving, items: items, columns: columns, pagination: pagination, sorting: true }));
    }
}
exports.Table = Table;
