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
const i18n_1 = require("@kbn/i18n");
const options_1 = require("../components/options");
const common_1 = require("../components/common");
function getAreaOptionTabs() {
    return [
        {
            name: 'advanced',
            title: i18n_1.i18n.translate('visTypeVislib.area.tabs.metricsAxesTitle', {
                defaultMessage: 'Metrics & axes',
            }),
            editor: (props) => (react_1.default.createElement(common_1.ValidationWrapper, Object.assign({}, props, { component: options_1.MetricsAxisOptions }))),
        },
        {
            name: 'options',
            title: i18n_1.i18n.translate('visTypeVislib.area.tabs.panelSettingsTitle', {
                defaultMessage: 'Panel settings',
            }),
            editor: (props) => (react_1.default.createElement(common_1.ValidationWrapper, Object.assign({}, props, { component: options_1.PointSeriesOptions }))),
        },
    ];
}
exports.getAreaOptionTabs = getAreaOptionTabs;
const countLabel = i18n_1.i18n.translate('visTypeVislib.area.countText', {
    defaultMessage: 'Count',
});
exports.countLabel = countLabel;
