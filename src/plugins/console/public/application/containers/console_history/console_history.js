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
const lodash_1 = require("lodash");
const moment_1 = tslib_1.__importDefault(require("moment"));
const eui_1 = require("@elastic/eui");
const contexts_1 = require("../../contexts");
const history_viewer_1 = require("./history_viewer");
const editor_context_1 = require("../../contexts/editor_context");
const hooks_1 = require("../../hooks");
const CHILD_ELEMENT_PREFIX = 'historyReq';
function ConsoleHistory({ close }) {
    const { services: { history }, } = contexts_1.useServicesContext();
    const { settings: readOnlySettings } = editor_context_1.useEditorReadContext();
    const [requests, setPastRequests] = react_1.useState(history.getHistory());
    const clearHistory = react_1.useCallback(() => {
        history.clearHistory();
        setPastRequests(history.getHistory());
    }, [history]);
    const listRef = react_1.useRef(null);
    const [viewingReq, setViewingReq] = react_1.useState(null);
    const [selectedIndex, setSelectedIndex] = react_1.useState(0);
    const selectedReq = react_1.useRef(null);
    const describeReq = react_1.useMemo(() => {
        const _describeReq = (req) => {
            const endpoint = req.endpoint;
            const date = moment_1.default(req.time);
            let formattedDate = date.format('MMM D');
            if (date.diff(moment_1.default(), 'days') > -7) {
                formattedDate = date.fromNow();
            }
            return `${endpoint} (${formattedDate})`;
        };
        _describeReq.cache = new WeakMap();
        return lodash_1.memoize(_describeReq);
    }, []);
    const scrollIntoView = react_1.useCallback((idx) => {
        const activeDescendant = listRef.current.querySelector(`#${CHILD_ELEMENT_PREFIX}${idx}`);
        if (activeDescendant) {
            activeDescendant.scrollIntoView();
        }
    }, []);
    const initialize = react_1.useCallback(() => {
        const nextSelectedIndex = 0;
        describeReq.cache = new WeakMap();
        setViewingReq(requests[nextSelectedIndex]);
        selectedReq.current = requests[nextSelectedIndex];
        setSelectedIndex(nextSelectedIndex);
        scrollIntoView(nextSelectedIndex);
    }, [describeReq, requests, scrollIntoView]);
    const clear = () => {
        clearHistory();
        initialize();
    };
    const restoreRequestFromHistory = hooks_1.useRestoreRequestFromHistory();
    react_1.useEffect(() => {
        initialize();
    }, [initialize]);
    react_1.useEffect(() => {
        const done = history.change(setPastRequests);
        return () => done();
    }, [history]);
    /* eslint-disable */
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("div", { className: "conHistory" },
            react_1.default.createElement(eui_1.EuiTitle, { size: "s" },
                react_1.default.createElement("h2", null, i18n_1.i18n.translate('console.historyPage.pageTitle', { defaultMessage: 'History' }))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement("div", { className: "conHistory__body" },
                react_1.default.createElement("ul", { ref: listRef, onKeyDown: (ev) => {
                        if (ev.keyCode === eui_1.keyCodes.ENTER) {
                            restoreRequestFromHistory(selectedReq.current);
                            return;
                        }
                        let currentIdx = selectedIndex;
                        if (ev.keyCode === eui_1.keyCodes.UP) {
                            ev.preventDefault();
                            --currentIdx;
                        }
                        else if (ev.keyCode === eui_1.keyCodes.DOWN) {
                            ev.preventDefault();
                            ++currentIdx;
                        }
                        const nextSelectedIndex = Math.min(Math.max(0, currentIdx), requests.length - 1);
                        setViewingReq(requests[nextSelectedIndex]);
                        selectedReq.current = requests[nextSelectedIndex];
                        setSelectedIndex(nextSelectedIndex);
                        scrollIntoView(nextSelectedIndex);
                    }, role: "listbox", className: "list-group conHistory__reqs", tabIndex: 0, "aria-activedescendant": `${CHILD_ELEMENT_PREFIX}${selectedIndex}`, "aria-label": i18n_1.i18n.translate('console.historyPage.requestListAriaLabel', {
                        defaultMessage: 'History of sent requests',
                    }) }, requests.map((req, idx) => {
                    const reqDescription = describeReq(req);
                    const isSelected = viewingReq === req;
                    return (
                    // Ignore a11y issues on li's
                    // eslint-disable-next-line
                    react_1.default.createElement("li", { key: idx, id: `${CHILD_ELEMENT_PREFIX}${idx}`, className: `list-group-item conHistory__req ${isSelected ? 'conHistory__req-selected' : ''}`, onClick: () => {
                            setViewingReq(req);
                            selectedReq.current = req;
                            setSelectedIndex(idx);
                        }, role: "option", onMouseEnter: () => setViewingReq(req), onMouseLeave: () => setViewingReq(selectedReq.current), onDoubleClick: () => restoreRequestFromHistory(selectedReq.current), "aria-label": i18n_1.i18n.translate('console.historyPage.itemOfRequestListAriaLabel', {
                            defaultMessage: 'Request: {historyItem}',
                            values: { historyItem: reqDescription },
                        }), "aria-selected": isSelected },
                        reqDescription,
                        react_1.default.createElement("span", { className: "conHistory__reqIcon" },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "arrowRight" }))));
                })),
                react_1.default.createElement("div", { className: "conHistory__body__spacer" }),
                react_1.default.createElement(history_viewer_1.HistoryViewer, { settings: readOnlySettings, req: viewingReq })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "center" },
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "danger", onClick: () => clear() }, i18n_1.i18n.translate('console.historyPage.clearHistoryButtonLabel', {
                        defaultMessage: 'Clear',
                    }))),
                react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd", alignItems: "center" },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButtonEmpty, { color: "primary", onClick: () => close() }, i18n_1.i18n.translate('console.historyPage.closehistoryButtonLabel', {
                                defaultMessage: 'Close',
                            }))),
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiButton, { color: "primary", disabled: !selectedReq, onClick: () => restoreRequestFromHistory(selectedReq.current) }, i18n_1.i18n.translate('console.historyPage.applyHistoryButtonLabel', {
                                defaultMessage: 'Apply',
                            }))))))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
}
exports.ConsoleHistory = ConsoleHistory;
