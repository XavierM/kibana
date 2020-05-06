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
const default_1 = require("../default");
class StaticLookupFormatEditor extends default_1.DefaultFormatEditor {
    constructor() {
        super(...arguments);
        this.onLookupChange = (newLookupParams, index) => {
            const lookupEntries = [...this.props.formatParams.lookupEntries];
            lookupEntries[index] = {
                ...lookupEntries[index],
                ...newLookupParams,
            };
            this.onChange({
                lookupEntries,
            });
        };
        this.addLookup = () => {
            const lookupEntries = [...this.props.formatParams.lookupEntries];
            this.onChange({
                lookupEntries: [...lookupEntries, {}],
            });
        };
        this.removeLookup = (index) => {
            const lookupEntries = [...this.props.formatParams.lookupEntries];
            lookupEntries.splice(index, 1);
            this.onChange({
                lookupEntries,
            });
        };
    }
    render() {
        const { formatParams } = this.props;
        const items = (formatParams.lookupEntries &&
            formatParams.lookupEntries.length &&
            formatParams.lookupEntries.map((lookup, index) => {
                return {
                    ...lookup,
                    index,
                };
            })) ||
            [];
        const columns = [
            {
                field: 'key',
                name: (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.staticLookup.keyLabel", defaultMessage: "Key" })),
                render: (value, item) => {
                    return (react_1.default.createElement(eui_1.EuiFieldText, { value: value || '', onChange: e => {
                            this.onLookupChange({
                                key: e.target.value,
                            }, item.index);
                        } }));
                },
            },
            {
                field: 'value',
                name: (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.staticLookup.valueLabel", defaultMessage: "Value" })),
                render: (value, item) => {
                    return (react_1.default.createElement(eui_1.EuiFieldText, { value: value || '', onChange: e => {
                            this.onLookupChange({
                                value: e.target.value,
                            }, item.index);
                        } }));
                },
            },
            {
                field: 'actions',
                name: i18n_1.i18n.translate('common.ui.fieldEditor.staticLookup.actions', {
                    defaultMessage: 'actions',
                }),
                actions: [
                    {
                        name: i18n_1.i18n.translate('common.ui.fieldEditor.staticLookup.deleteAria', {
                            defaultMessage: 'Delete',
                        }),
                        description: i18n_1.i18n.translate('common.ui.fieldEditor.staticLookup.deleteTitle', {
                            defaultMessage: 'Delete entry',
                        }),
                        onClick: (item) => {
                            this.removeLookup(item.index);
                        },
                        type: 'icon',
                        icon: 'trash',
                        color: 'danger',
                        available: () => items.length > 1,
                    },
                ],
                width: '30px',
            },
        ];
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiBasicTable, { items: items, columns: columns, style: { maxWidth: '400px' } }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(eui_1.EuiButton, { iconType: "plusInCircle", size: "s", onClick: this.addLookup },
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.staticLookup.addEntryButton", defaultMessage: "Add entry" })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.staticLookup.unknownKeyLabel", defaultMessage: "Value for unknown key" }) },
                react_1.default.createElement(eui_1.EuiFieldText, { value: formatParams.unknownKeyValue || '', placeholder: i18n_1.i18n.translate('common.ui.fieldEditor.staticLookup.leaveBlankPlaceholder', {
                        defaultMessage: 'Leave blank to keep value as-is',
                    }), onChange: e => {
                        this.onChange({ unknownKeyValue: e.target.value });
                    } })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" })));
    }
}
exports.StaticLookupFormatEditor = StaticLookupFormatEditor;
StaticLookupFormatEditor.formatId = 'static_lookup';
