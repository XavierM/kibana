"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const flyout_list_1 = require("./flyout_list");
exports.NewsfeedContext = react_1.default.createContext({});
exports.NewsfeedNavButton = ({ apiFetchResult }) => {
    const [showBadge, setShowBadge] = react_1.useState(false);
    const [flyoutVisible, setFlyoutVisible] = react_1.useState(false);
    const [newsFetchResult, setNewsFetchResult] = react_1.useState(null);
    react_1.useEffect(() => {
        function handleStatusChange(fetchResult) {
            if (fetchResult) {
                setShowBadge(fetchResult.hasNew);
            }
            setNewsFetchResult(fetchResult);
        }
        const subscription = apiFetchResult.subscribe(res => handleStatusChange(res));
        return () => subscription.unsubscribe();
    }, [apiFetchResult]);
    function showFlyout() {
        setShowBadge(false);
        setFlyoutVisible(!flyoutVisible);
    }
    return (react_1.default.createElement(exports.NewsfeedContext.Provider, { value: { setFlyoutVisible, newsFetchResult } },
        react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiHeaderSectionItemButton, { "data-test-subj": "newsfeed", "aria-controls": "keyPadMenu", "aria-expanded": flyoutVisible, "aria-haspopup": "true", "aria-label": "Newsfeed\u00A0menu", onClick: showFlyout },
                react_1.default.createElement(eui_1.EuiIcon, { type: "email", size: "m" }),
                showBadge ? (react_1.default.createElement(eui_1.EuiNotificationBadge, { className: "euiHeaderNotification", "data-test-subj": "showBadgeNews" }, "\u25AA")) : null),
            flyoutVisible ? react_1.default.createElement(flyout_list_1.NewsfeedFlyout, null) : null)));
};
