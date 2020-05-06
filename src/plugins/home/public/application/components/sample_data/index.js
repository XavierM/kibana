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
/*
 * The UI and related logic for the welcome screen that *should* show only
 * when it is enabled (the default) and there is no Kibana-consumed data
 * in Elasticsearch.
 */
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
function SampleDataCard({ urlBasePath, onDecline, onConfirm }) {
    return (react_1.default.createElement(eui_1.EuiCard, { image: `${urlBasePath}/plugins/kibana/home/assets/illustration_elastic_heart.png`, textAlign: "left", title: react_1.default.createElement(react_2.FormattedMessage, { id: "home.letsStartTitle", defaultMessage: "Let's get started" }), description: react_1.default.createElement(react_2.FormattedMessage, { id: "home.letsStartDescription", defaultMessage: "We noticed that you don't have any data in your cluster.\nYou can try our sample data and dashboards or jump in with your own data." }), footer: react_1.default.createElement("footer", null,
            react_1.default.createElement(eui_1.EuiButton, { fill: true, className: "homWelcome__footerAction", onClick: onConfirm },
                react_1.default.createElement(react_2.FormattedMessage, { id: "home.tryButtonLabel", defaultMessage: "Try our sample data" })),
            react_1.default.createElement(eui_1.EuiButtonEmpty, { className: "homWelcome__footerAction", onClick: onDecline, "data-test-subj": "skipWelcomeScreen" },
                react_1.default.createElement(react_2.FormattedMessage, { id: "home.exploreButtonLabel", defaultMessage: "Explore on my own" }))) }));
}
exports.SampleDataCard = SampleDataCard;
