"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const ui_actions_1 = require("../../ui_actions");
const public_1 = require("../../../../../kibana_react/public");
const get_message_modal_1 = require("./get_message_modal");
const say_hello_action_1 = require("./say_hello_action");
// Casting to ActionType is a hack - in a real situation use
// declare module and add this id to ActionContextMapping.
exports.ACTION_SEND_MESSAGE = 'ACTION_SEND_MESSAGE';
const isCompatible = async (context) => say_hello_action_1.hasFullNameOutput(context.embeddable);
function createSendMessageAction(overlays) {
    const sendMessage = async (context, message) => {
        const greeting = `Hello, ${context.embeddable.getOutput().fullName}`;
        const content = message ? `${greeting}. ${message}` : greeting;
        overlays.openFlyout(public_1.toMountPoint(react_1.default.createElement(eui_1.EuiFlyoutBody, null, content)));
    };
    return ui_actions_1.createAction({
        type: exports.ACTION_SEND_MESSAGE,
        getDisplayName: () => 'Send message',
        isCompatible,
        execute: async (context) => {
            if (!(await isCompatible(context))) {
                throw new ui_actions_1.IncompatibleActionError();
            }
            const modal = overlays.openModal(public_1.toMountPoint(react_1.default.createElement(get_message_modal_1.GetMessageModal, { onCancel: () => modal.close(), onDone: message => {
                    modal.close();
                    sendMessage(context, message);
                } })));
        },
    });
}
exports.createSendMessageAction = createSendMessageAction;
