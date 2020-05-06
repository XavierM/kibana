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
const lib_1 = require("../../../lib");
class Table extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isSearchTextValid: true,
            parseErrorMessage: null,
            isExportPopoverOpen: false,
            isIncludeReferencesDeepChecked: true,
            activeAction: undefined,
        };
        this.onChange = ({ query, error }) => {
            if (error) {
                this.setState({
                    isSearchTextValid: false,
                    parseErrorMessage: error.message,
                });
                return;
            }
            this.setState({
                isSearchTextValid: true,
                parseErrorMessage: null,
            });
            this.props.onQueryChange({ query });
        };
        this.closeExportPopover = () => {
            this.setState({ isExportPopoverOpen: false });
        };
        this.toggleExportPopoverVisibility = () => {
            this.setState(state => ({
                isExportPopoverOpen: !state.isExportPopoverOpen,
            }));
        };
        this.toggleIsIncludeReferencesDeepChecked = () => {
            this.setState(state => ({
                isIncludeReferencesDeepChecked: !state.isIncludeReferencesDeepChecked,
            }));
        };
        this.onExportClick = () => {
            const { onExport } = this.props;
            const { isIncludeReferencesDeepChecked } = this.state;
            onExport(isIncludeReferencesDeepChecked);
            this.setState({ isExportPopoverOpen: false });
        };
    }
    render() {
        const { pageIndex, pageSize, itemId, items, totalItemCount, isSearching, filterOptions, selectionConfig: selection, onDelete, selectedSavedObjects, onTableChange, goInspectObject, onShowRelationships, basePath, actionRegistry, } = this.props;
        const pagination = {
            pageIndex,
            pageSize,
            totalItemCount,
            pageSizeOptions: [5, 10, 20, 50],
        };
        const filters = [
            {
                type: 'field_value_selection',
                field: 'type',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.typeFilterName', {
                    defaultMessage: 'Type',
                }),
                multiSelect: 'or',
                options: filterOptions,
            },
        ];
        const columns = [
            {
                field: 'type',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnTypeName', {
                    defaultMessage: 'Type',
                }),
                width: '50px',
                align: 'center',
                description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnTypeDescription', { defaultMessage: 'Type of the saved object' }),
                sortable: false,
                'data-test-subj': 'savedObjectsTableRowType',
                render: (type, object) => {
                    return (react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: lib_1.getSavedObjectLabel(type) },
                        react_1.default.createElement(eui_1.EuiIcon, { "aria-label": lib_1.getSavedObjectLabel(type), type: object.meta.icon || 'apps', size: "s", "data-test-subj": "objectType" })));
                },
            },
            {
                field: 'meta.title',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnTitleName', {
                    defaultMessage: 'Title',
                }),
                description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnTitleDescription', { defaultMessage: 'Title of the saved object' }),
                dataType: 'string',
                sortable: false,
                'data-test-subj': 'savedObjectsTableRowTitle',
                render: (title, object) => {
                    const { path = '' } = object.meta.inAppUrl || {};
                    const canGoInApp = this.props.canGoInApp(object);
                    if (!canGoInApp) {
                        return react_1.default.createElement(eui_1.EuiText, { size: "s" }, title || lib_1.getDefaultTitle(object));
                    }
                    return (react_1.default.createElement(eui_1.EuiLink, { href: basePath.prepend(path) }, title || lib_1.getDefaultTitle(object)));
                },
            },
            {
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnActionsName', {
                    defaultMessage: 'Actions',
                }),
                actions: [
                    {
                        name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnActions.inspectActionName', { defaultMessage: 'Inspect' }),
                        description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnActions.inspectActionDescription', { defaultMessage: 'Inspect this saved object' }),
                        type: 'icon',
                        icon: 'inspect',
                        onClick: object => goInspectObject(object),
                        available: object => !!object.meta.editUrl,
                        'data-test-subj': 'savedObjectsTableAction-inspect',
                    },
                    {
                        name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnActions.viewRelationshipsActionName', { defaultMessage: 'Relationships' }),
                        description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.columnActions.viewRelationshipsActionDescription', {
                            defaultMessage: 'View the relationships this saved object has to other saved objects',
                        }),
                        type: 'icon',
                        icon: 'kqlSelector',
                        onClick: object => onShowRelationships(object),
                        'data-test-subj': 'savedObjectsTableAction-relationships',
                    },
                    ...actionRegistry.getAll().map(action => {
                        return {
                            ...action.euiAction,
                            'data-test-subj': `savedObjectsTableAction-${action.id}`,
                            onClick: (object) => {
                                this.setState({
                                    activeAction: action,
                                });
                                action.registerOnFinishCallback(() => {
                                    this.setState({
                                        activeAction: undefined,
                                    });
                                });
                                if (action.euiAction.onClick) {
                                    action.euiAction.onClick(object);
                                }
                            },
                        };
                    }),
                ],
            },
        ];
        let queryParseError;
        if (!this.state.isSearchTextValid) {
            const parseErrorMsg = i18n_1.i18n.translate('savedObjectsManagement.objectsTable.searchBar.unableToParseQueryErrorMessage', { defaultMessage: 'Unable to parse query' });
            queryParseError = (react_1.default.createElement(eui_1.EuiFormErrorText, null, `${parseErrorMsg}. ${this.state.parseErrorMessage}`));
        }
        const button = (react_1.default.createElement(eui_1.EuiButton, { iconType: "arrowDown", iconSide: "right", onClick: this.toggleExportPopoverVisibility, isDisabled: selectedSavedObjects.length === 0 },
            react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.table.exportPopoverButtonLabel", defaultMessage: "Export" })));
        const activeActionContents = this.state.activeAction?.render() ?? null;
        return (react_1.default.createElement(react_1.Fragment, null,
            activeActionContents,
            react_1.default.createElement(eui_1.EuiSearchBar, { box: { 'data-test-subj': 'savedObjectSearchBar' }, filters: filters, onChange: this.onChange, toolsRight: [
                    react_1.default.createElement(eui_1.EuiButton, { key: "deleteSO", iconType: "trash", color: "danger", onClick: onDelete, isDisabled: selectedSavedObjects.length === 0 || !this.props.canDelete, title: this.props.canDelete
                            ? undefined
                            : i18n_1.i18n.translate('savedObjectsManagement.objectsTable.table.deleteButtonTitle', {
                                defaultMessage: 'Unable to delete saved objects',
                            }), "data-test-subj": "savedObjectsManagementDelete" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.table.deleteButtonLabel", defaultMessage: "Delete" })),
                    react_1.default.createElement(eui_1.EuiPopover, { key: "exportSOOptions", button: button, isOpen: this.state.isExportPopoverOpen, closePopover: this.closeExportPopover },
                        react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.exportObjectsConfirmModal.exportOptionsLabel", defaultMessage: "Options" }) },
                            react_1.default.createElement(eui_1.EuiSwitch, { name: "includeReferencesDeep", label: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.exportObjectsConfirmModal.includeReferencesDeepLabel", defaultMessage: "Include related objects" }), checked: this.state.isIncludeReferencesDeepChecked, onChange: this.toggleIsIncludeReferencesDeepChecked })),
                        react_1.default.createElement(eui_1.EuiFormRow, null,
                            react_1.default.createElement(eui_1.EuiButton, { key: "exportSO", iconType: "exportAction", onClick: this.onExportClick, fill: true },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.table.exportButtonLabel", defaultMessage: "Export" })))),
                ] }),
            queryParseError,
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement("div", { "data-test-subj": "savedObjectsTable" },
                react_1.default.createElement(eui_1.EuiBasicTable, { loading: isSearching, itemId: itemId, items: items, columns: columns, pagination: pagination, selection: selection, onChange: onTableChange, rowProps: item => ({
                        'data-test-subj': `savedObjectsTableRow row-${item.id}`,
                    }) }))));
    }
}
exports.Table = Table;
