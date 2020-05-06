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
const eui_1 = require("@elastic/eui");
const components_1 = require("./components");
const lib_1 = require("../../lib");
class SavedObjectEdition extends react_1.Component {
    constructor(props) {
        super(props);
        this.saveChanges = async ({ attributes, references }) => {
            const { savedObjectsClient, notifications } = this.props;
            const { object, type } = this.state;
            await savedObjectsClient.update(object.type, object.id, attributes, { references });
            notifications.toasts.addSuccess(`Updated '${attributes.title}' ${type} object`);
            this.redirectToListing();
        };
        const { serviceRegistry, serviceName } = props;
        const type = serviceRegistry.get(serviceName).service.type;
        this.state = {
            object: undefined,
            type,
        };
    }
    componentDidMount() {
        const { id, savedObjectsClient } = this.props;
        const { type } = this.state;
        savedObjectsClient.get(type, id).then(object => {
            this.setState({
                object,
            });
        });
    }
    render() {
        const { capabilities, notFoundType, serviceRegistry, id, serviceName, savedObjectsClient, } = this.props;
        const { type } = this.state;
        const { object } = this.state;
        const { edit: canEdit, delete: canDelete } = capabilities.savedObjectsManagement;
        const canView = lib_1.canViewInApp(capabilities, type);
        const service = serviceRegistry.get(serviceName).service;
        return (react_1.default.createElement(eui_1.EuiPageContent, { horizontalPosition: "center", "data-test-subj": "savedObjectsEdit" },
            react_1.default.createElement(components_1.Header, { canEdit: canEdit, canDelete: canDelete, canViewInApp: canView, type: type, onDeleteClick: () => this.delete(), viewUrl: service.urlFor(id) }),
            notFoundType && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                react_1.default.createElement(components_1.NotFoundErrors, { type: notFoundType }))),
            canEdit && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
                react_1.default.createElement(components_1.Intro, null))),
            object && (react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                react_1.default.createElement(components_1.Form, { object: object, savedObjectsClient: savedObjectsClient, service: service, editionEnabled: canEdit, onSave: this.saveChanges })))));
    }
    async delete() {
        const { id, savedObjectsClient, overlays, notifications } = this.props;
        const { type, object } = this.state;
        const confirmed = await overlays.openConfirm(i18n_1.i18n.translate('savedObjectsManagement.deleteConfirm.modalDescription', {
            defaultMessage: 'This action permanently removes the object from Kibana.',
        }), {
            confirmButtonText: i18n_1.i18n.translate('savedObjectsManagement.deleteConfirm.modalDeleteButtonLabel', {
                defaultMessage: 'Delete',
            }),
            title: i18n_1.i18n.translate('savedObjectsManagement.deleteConfirm.modalTitle', {
                defaultMessage: `Delete '{title}'?`,
                values: {
                    title: object?.attributes?.title || 'saved Kibana object',
                },
            }),
            buttonColor: 'danger',
        });
        if (confirmed) {
            await savedObjectsClient.delete(type, id);
            notifications.toasts.addSuccess(`Deleted '${object.attributes.title}' ${type} object`);
            this.redirectToListing();
        }
    }
    redirectToListing() {
        window.location.hash = '/management/kibana/objects';
    }
}
exports.SavedObjectEdition = SavedObjectEdition;
