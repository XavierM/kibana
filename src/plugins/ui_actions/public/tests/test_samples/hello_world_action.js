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
const eui_1 = require("@elastic/eui");
const actions_1 = require("../../actions");
const public_1 = require("../../../../kibana_react/public");
const ReactMenuItem = () => {
    return (react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center" },
        react_1.default.createElement(eui_1.EuiFlexItem, null, "Hello world!"),
        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiBadge, { color: 'danger' }, 'secret'))));
};
const UiMenuItem = public_1.reactToUiComponent(ReactMenuItem);
// Casting to ActionType is a hack - in a real situation use
// declare module and add this id to ActionContextMapping.
exports.ACTION_HELLO_WORLD = 'ACTION_HELLO_WORLD';
function createHelloWorldAction(overlays) {
    return actions_1.createAction({
        type: exports.ACTION_HELLO_WORLD,
        getIconType: () => 'lock',
        MenuItem: UiMenuItem,
        execute: async () => {
            const flyoutSession = overlays.openFlyout(public_1.toMountPoint(react_1.default.createElement(eui_1.EuiFlyout, { ownFocus: true, onClose: () => flyoutSession && flyoutSession.close() }, "Hello World, I am a hello world action!")), {
                'data-test-subj': 'helloWorldAction',
            });
        },
    });
}
exports.createHelloWorldAction = createHelloWorldAction;
