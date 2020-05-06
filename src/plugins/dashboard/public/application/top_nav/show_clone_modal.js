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
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const clone_modal_1 = require("./clone_modal");
function showCloneModal(onClone, title) {
    const container = document.createElement('div');
    const closeModal = () => {
        react_dom_1.default.unmountComponentAtNode(container);
        document.body.removeChild(container);
    };
    const onCloneConfirmed = async (newTitle, isTitleDuplicateConfirmed, onTitleDuplicate) => {
        onClone(newTitle, isTitleDuplicateConfirmed, onTitleDuplicate).then((response) => {
            // The only time you don't want to close the modal is if it's asking you
            // to confirm a duplicate title, in which case there will be no error and no id.
            if (response.error || response.id) {
                closeModal();
            }
        });
    };
    document.body.appendChild(container);
    const element = (react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(clone_modal_1.DashboardCloneModal, { onClone: onCloneConfirmed, onClose: closeModal, title: i18n_1.i18n.translate('dashboard.topNav.showCloneModal.dashboardCopyTitle', {
                defaultMessage: '{title} Copy',
                values: { title },
            }) })));
    react_dom_1.default.render(element, container);
}
exports.showCloneModal = showCloneModal;
