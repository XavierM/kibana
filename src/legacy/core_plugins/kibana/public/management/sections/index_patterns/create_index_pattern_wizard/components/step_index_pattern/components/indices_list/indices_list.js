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
const eui_2 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const constants_1 = require("../../../../constants");
class IndicesList extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.resetPageTo0 = () => this.onChangePage(0);
        this.onChangePage = (page) => {
            this.pager.goToPageIndex(page);
            this.setState({ page });
        };
        this.onChangePerPage = (perPage) => {
            this.pager.setItemsPerPage(perPage);
            this.setState({ perPage });
            this.resetPageTo0();
            this.closePerPageControl();
        };
        this.openPerPageControl = () => {
            this.setState({ isPerPageControlOpen: true });
        };
        this.closePerPageControl = () => {
            this.setState({ isPerPageControlOpen: false });
        };
        this.state = {
            page: 0,
            perPage: constants_1.PER_PAGE_INCREMENTS[1],
            isPerPageControlOpen: false,
        };
        this.pager = new eui_2.Pager(props.indices.length, this.state.perPage, this.state.page);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.indices.length !== this.props.indices.length) {
            this.pager.setTotalItems(nextProps.indices.length);
            this.resetPageTo0();
        }
    }
    renderPagination() {
        const { perPage, page, isPerPageControlOpen } = this.state;
        const button = (react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "s", color: "text", iconType: "arrowDown", iconSide: "right", onClick: this.openPerPageControl },
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.pagingLabel", defaultMessage: "Rows per page: {perPage}", values: { perPage } })));
        const items = constants_1.PER_PAGE_INCREMENTS.map(increment => {
            return (react_1.default.createElement(eui_1.EuiContextMenuItem, { key: increment, icon: "empty", onClick: () => this.onChangePerPage(increment) }, increment));
        });
        const pageCount = this.pager.getTotalPages();
        const paginationControls = pageCount > 1 ? (react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
            react_1.default.createElement(eui_1.EuiPagination, { pageCount: pageCount, activePage: page, onPageClick: this.onChangePage }))) : null;
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween", alignItems: "center" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiPopover, { id: "customizablePagination", button: button, isOpen: isPerPageControlOpen, closePopover: this.closePerPageControl, panelPaddingSize: "none", withTitle: true },
                    react_1.default.createElement(eui_1.EuiContextMenuPanel, { items: items }))),
            paginationControls));
    }
    highlightIndexName(indexName, query) {
        const queryIdx = indexName.indexOf(query);
        if (!query || queryIdx === -1) {
            return indexName;
        }
        const preStr = indexName.substr(0, queryIdx);
        const postStr = indexName.substr(queryIdx + query.length);
        return (react_1.default.createElement("span", null,
            preStr,
            react_1.default.createElement("strong", null, query),
            postStr));
    }
    render() {
        const { indices, query, ...rest } = this.props;
        const queryWithoutWildcard = query.endsWith('*') ? query.substr(0, query.length - 1) : query;
        const paginatedIndices = indices.slice(this.pager.firstItemIndex, this.pager.lastItemIndex + 1);
        const rows = paginatedIndices.map((index, key) => {
            return (react_1.default.createElement(eui_1.EuiTableRow, { key: key },
                react_1.default.createElement(eui_1.EuiTableRowCell, null, this.highlightIndexName(index.name, queryWithoutWildcard)),
                react_1.default.createElement(eui_1.EuiTableRowCell, null, index.tags.map((tag) => {
                    return (react_1.default.createElement(eui_1.EuiBadge, { key: `index_${key}_tag_${tag.key}`, color: "primary" }, tag.name));
                }))));
        });
        return (react_1.default.createElement("div", Object.assign({}, rest),
            react_1.default.createElement(eui_1.EuiTable, null,
                react_1.default.createElement(eui_1.EuiTableBody, null, rows)),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            this.renderPagination()));
    }
}
exports.IndicesList = IndicesList;
