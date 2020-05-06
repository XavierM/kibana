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
class Relationships extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            relationships: [],
            isLoading: false,
            error: undefined,
        };
    }
    UNSAFE_componentWillMount() {
        this.getRelationshipData();
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.savedObject.id !== this.props.savedObject.id) {
            this.getRelationshipData();
        }
    }
    async getRelationshipData() {
        const { savedObject, getRelationships } = this.props;
        this.setState({ isLoading: true });
        try {
            const relationships = await getRelationships(savedObject.type, savedObject.id);
            this.setState({ relationships, isLoading: false, error: undefined });
        }
        catch (err) {
            this.setState({ error: err.message, isLoading: false });
        }
    }
    renderError() {
        const { error } = this.state;
        if (!error) {
            return null;
        }
        return (react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.relationships.renderErrorMessage", defaultMessage: "Error" }), color: "danger" }, error));
    }
    renderRelationships() {
        const { goInspectObject, savedObject, basePath } = this.props;
        const { relationships, isLoading, error } = this.state;
        if (error) {
            return this.renderError();
        }
        if (isLoading) {
            return react_1.default.createElement(eui_1.EuiLoadingKibana, { size: "xl" });
        }
        const columns = [
            {
                field: 'type',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnTypeName', {
                    defaultMessage: 'Type',
                }),
                width: '50px',
                align: 'center',
                description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnTypeDescription', { defaultMessage: 'Type of the saved object' }),
                sortable: false,
                render: (type, object) => {
                    return (react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: lib_1.getSavedObjectLabel(type) },
                        react_1.default.createElement(eui_1.EuiIcon, { "aria-label": lib_1.getSavedObjectLabel(type), type: object.meta.icon || 'apps', size: "s", "data-test-subj": "relationshipsObjectType" })));
                },
            },
            {
                field: 'relationship',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnRelationshipName', { defaultMessage: 'Direct relationship' }),
                dataType: 'string',
                sortable: false,
                width: '125px',
                'data-test-subj': 'directRelationship',
                render: (relationship) => {
                    if (relationship === 'parent') {
                        return (react_1.default.createElement(eui_1.EuiText, { size: "s" },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.relationships.columnRelationship.parentAsValue", defaultMessage: "Parent" })));
                    }
                    if (relationship === 'child') {
                        return (react_1.default.createElement(eui_1.EuiText, { size: "s" },
                            react_1.default.createElement(react_2.FormattedMessage, { id: "savedObjectsManagement.objectsTable.relationships.columnRelationship.childAsValue", defaultMessage: "Child" })));
                    }
                },
            },
            {
                field: 'meta.title',
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnTitleName', {
                    defaultMessage: 'Title',
                }),
                description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnTitleDescription', { defaultMessage: 'Title of the saved object' }),
                dataType: 'string',
                sortable: false,
                render: (title, object) => {
                    const { path = '' } = object.meta.inAppUrl || {};
                    const canGoInApp = this.props.canGoInApp(object);
                    if (!canGoInApp) {
                        return (react_1.default.createElement(eui_1.EuiText, { size: "s", "data-test-subj": "relationshipsTitle" }, title || lib_1.getDefaultTitle(object)));
                    }
                    return (react_1.default.createElement(eui_1.EuiLink, { href: basePath.prepend(path), "data-test-subj": "relationshipsTitle" }, title || lib_1.getDefaultTitle(object)));
                },
            },
            {
                name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnActionsName', { defaultMessage: 'Actions' }),
                actions: [
                    {
                        name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnActions.inspectActionName', { defaultMessage: 'Inspect' }),
                        description: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.columnActions.inspectActionDescription', { defaultMessage: 'Inspect this saved object' }),
                        type: 'icon',
                        icon: 'inspect',
                        'data-test-subj': 'relationshipsTableAction-inspect',
                        onClick: (object) => goInspectObject(object),
                        available: (object) => !!object.meta.editUrl,
                    },
                ],
            },
        ];
        const filterTypesMap = new Map(relationships.map(relationship => [
            relationship.type,
            {
                value: relationship.type,
                name: relationship.type,
                view: relationship.type,
            },
        ]));
        const search = {
            filters: [
                {
                    type: 'field_value_selection',
                    field: 'relationship',
                    name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.search.filters.relationship.name', { defaultMessage: 'Direct relationship' }),
                    multiSelect: 'or',
                    options: [
                        {
                            value: 'parent',
                            name: 'parent',
                            view: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.search.filters.relationship.parentAsValue.view', { defaultMessage: 'Parent' }),
                        },
                        {
                            value: 'child',
                            name: 'child',
                            view: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.search.filters.relationship.childAsValue.view', { defaultMessage: 'Child' }),
                        },
                    ],
                },
                {
                    type: 'field_value_selection',
                    field: 'type',
                    name: i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.search.filters.type.name', { defaultMessage: 'Type' }),
                    multiSelect: 'or',
                    options: [...filterTypesMap.values()],
                },
            ],
        };
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiCallOut, null,
                react_1.default.createElement("p", null, i18n_1.i18n.translate('savedObjectsManagement.objectsTable.relationships.relationshipsTitle', {
                    defaultMessage: 'Here are the saved objects related to {title}. ' +
                        'Deleting this {type} affects its parent objects, but not its children.',
                    values: {
                        type: savedObject.type,
                        title: savedObject.meta.title || lib_1.getDefaultTitle(savedObject),
                    },
                }))),
            react_1.default.createElement(eui_1.EuiSpacer, null),
            react_1.default.createElement(eui_1.EuiInMemoryTable, { items: relationships, columns: columns, pagination: true, search: search, rowProps: () => ({
                    'data-test-subj': `relationshipsTableRow`,
                }) })));
    }
    render() {
        const { close, savedObject } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: close },
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement(eui_1.EuiToolTip, { position: "top", content: lib_1.getSavedObjectLabel(savedObject.type) },
                            react_1.default.createElement(eui_1.EuiIcon, { "aria-label": lib_1.getSavedObjectLabel(savedObject.type), size: "m", type: savedObject.meta.icon || 'apps' })),
                        "\u00A0\u00A0",
                        savedObject.meta.title || lib_1.getDefaultTitle(savedObject)))),
            react_1.default.createElement(eui_1.EuiFlyoutBody, null, this.renderRelationships())));
    }
}
exports.Relationships = Relationships;
