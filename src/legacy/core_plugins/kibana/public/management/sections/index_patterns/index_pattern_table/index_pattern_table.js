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
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const react_2 = tslib_1.__importDefault(require("react"));
const create_button_1 = require("../create_button");
const create_index_pattern_prompt_1 = require("../create_index_pattern_prompt");
const columns = [
    {
        field: 'title',
        name: 'Pattern',
        render: (name, index) => (react_2.default.createElement(eui_1.EuiButtonEmpty, { size: "xs", href: `#/management/kibana/index_patterns/${index.id}` },
            name,
            index.tags &&
                index.tags.map(({ key: tagKey, name: tagName }) => (react_2.default.createElement(eui_1.EuiBadge, { className: "indexPatternList__badge", key: tagKey }, tagName))))),
        dataType: 'string',
        sortable: ({ sort }) => sort,
    },
];
const pagination = {
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
};
const sorting = {
    sort: {
        field: 'title',
        direction: 'asc',
    },
};
const search = {
    box: {
        incremental: true,
        schema: {
            fields: { title: { type: 'string' } },
        },
    },
};
class IndexPatternTable extends react_2.default.Component {
    constructor() {
        super(...arguments);
        this.state = {
            showFlyout: this.props.indexPatterns.length === 0,
        };
    }
    render() {
        return (react_2.default.createElement(eui_1.EuiPanel, { paddingSize: "l", "data-test-subj": "indexPatternTable" },
            this.state.showFlyout && (react_2.default.createElement(create_index_pattern_prompt_1.CreateIndexPatternPrompt, { onClose: () => this.setState({ showFlyout: false }) })),
            react_2.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "spaceBetween" },
                react_2.default.createElement(eui_1.EuiFlexItem, { grow: false, className: "euiIEFlexWrapFix" },
                    react_2.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center", gutterSize: "s" },
                        react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_2.default.createElement(eui_1.EuiText, null,
                                react_2.default.createElement("h2", null,
                                    react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternTable.title", defaultMessage: "Index patterns" })))),
                        react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_2.default.createElement(eui_1.EuiButtonIcon, { iconSize: "l", iconType: "questionInCircle", onClick: () => this.setState({ showFlyout: true }), "aria-label": "Help" })))),
                react_2.default.createElement(eui_1.EuiFlexItem, { grow: false },
                    react_2.default.createElement(create_button_1.CreateButton, { options: this.props.indexPatternCreationOptions },
                        react_2.default.createElement(react_1.FormattedMessage, { id: "kbn.management.indexPatternTable.createBtn", defaultMessage: "Create index pattern" })))),
            react_2.default.createElement(eui_1.EuiSpacer, null),
            react_2.default.createElement(eui_1.EuiInMemoryTable, { allowNeutralSort: false, itemId: "id", isSelectable: false, items: this.props.indexPatterns, columns: columns, pagination: pagination, sorting: sorting, search: search })));
    }
}
exports.IndexPatternTable = IndexPatternTable;
