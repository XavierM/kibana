"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const header_alert_1 = require("../../../../legacy/core_plugins/newsfeed/public/np_ready/components/header_alert/header_alert");
const newsfeed_header_nav_button_1 = require("./newsfeed_header_nav_button");
const empty_news_1 = require("./empty_news");
const loading_news_1 = require("./loading_news");
exports.NewsfeedFlyout = () => {
    const { newsFetchResult, setFlyoutVisible } = react_1.useContext(newsfeed_header_nav_button_1.NewsfeedContext);
    const closeFlyout = react_1.useCallback(() => setFlyoutVisible(false), [setFlyoutVisible]);
    return (react_1.default.createElement(eui_1.EuiFlyout, { onClose: closeFlyout, size: "s", "aria-labelledby": "flyoutSmallTitle", className: "kbnNews__flyout", "data-test-subj": "NewsfeedFlyout" },
        react_1.default.createElement(eui_1.EuiFlyoutHeader, { hasBorder: true },
            react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                react_1.default.createElement("h2", { id: "flyoutSmallTitle" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "newsfeed.flyoutList.whatsNewTitle", defaultMessage: "What's new at Elastic" })))),
        react_1.default.createElement(eui_1.EuiFlyoutBody, { className: 'kbnNews__flyoutAlerts' }, !newsFetchResult ? (react_1.default.createElement(loading_news_1.NewsLoadingPrompt, null)) : newsFetchResult.feedItems.length > 0 ? (newsFetchResult.feedItems.map((item) => {
            return (react_1.default.createElement(header_alert_1.EuiHeaderAlert, { key: item.hash, title: item.title, text: item.description, "data-test-subj": "newsHeadAlert", action: react_1.default.createElement(eui_1.EuiLink, { target: "_blank", href: item.linkUrl, external: true }, item.linkText), date: item.publishOn.format('DD MMMM YYYY'), badge: item.badge ? react_1.default.createElement(eui_1.EuiBadge, { color: "hollow" }, item.badge) : undefined }));
        })) : (react_1.default.createElement(empty_news_1.NewsEmptyPrompt, null))),
        react_1.default.createElement(eui_1.EuiFlyoutFooter, null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "center" },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { iconType: "cross", onClick: closeFlyout, flush: "left" },
                        react_1.default.createElement(react_2.FormattedMessage, { id: "newsfeed.flyoutList.closeButtonLabel", defaultMessage: "Close" }))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false }, newsFetchResult ? (react_1.default.createElement(eui_1.EuiText, { color: "subdued", size: "s" },
                    react_1.default.createElement("p", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "newsfeed.flyoutList.versionTextLabel", defaultMessage: "{version}", values: { version: `Version ${newsFetchResult.kibanaVersion}` } })))) : null)))));
};
