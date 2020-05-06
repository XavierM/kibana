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
const i18n_1 = require("@kbn/i18n");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
class ReplacePanelFlyout extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.lastToast = {
            id: 'panelReplaceToast',
        };
        this.showToast = (name) => {
            // To avoid the clutter of having toast messages cover flyout
            // close previous toast message before creating a new one
            if (this.lastToast) {
                this.props.notifications.toasts.remove(this.lastToast);
            }
            this.lastToast = this.props.notifications.toasts.addSuccess({
                title: i18n_1.i18n.translate('dashboard.addPanel.savedObjectAddedToContainerSuccessMessageTitle', {
                    defaultMessage: '{savedObjectName} was added',
                    values: {
                        savedObjectName: name,
                    },
                }),
                'data-test-subj': 'addObjectToContainerSuccess',
            });
        };
        this.onReplacePanel = async (savedObjectId, type, name) => {
            const originalPanels = this.props.container.getInput().panels;
            const filteredPanels = { ...originalPanels };
            const nnw = filteredPanels[this.props.panelToRemove.id].gridData.w;
            const nnh = filteredPanels[this.props.panelToRemove.id].gridData.h;
            const nnx = filteredPanels[this.props.panelToRemove.id].gridData.x;
            const nny = filteredPanels[this.props.panelToRemove.id].gridData.y;
            // add the new view
            const newObj = await this.props.container.addNewEmbeddable(type, {
                savedObjectId,
            });
            const finalPanels = _.cloneDeep(this.props.container.getInput().panels);
            finalPanels[newObj.id].gridData.w = nnw;
            finalPanels[newObj.id].gridData.h = nnh;
            finalPanels[newObj.id].gridData.x = nnx;
            finalPanels[newObj.id].gridData.y = nny;
            // delete the old view
            delete finalPanels[this.props.panelToRemove.id];
            // apply changes
            this.props.container.updateInput({ panels: finalPanels });
            this.props.container.reload();
            this.showToast(name);
            this.props.onClose();
        };
    }
    render() {
        const SavedObjectFinder = this.props.savedObjectsFinder;
        const savedObjectsFinder = (react_1.default.createElement(SavedObjectFinder, { noItemsMessage: i18n_1.i18n.translate('dashboard.addPanel.noMatchingObjectsMessage', {
                defaultMessage: 'No matching objects found.',
            }), savedObjectMetaData: [...this.props.getEmbeddableFactories()]
                .filter(embeddableFactory => Boolean(embeddableFactory.savedObjectMetaData) && !embeddableFactory.isContainerType)
                .map(({ savedObjectMetaData }) => savedObjectMetaData), showFilter: true, onChoose: this.onReplacePanel }));
        const panelToReplace = 'Replace panel ' + this.props.panelToRemove.getTitle() + ' with:';
        return (react_1.default.createElement(eui_1.EuiFlyout, { ownFocus: true, onClose: this.props.onClose, "data-test-subj": "dashboardReplacePanel" },
            react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
                react_1.default.createElement(eui_1.EuiTitle, { size: "m" },
                    react_1.default.createElement("h2", null,
                        react_1.default.createElement("span", null, panelToReplace)))),
            react_1.default.createElement(eui_1.EuiFlyoutBody, null, savedObjectsFinder)));
    }
}
exports.ReplacePanelFlyout = ReplacePanelFlyout;
