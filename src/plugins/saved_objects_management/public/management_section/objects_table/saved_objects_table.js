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
const lodash_1 = require("lodash");
// @ts-ignore
const filesaver_1 = require("@elastic/filesaver");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const lib_1 = require("../../lib");
const components_1 = require("./components");
class SavedObjectsTable extends react_1.Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        this.fetchCounts = async () => {
            const { allowedTypes } = this.props;
            const { queryText, visibleTypes } = lib_1.parseQuery(this.state.activeQuery);
            const filteredTypes = allowedTypes.filter(type => !visibleTypes || visibleTypes.includes(type));
            // These are the saved objects visible in the table.
            const filteredSavedObjectCounts = await lib_1.getSavedObjectCounts(this.props.http, filteredTypes, queryText);
            const exportAllOptions = [];
            const exportAllSelectedOptions = {};
            Object.keys(filteredSavedObjectCounts).forEach(id => {
                // Add this type as a bulk-export option.
                exportAllOptions.push({
                    id,
                    label: `${id} (${filteredSavedObjectCounts[id] || 0})`,
                });
                // Select it by default.
                exportAllSelectedOptions[id] = true;
            });
            // Fetch all the saved objects that exist so we can accurately populate the counts within
            // the table filter dropdown.
            const savedObjectCounts = await lib_1.getSavedObjectCounts(this.props.http, allowedTypes, queryText);
            this.setState(state => ({
                ...state,
                savedObjectCounts,
                exportAllOptions,
                exportAllSelectedOptions,
            }));
        };
        this.fetchSavedObjects = () => {
            this.setState({
                isSearching: true,
            }, this.debouncedFetch);
        };
        this.debouncedFetch = lodash_1.debounce(async () => {
            const { activeQuery: query, page, perPage } = this.state;
            const { notifications, http, allowedTypes } = this.props;
            const { queryText, visibleTypes } = lib_1.parseQuery(query);
            // "searchFields" is missing from the "findOptions" but gets injected via the API.
            // The API extracts the fields from each uiExports.savedObjectsManagement "defaultSearchField" attribute
            const findOptions = {
                search: queryText ? `${queryText}*` : undefined,
                perPage,
                page: page + 1,
                fields: ['id'],
                type: allowedTypes.filter(type => !visibleTypes || visibleTypes.includes(type)),
            };
            if (findOptions.type.length > 1) {
                findOptions.sortField = 'type';
            }
            try {
                const resp = await lib_1.findObjects(http, findOptions);
                if (!this._isMounted) {
                    return;
                }
                this.setState(({ activeQuery }) => {
                    // ignore results for old requests
                    if (activeQuery.text !== query.text) {
                        return null;
                    }
                    return {
                        savedObjects: resp.savedObjects,
                        filteredItemCount: resp.total,
                        isSearching: false,
                    };
                });
            }
            catch (error) {
                if (this._isMounted) {
                    this.setState({
                        isSearching: false,
                    });
                }
                notifications.toasts.addDanger({
                    title: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.unableFindSavedObjectsNotificationMessage', { defaultMessage: 'Unable find saved objects' }),
                    text: `${error}`,
                });
            }
        }, 300);
        this.refreshData = async () => {
            await Promise.all([this.fetchSavedObjects(), this.fetchCounts()]);
        };
        this.onSelectionChanged = (selection) => {
            this.setState({ selectedSavedObjects: selection });
        };
        this.onQueryChange = ({ query }) => {
            // TODO: Use isSameQuery to compare new query with state.activeQuery to avoid re-fetching the
            // same data we already have.
            this.setState({
                activeQuery: query,
                page: 0,
                selectedSavedObjects: [],
            }, () => {
                this.fetchSavedObjects();
                this.fetchCounts();
            });
        };
        this.onTableChange = async (table) => {
            const { index: page, size: perPage } = table.page || {};
            this.setState({
                page,
                perPage,
                selectedSavedObjects: [],
            }, this.fetchSavedObjects);
        };
        this.onShowRelationships = (object) => {
            this.setState({
                isShowingRelationships: true,
                relationshipObject: object,
            });
        };
        this.onHideRelationships = () => {
            this.setState({
                isShowingRelationships: false,
                relationshipObject: undefined,
            });
        };
        this.onExport = async (includeReferencesDeep) => {
            const { selectedSavedObjects } = this.state;
            const { notifications, http } = this.props;
            const objectsToExport = selectedSavedObjects.map(obj => ({ id: obj.id, type: obj.type }));
            let blob;
            try {
                blob = await lib_1.fetchExportObjects(http, objectsToExport, includeReferencesDeep);
            }
            catch (e) {
                notifications.toasts.addDanger({
                    title: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.export.dangerNotification', {
                        defaultMessage: 'Unable to generate export',
                    }),
                });
                throw e;
            }
            filesaver_1.saveAs(blob, 'export.ndjson');
            const exportDetails = await lib_1.extractExportDetails(blob);
            this.showExportSuccessMessage(exportDetails);
        };
        this.onExportAll = async () => {
            const { exportAllSelectedOptions, isIncludeReferencesDeepChecked, activeQuery } = this.state;
            const { notifications, http } = this.props;
            const { queryText } = lib_1.parseQuery(activeQuery);
            const exportTypes = Object.entries(exportAllSelectedOptions).reduce((accum, [id, selected]) => {
                if (selected) {
                    accum.push(id);
                }
                return accum;
            }, []);
            let blob;
            try {
                blob = await lib_1.fetchExportByTypeAndSearch(http, exportTypes, queryText ? `${queryText}*` : undefined, isIncludeReferencesDeepChecked);
            }
            catch (e) {
                notifications.toasts.addDanger({
                    title: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.export.dangerNotification', {
                        defaultMessage: 'Unable to generate export',
                    }),
                });
                throw e;
            }
            filesaver_1.saveAs(blob, 'export.ndjson');
            const exportDetails = await lib_1.extractExportDetails(blob);
            this.showExportSuccessMessage(exportDetails);
            this.setState({ isShowingExportAllOptionsModal: false });
        };
        this.showExportSuccessMessage = (exportDetails) => {
            const { notifications } = this.props;
            if (exportDetails && exportDetails.missingReferences.length > 0) {
                notifications.toasts.addWarning({
                    title: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.export.successWithMissingRefsNotification', {
                        defaultMessage: 'Your file is downloading in the background. ' +
                            'Some related objects could not be found. ' +
                            'Please see the last line in the exported file for a list of missing objects.',
                    }),
                });
            }
            else {
                notifications.toasts.addSuccess({
                    title: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.export.successNotification', {
                        defaultMessage: 'Your file is downloading in the background',
                    }),
                });
            }
        };
        this.finishImport = () => {
            this.hideImportFlyout();
            this.fetchSavedObjects();
            this.fetchCounts();
        };
        this.showImportFlyout = () => {
            this.setState({ isShowingImportFlyout: true });
        };
        this.hideImportFlyout = () => {
            this.setState({ isShowingImportFlyout: false });
        };
        this.onDelete = () => {
            this.setState({ isShowingDeleteConfirmModal: true });
        };
        this.delete = async () => {
            const { savedObjectsClient } = this.props;
            const { selectedSavedObjects, isDeleting } = this.state;
            if (isDeleting) {
                return;
            }
            this.setState({ isDeleting: true });
            const indexPatterns = selectedSavedObjects.filter(object => object.type === 'index-pattern');
            if (indexPatterns.length) {
                await this.props.indexPatterns.clearCache();
            }
            const objects = await savedObjectsClient.bulkGet(selectedSavedObjects);
            const deletes = objects.savedObjects.map(object => savedObjectsClient.delete(object.type, object.id));
            await Promise.all(deletes);
            // Unset this
            this.setState({
                selectedSavedObjects: [],
            });
            // Fetching all data
            await this.fetchSavedObjects();
            await this.fetchCounts();
            // Allow the user to interact with the table once the saved objects have been re-fetched.
            this.setState({
                isShowingDeleteConfirmModal: false,
                isDeleting: false,
            });
        };
        this.getRelationships = async (type, id) => {
            const { allowedTypes, http } = this.props;
            return await lib_1.getRelationships(http, type, id, allowedTypes);
        };
        this.changeIncludeReferencesDeep = () => {
            this.setState(state => ({
                isIncludeReferencesDeepChecked: !state.isIncludeReferencesDeepChecked,
            }));
        };
        this.closeExportAllModal = () => {
            this.setState({ isShowingExportAllOptionsModal: false });
        };
        this.state = {
            totalCount: 0,
            page: 0,
            perPage: props.perPageConfig || 50,
            savedObjects: [],
            savedObjectCounts: props.allowedTypes.reduce((typeToCountMap, type) => {
                typeToCountMap[type] = 0;
                return typeToCountMap;
            }, {}),
            activeQuery: eui_1.Query.parse(''),
            selectedSavedObjects: [],
            isShowingImportFlyout: false,
            isSearching: false,
            filteredItemCount: 0,
            isShowingRelationships: false,
            relationshipObject: undefined,
            isShowingDeleteConfirmModal: false,
            isShowingExportAllOptionsModal: false,
            isDeleting: false,
            exportAllOptions: [],
            exportAllSelectedOptions: {},
            isIncludeReferencesDeepChecked: true,
        };
    }
    componentDidMount() {
        this._isMounted = true;
        this.fetchSavedObjects();
        this.fetchCounts();
    }
    componentWillUnmount() {
        this._isMounted = false;
        this.debouncedFetch.cancel();
    }
    renderFlyout() {
        if (!this.state.isShowingImportFlyout) {
            return null;
        }
        const { applications } = this.props;
        const newIndexPatternUrl = applications.getUrlForApp('kibana', {
            path: '#/management/kibana/index_pattern',
        });
        return (react_1.default.createElement(components_1.Flyout, { close: this.hideImportFlyout, done: this.finishImport, http: this.props.http, serviceRegistry: this.props.serviceRegistry, indexPatterns: this.props.indexPatterns, newIndexPatternUrl: newIndexPatternUrl, allowedTypes: this.props.allowedTypes, overlays: this.props.overlays, search: this.props.search }));
    }
    renderRelationships() {
        if (!this.state.isShowingRelationships) {
            return null;
        }
        return (react_1.default.createElement(components_1.Relationships, { basePath: this.props.http.basePath, savedObject: this.state.relationshipObject, getRelationships: this.getRelationships, close: this.onHideRelationships, goInspectObject: this.props.goInspectObject, canGoInApp: this.props.canGoInApp }));
    }
    renderDeleteConfirmModal() {
        const { isShowingDeleteConfirmModal, isDeleting, selectedSavedObjects } = this.state;
        if (!isShowingDeleteConfirmModal) {
            return null;
        }
        let modal;
        if (isDeleting) {
            // Block the user from interacting with the table while its contents are being deleted.
            modal = react_1.default.createElement(eui_1.EuiLoadingKibana, { size: "xl" });
        }
        else {
            const onCancel = () => {
                this.setState({ isShowingDeleteConfirmModal: false });
            };
            const onConfirm = () => {
                this.delete();
            };
            modal = (react_1.default.createElement(eui_1.EuiConfirmModal, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.deleteSavedObjectsConfirmModalTitle", defaultMessage: "Delete saved objects" }), onCancel: onCancel, onConfirm: onConfirm, buttonColor: "danger", cancelButtonText: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.deleteSavedObjectsConfirmModal.cancelButtonLabel", defaultMessage: "Cancel" }), confirmButtonText: isDeleting ? (react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.deleteSavedObjectsConfirmModal.deleteProcessButtonLabel", defaultMessage: "Deleting\u2026" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.deleteSavedObjectsConfirmModal.deleteButtonLabel", defaultMessage: "Delete" })), defaultFocusedButton: eui_1.EUI_MODAL_CONFIRM_BUTTON },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.deleteSavedObjectsConfirmModalDescription", defaultMessage: "This action will delete the following saved objects:" })),
                react_1.default.createElement(eui_1.EuiInMemoryTable, { items: selectedSavedObjects, columns: [
                        {
                            field: 'type',
                            name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.deleteSavedObjectsConfirmModal.typeColumnName', { defaultMessage: 'Type' }),
                            width: '50px',
                            render: (type, object) => (react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: lib_1.getSavedObjectLabel(type) },
                                react_1.default.createElement(eui_1.EuiIcon, { type: object.meta.icon || 'apps' }))),
                        },
                        {
                            field: 'id',
                            name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.deleteSavedObjectsConfirmModal.idColumnName', { defaultMessage: 'Id' }),
                        },
                        {
                            field: 'meta.title',
                            name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.deleteSavedObjectsConfirmModal.titleColumnName', { defaultMessage: 'Title' }),
                        },
                    ], pagination: true, sorting: false })));
        }
        return react_1.default.createElement(eui_1.EuiOverlayMask, null, modal);
    }
    renderExportAllOptionsModal() {
        const { isShowingExportAllOptionsModal, filteredItemCount, exportAllOptions, exportAllSelectedOptions, isIncludeReferencesDeepChecked, } = this.state;
        if (!isShowingExportAllOptionsModal) {
            return null;
        }
        return (react_1.default.createElement(eui_1.EuiOverlayMask, null,
            react_1.default.createElement(eui_1.EuiModal, { onClose: this.closeExportAllModal },
                react_1.default.createElement(eui_1.EuiModalHeader, null,
                    react_1.default.createElement(eui_1.EuiModalHeaderTitle, null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.exportObjectsConfirmModalTitle", defaultMessage: "Export {filteredItemCount, plural, one{# object} other {# objects}}", values: {
                                filteredItemCount,
                            } }))),
                react_1.default.createElement(eui_1.EuiModalBody, null,
                    react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.exportObjectsConfirmModalDescription", defaultMessage: "Select which types to export" }), labelType: "legend" },
                        react_1.default.createElement(eui_1.EuiCheckboxGroup, { options: exportAllOptions, idToSelectedMap: exportAllSelectedOptions, onChange: optionId => {
                                const newExportAllSelectedOptions = {
                                    ...exportAllSelectedOptions,
                                    ...{
                                        [optionId]: !exportAllSelectedOptions[optionId],
                                    },
                                };
                                this.setState({
                                    exportAllSelectedOptions: newExportAllSelectedOptions,
                                });
                            } })),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_1.default.createElement(eui_1.EuiSwitch, { name: "includeReferencesDeep", label: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.exportObjectsConfirmModal.includeReferencesDeepLabel", defaultMessage: "Include related objects" }), checked: isIncludeReferencesDeepChecked, onChange: this.changeIncludeReferencesDeep })),
                react_1.default.createElement(eui_1.EuiModalFooter, null,
                    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd" },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiFlexGroup, null,
                                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                    react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.closeExportAllModal },
                                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.exportObjectsConfirmModal.cancelButtonLabel", defaultMessage: "Cancel" }))),
                                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                                    react_1.default.createElement(eui_1.EuiButton, { fill: true, onClick: this.onExportAll },
                                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.exportObjectsConfirmModal.exportAllButtonLabel", defaultMessage: "Export all" }))))))))));
    }
    render() {
        const { selectedSavedObjects, page, perPage, savedObjects, filteredItemCount, isSearching, savedObjectCounts, } = this.state;
        const { http, allowedTypes, applications } = this.props;
        const selectionConfig = {
            onSelectionChange: this.onSelectionChanged,
        };
        const filterOptions = allowedTypes.map(type => ({
            value: type,
            name: type,
            view: `${type} (${savedObjectCounts[type] || 0})`,
        }));
        return (react_1.default.createElement(eui_1.EuiPageContent, { horizontalPosition: "center" },
            this.renderFlyout(),
            this.renderRelationships(),
            this.renderDeleteConfirmModal(),
            this.renderExportAllOptionsModal(),
            react_1.default.createElement(components_1.Header, { onExportAll: () => this.setState({ isShowingExportAllOptionsModal: true }), onImport: this.showImportFlyout, onRefresh: this.refreshData, filteredCount: filteredItemCount }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
            react_1.default.createElement(components_1.Table, { basePath: http.basePath, itemId: 'id', actionRegistry: this.props.actionRegistry, selectionConfig: selectionConfig, selectedSavedObjects: selectedSavedObjects, onQueryChange: this.onQueryChange, onTableChange: this.onTableChange, filterOptions: filterOptions, onExport: this.onExport, canDelete: applications.capabilities.savedObjectsManagement.delete, onDelete: this.onDelete, goInspectObject: this.props.goInspectObject, pageIndex: page, pageSize: perPage, items: savedObjects, totalItemCount: filteredItemCount, isSearching: isSearching, onShowRelationships: this.onShowRelationships, canGoInApp: this.props.canGoInApp })));
    }
}
exports.SavedObjectsTable = SavedObjectsTable;
