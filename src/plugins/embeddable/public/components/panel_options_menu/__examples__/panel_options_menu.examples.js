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
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@storybook/react");
const addon_actions_1 = require("@storybook/addon-actions");
const addon_knobs_1 = require("@storybook/addon-knobs");
const __1 = require("..");
const euiContextDescriptors = {
    id: 'mainMenu',
    title: 'Options',
    items: [
        {
            name: 'Inspect',
            icon: 'inspect',
            onClick: addon_actions_1.action('onClick(inspect)'),
        },
        {
            name: 'Full screen',
            icon: 'expand',
            onClick: addon_actions_1.action('onClick(expand)'),
        },
    ],
};
react_1.storiesOf('components/PanelOptionsMenu', module)
    .addDecorator(addon_knobs_1.withKnobs)
    .add('default', () => {
    const isViewMode = addon_knobs_1.boolean('isViewMode', false);
    return (React.createElement("div", { style: { height: 150 } },
        React.createElement(__1.PanelOptionsMenu, { panelDescriptor: euiContextDescriptors, isViewMode: isViewMode })));
});
