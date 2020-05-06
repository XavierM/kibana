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
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const lib_1 = require("../../../lib");
const resolve_saved_objects_1 = require("../../../lib/resolve_saved_objects");
class Flyout extends react_1.Component {
    constructor(props) {
        super(props);
        this.fetchIndexPatterns = async () => {
            const indexPatterns = await this.props.indexPatterns.getFields(['id', 'title']);
            this.setState({ indexPatterns });
        };
        this.changeOverwriteAll = () => {
            this.setState(state => ({
                isOverwriteAllChecked: !state.isOverwriteAllChecked,
            }));
        };
        this.setImportFile = (files) => {
            if (!files || !files[0]) {
                this.setState({ file: undefined, isLegacyFile: false });
                return;
            }
            const file = files[0];
            this.setState({
                file,
                isLegacyFile: /\.json$/i.test(file.name) || file.type === 'application/json',
            });
        };
        /**
         * Import
         *
         * Does the initial import of a file, resolveImportErrors then handles errors and retries
         */
        this.import = async () => {
            const { http } = this.props;
            const { file, isOverwriteAllChecked } = this.state;
            this.setState({ status: 'loading', error: undefined });
            // Import the file
            try {
                const response = await lib_1.importFile(http, file, isOverwriteAllChecked);
                this.setState(lib_1.processImportResponse(response), () => {
                    // Resolve import errors right away if there's no index patterns to match
                    // This will ask about overwriting each object, etc
                    if (this.state.unmatchedReferences?.length === 0) {
                        this.resolveImportErrors();
                    }
                });
            }
            catch (e) {
                this.setState({
                    status: 'error',
                    error: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.importFileErrorMessage', {
                        defaultMessage: 'The file could not be processed.',
                    }),
                });
                return;
            }
        };
        /**
         * Get Conflict Resolutions
         *
         * Function iterates through the objects, displays a modal for each asking the user if they wish to overwrite it or not.
         *
         * @param {array} objects List of objects to request the user if they wish to overwrite it
         * @return {Promise<array>} An object with the key being "type:id" and value the resolution chosen by the user
         */
        this.getConflictResolutions = async (objects) => {
            const resolutions = {};
            for (const { type, id, title } of objects) {
                const overwrite = await new Promise(resolve => {
                    this.setState({
                        conflictingRecord: {
                            id,
                            type,
                            title,
                            done: resolve,
                        },
                    });
                });
                resolutions[`${type}:${id}`] = overwrite;
                this.setState({ conflictingRecord: undefined });
            }
            return resolutions;
        };
        /**
         * Resolve Import Errors
         *
         * Function goes through the failedImports and tries to resolve the issues.
         */
        this.resolveImportErrors = async () => {
            this.setState({
                error: undefined,
                status: 'loading',
                loadingMessage: undefined,
            });
            try {
                const updatedState = await lib_1.resolveImportErrors({
                    http: this.props.http,
                    state: this.state,
                    getConflictResolutions: this.getConflictResolutions,
                });
                this.setState(updatedState);
            }
            catch (e) {
                this.setState({
                    status: 'error',
                    error: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.resolveImportErrorsFileErrorMessage', { defaultMessage: 'The file could not be processed.' }),
                });
            }
        };
        this.legacyImport = async () => {
            const { serviceRegistry, indexPatterns, overlays, http, allowedTypes } = this.props;
            const { file, isOverwriteAllChecked } = this.state;
            this.setState({ status: 'loading', error: undefined });
            // Log warning on server, don't wait for response
            lib_1.logLegacyImport(http);
            let contents;
            try {
                contents = await lib_1.importLegacyFile(file);
            }
            catch (e) {
                this.setState({
                    status: 'error',
                    error: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.importLegacyFileErrorMessage', { defaultMessage: 'The file could not be processed.' }),
                });
                return;
            }
            if (!Array.isArray(contents)) {
                this.setState({
                    status: 'error',
                    error: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.invalidFormatOfImportedFileErrorMessage', { defaultMessage: 'Saved objects file format is invalid and cannot be imported.' }),
                });
                return;
            }
            contents = contents
                .filter(content => allowedTypes.includes(content._type))
                .map(doc => ({
                ...doc,
                // The server assumes that documents with no migrationVersion are up to date.
                // That assumption enables Kibana and other API consumers to not have to build
                // up migrationVersion prior to creating new objects. But it means that imports
                // need to set migrationVersion to something other than undefined, so that imported
                // docs are not seen as automatically up-to-date.
                _migrationVersion: doc._migrationVersion || {},
            }));
            const { conflictedIndexPatterns, conflictedSavedObjectsLinkedToSavedSearches, conflictedSearchDocs, importedObjectCount, failedImports, } = await resolve_saved_objects_1.resolveSavedObjects(contents, isOverwriteAllChecked, serviceRegistry.all().map(e => e.service), indexPatterns, overlays.openConfirm);
            const byId = {};
            conflictedIndexPatterns
                .map(({ doc, obj }) => {
                return { doc, obj: obj._serialize() };
            })
                .forEach(({ doc, obj }) => obj.references.forEach((ref) => {
                byId[ref.id] = byId[ref.id] != null ? byId[ref.id].concat({ doc, obj }) : [{ doc, obj }];
            }));
            const unmatchedReferences = Object.entries(byId).reduce((accum, [existingIndexPatternId, list]) => {
                accum.push({
                    existingIndexPatternId,
                    newIndexPatternId: undefined,
                    list: list.map(({ doc }) => ({
                        id: existingIndexPatternId,
                        type: doc._type,
                        title: doc._source.title,
                    })),
                });
                return accum;
            }, []);
            this.setState({
                conflictedIndexPatterns,
                conflictedSavedObjectsLinkedToSavedSearches,
                conflictedSearchDocs,
                failedImports,
                unmatchedReferences,
                importCount: importedObjectCount,
                status: unmatchedReferences.length === 0 ? 'success' : 'idle',
            });
        };
        this.confirmLegacyImport = async () => {
            const { conflictedIndexPatterns, isOverwriteAllChecked, conflictedSavedObjectsLinkedToSavedSearches, conflictedSearchDocs, failedImports, } = this.state;
            const { serviceRegistry, indexPatterns, search } = this.props;
            this.setState({
                error: undefined,
                status: 'loading',
                loadingMessage: undefined,
            });
            let importCount = this.state.importCount;
            if (this.hasUnmatchedReferences) {
                try {
                    const resolutions = this.resolutions;
                    // Do not Promise.all these calls as the order matters
                    this.setState({
                        loadingMessage: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.confirmLegacyImport.resolvingConflictsLoadingMessage', { defaultMessage: 'Resolving conflicts…' }),
                    });
                    if (resolutions.length) {
                        importCount += await resolve_saved_objects_1.resolveIndexPatternConflicts(resolutions, conflictedIndexPatterns, isOverwriteAllChecked, {
                            indexPatterns,
                            search,
                        });
                    }
                    this.setState({
                        loadingMessage: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.confirmLegacyImport.savingConflictsLoadingMessage', { defaultMessage: 'Saving conflicts…' }),
                    });
                    importCount += await resolve_saved_objects_1.saveObjects(conflictedSavedObjectsLinkedToSavedSearches, isOverwriteAllChecked);
                    this.setState({
                        loadingMessage: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.confirmLegacyImport.savedSearchAreLinkedProperlyLoadingMessage', { defaultMessage: 'Ensure saved searches are linked properly…' }),
                    });
                    importCount += await resolve_saved_objects_1.resolveSavedSearches(conflictedSearchDocs, serviceRegistry.all().map(e => e.service), indexPatterns, isOverwriteAllChecked);
                    this.setState({
                        loadingMessage: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.confirmLegacyImport.retryingFailedObjectsLoadingMessage', { defaultMessage: 'Retrying failed objects…' }),
                    });
                    importCount += await resolve_saved_objects_1.saveObjects(failedImports.map(({ obj }) => obj), isOverwriteAllChecked);
                }
                catch (e) {
                    this.setState({
                        error: e.message,
                        status: 'error',
                        loadingMessage: undefined,
                    });
                    return;
                }
            }
            this.setState({ status: 'success', importCount });
        };
        this.onIndexChanged = (id, e) => {
            const value = e.target.value;
            this.setState(state => {
                const conflictIndex = state.unmatchedReferences?.findIndex(conflict => conflict.existingIndexPatternId === id);
                if (conflictIndex === undefined || conflictIndex === -1) {
                    return state;
                }
                return {
                    unmatchedReferences: [
                        ...state.unmatchedReferences.slice(0, conflictIndex),
                        {
                            ...state.unmatchedReferences[conflictIndex],
                            newIndexPatternId: value,
                        },
                        ...state.unmatchedReferences.slice(conflictIndex + 1),
                    ],
                };
            });
        };
        this.state = {
            conflictedIndexPatterns: undefined,
            conflictedSavedObjectsLinkedToSavedSearches: undefined,
            conflictedSearchDocs: undefined,
            unmatchedReferences: undefined,
            conflictingRecord: undefined,
            error: undefined,
            file: undefined,
            importCount: 0,
            indexPatterns: undefined,
            isOverwriteAllChecked: true,
            loadingMessage: undefined,
            isLegacyFile: false,
            status: 'idle',
        };
    }
    componentDidMount() {
        this.fetchIndexPatterns();
    }
    get hasUnmatchedReferences() {
        return this.state.unmatchedReferences && this.state.unmatchedReferences.length > 0;
    }
    get resolutions() {
        return this.state.unmatchedReferences.reduce((accum, { existingIndexPatternId, newIndexPatternId }) => {
            if (newIndexPatternId) {
                accum.push({
                    oldId: existingIndexPatternId,
                    newId: newIndexPatternId,
                });
            }
            return accum;
        }, []);
    }
    renderUnmatchedReferences() {
        const { unmatchedReferences } = this.state;
        if (!unmatchedReferences) {
            return null;
        }
        const columns = [
            {
                field: 'existingIndexPatternId',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.renderConflicts.columnIdName', { defaultMessage: 'ID' }),
                description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.renderConflicts.columnIdDescription', { defaultMessage: 'ID of the index pattern' }),
                sortable: true,
            },
            {
                field: 'list',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.renderConflicts.columnCountName', { defaultMessage: 'Count' }),
                description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.renderConflicts.columnCountDescription', { defaultMessage: 'How many affected objects' }),
                render: (list) => {
                    return react_1.default.createElement(react_1.Fragment, null, list.length);
                },
            },
            {
                field: 'list',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.renderConflicts.columnSampleOfAffectedObjectsName', { defaultMessage: 'Sample of affected objects' }),
                description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.renderConflicts.columnSampleOfAffectedObjectsDescription', { defaultMessage: 'Sample of affected objects' }),
                render: (list) => {
                    return (react_1.default.createElement("ul", { style: { listStyle: 'none' } }, lodash_1.take(list, 3).map((obj, key) => (react_1.default.createElement("li", { key: key }, obj.title)))));
                },
            },
            {
                field: 'existingIndexPatternId',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.renderConflicts.columnNewIndexPatternName', { defaultMessage: 'New index pattern' }),
                render: (id) => {
                    const options = this.state.indexPatterns.map(indexPattern => ({
                        text: indexPattern.title,
                        value: indexPattern.id,
                        'data-test-subj': `indexPatternOption-${indexPattern.title}`,
                    }));
                    options.unshift({
                        text: '-- Skip Import --',
                        value: '',
                    });
                    return (react_1.default.createElement(eui_1.EuiSelect, { "data-test-subj": `managementChangeIndexSelection-${id}`, onChange: e => this.onIndexChanged(id, e), options: options }));
                },
            },
        ];
        const pagination = {
            pageSizeOptions: [5, 10, 25],
        };
        return (react_1.default.createElement(eui_1.EuiInMemoryTable, { items: unmatchedReferences, columns: columns, pagination: pagination }));
    }
    renderError() {
        const { error, status } = this.state;
        if (status !== 'error') {
            return null;
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.errorCalloutTitle", defaultMessage: "Sorry, there was an error" }), color: "danger" },
                react_1.default.createElement("p", null, error)),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
    }
    renderBody() {
        const { status, loadingMessage, isOverwriteAllChecked, importCount, failedImports = [], isLegacyFile, } = this.state;
        if (status === 'loading') {
            return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceAround" },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiLoadingKibana, { size: "xl" }),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                    react_1.default.createElement(eui_1.EuiText, null,
                        react_1.default.createElement("p", null, loadingMessage)))));
        }
        // Kept backwards compatible logic
        if (failedImports.length &&
            (!this.hasUnmatchedReferences || (isLegacyFile === false && status === 'success'))) {
            return (react_1.default.createElement(eui_1.EuiCallOut, { "data-test-subj": "importSavedObjectsFailedWarning", title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importFailedTitle", defaultMessage: "Import failed" }), color: "warning", iconType: "help" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importFailedDescription", defaultMessage: "Failed to import {failedImportCount} of {totalImportCount} objects. Import failed", values: {
                            failedImportCount: failedImports.length,
                            totalImportCount: importCount + failedImports.length,
                        } })),
                react_1.default.createElement("p", null, failedImports
                    .map(({ error, obj }) => {
                    if (error.type === 'missing_references') {
                        return error.references.map(reference => {
                            return i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.importFailedMissingReference', {
                                defaultMessage: '{type} [id={id}] could not locate {refType} [id={refId}]',
                                values: {
                                    id: obj.id,
                                    type: obj.type,
                                    refId: reference.id,
                                    refType: reference.type,
                                },
                            });
                        });
                    }
                    else if (error.type === 'unsupported_type') {
                        return i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.importFailedUnsupportedType', {
                            defaultMessage: '{type} [id={id}] unsupported type',
                            values: {
                                id: obj.id,
                                type: obj.type,
                            },
                        });
                    }
                    return lodash_1.get(error, 'body.message', error.message ?? '');
                })
                    .join(' '))));
        }
        if (status === 'success') {
            if (importCount === 0) {
                return (react_1.default.createElement(eui_1.EuiCallOut, { "data-test-subj": "importSavedObjectsSuccessNoneImported", title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importSuccessfulCallout.noObjectsImportedTitle", defaultMessage: "No objects imported" }), color: "primary" }));
            }
            return (react_1.default.createElement(eui_1.EuiCallOut, { "data-test-subj": "importSavedObjectsSuccess", title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importSuccessfulTitle", defaultMessage: "Import successful" }), color: "success", iconType: "check" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importSuccessfulDescription", defaultMessage: "Successfully imported {importCount} objects.", values: { importCount } }))));
        }
        if (this.hasUnmatchedReferences) {
            return this.renderUnmatchedReferences();
        }
        return (react_1.default.createElement(eui_1.EuiForm, null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.selectFileToImportFormRowLabel", defaultMessage: "Please select a file to import" }) },
                react_1.default.createElement(eui_1.EuiFilePicker, { initialPromptText: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importPromptText", defaultMessage: "Import" }), onChange: this.setImportFile })),
            react_1.default.createElement(eui_1.EuiFormRow, null,
                react_1.default.createElement(eui_1.EuiSwitch, { name: "overwriteAll", label: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.overwriteSavedObjectsLabel", defaultMessage: "Automatically overwrite all saved objects?" }), "data-test-subj": "importSavedObjectsOverwriteToggle", checked: isOverwriteAllChecked, onChange: this.changeOverwriteAll }))));
    }
    renderFooter() {
        const { status } = this.state;
        const { done, close } = this.props;
        let confirmButton;
        if (status === 'success') {
            confirmButton = (react_1.default.createElement(eui_1.EuiButton, { onClick: done, size: "s", fill: true, "data-test-subj": "importSavedObjectsDoneBtn" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importSuccessful.confirmButtonLabel", defaultMessage: "Done" })));
        }
        else if (this.hasUnmatchedReferences) {
            confirmButton = (react_1.default.createElement(eui_1.EuiButton, { onClick: this.state.isLegacyFile ? this.confirmLegacyImport : this.resolveImportErrors, size: "s", fill: true, isLoading: status === 'loading', "data-test-subj": "importSavedObjectsConfirmBtn" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importSuccessful.confirmAllChangesButtonLabel", defaultMessage: "Confirm all changes" })));
        }
        else {
            confirmButton = (react_1.default.createElement(eui_1.EuiButton, { onClick: this.state.isLegacyFile ? this.legacyImport : this.import, size: "s", fill: true, isLoading: status === 'loading', "data-test-subj": "importSavedObjectsImportBtn" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.import.confirmButtonLabel", defaultMessage: "Import" })));
        }
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: close, size: "s" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.import.cancelButtonLabel", defaultMessage: "Cancel" }))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, confirmButton)));
    }
    renderSubheader() {
        if (this.state.status === 'loading' || this.state.status === 'success') {
            return null;
        }
        let legacyFileWarning;
        if (this.state.isLegacyFile) {
            legacyFileWarning = (react_1.default.createElement(eui_1.EuiCallOut, { "data-test-subj": "importSavedObjectsLegacyWarning", title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.legacyFileUsedTitle", defaultMessage: "Support for JSON files is going away" }), color: "warning", iconType: "help" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.legacyFileUsedBody", defaultMessage: "Use our updated export to generate NDJSON files, and you'll be all set." }))));
        }
        let indexPatternConflictsWarning;
        if (this.hasUnmatchedReferences) {
            indexPatternConflictsWarning = (react_1.default.createElement(eui_1.EuiCallOut, { "data-test-subj": "importSavedObjectsConflictsWarning", title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.indexPatternConflictsTitle", defaultMessage: "Index Pattern Conflicts" }), color: "warning", iconType: "help" },
                react_1.default.createElement("p", null,
                    react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.indexPatternConflictsDescription", defaultMessage: "The following saved objects use index patterns that do not exist.\n              Please select the index patterns you'd like re-associated with\n              them. You can {indexPatternLink} if necessary.", values: {
                            indexPatternLink: (react_1.default.createElement(eui_1.EuiLink, { href: this.props.newIndexPatternUrl },
                                react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.indexPatternConflictsCalloutLinkText", defaultMessage: "create a new index pattern" }))),
                        } }))));
        }
        if (!legacyFileWarning && !indexPatternConflictsWarning) {
            return null;
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            legacyFileWarning && (react_1.default.createElement("span", null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                legacyFileWarning)),
            indexPatternConflictsWarning && (react_1.default.createElement("span", null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                indexPatternConflictsWarning))));
    }
    overwriteConfirmed() {
        this.state.conflictingRecord.done(true);
    }
    overwriteSkipped() {
        this.state.conflictingRecord.done(false);
    }
    render() {
        const { close } = this.props;
        let confirmOverwriteModal;
        if (this.state.conflictingRecord) {
            confirmOverwriteModal = (react_1.default.createElement(eui_1.EuiOverlayMask, null,
                react_1.default.createElement(eui_1.EuiConfirmModal, { title: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.confirmOverwriteTitle', {
                        defaultMessage: 'Overwrite {type}?',
                        values: { type: this.state.conflictingRecord.type },
                    }), cancelButtonText: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.confirmOverwriteCancelButtonText', { defaultMessage: 'Cancel' }), confirmButtonText: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.flyout.confirmOverwriteOverwriteButtonText', { defaultMessage: 'Overwrite' }), buttonColor: "danger", onCancel: this.overwriteSkipped.bind(this), onConfirm: this.overwriteConfirmed.bind(this), defaultFocusedButton: eui_1.EUI_MODAL_CONFIRM_BUTTON },
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.confirmOverwriteBody", defaultMessage: "Are you sure you want to overwrite {title}?", values: {
                                title: this.state.conflictingRecord.title ||
                                    lib_1.getDefaultTitle(this.state.conflictingRecord),
                            } })))));
        }
        return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: close, size: "s" },
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.flyout.importSavedObjectTitle", defaultMessage: "Import saved objects" })))),
            react_1.default.createElement(eui_1.EuiFlyoutBody, null,
                this.renderSubheader(),
                this.renderError(),
                this.renderBody()),
            react_1.default.createElement(eui_1.EuiFlyoutFooter, null, this.renderFooter()),
            confirmOverwriteModal));
    }
}
exports.Flyout = Flyout;
