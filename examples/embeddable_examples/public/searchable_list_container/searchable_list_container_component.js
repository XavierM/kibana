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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const public_1 = require("../../../../src/plugins/embeddable/public");
function hasHasMatchOutput(output) {
    return output.hasMatch !== undefined;
}
class SearchableListContainerComponentInner extends react_1.Component {
    constructor(props) {
        super(props);
        this.subscriptions = {};
        this.updateSearch = (search) => {
            this.props.embeddable.updateInput({ search });
        };
        this.deleteChecked = () => {
            Object.values(this.props.input.panels).map(panel => {
                if (this.state.checked[panel.explicitInput.id]) {
                    this.props.embeddable.removeEmbeddable(panel.explicitInput.id);
                    this.subscriptions[panel.explicitInput.id].unsubscribe();
                }
            });
        };
        this.checkMatching = () => {
            const { input, embeddable } = this.props;
            const checked = {};
            Object.values(input.panels).map(panel => {
                const child = embeddable.getChild(panel.explicitInput.id);
                const output = child.getOutput();
                if (hasHasMatchOutput(output) && output.hasMatch) {
                    checked[panel.explicitInput.id] = true;
                }
            });
            this.setState({ checked });
        };
        this.toggleCheck = (isChecked, id) => {
            this.setState(prevState => ({ checked: { ...prevState.checked, [id]: isChecked } }));
        };
        const checked = {};
        const hasMatch = {};
        props.embeddable.getChildIds().forEach(id => {
            checked[id] = false;
            const output = props.embeddable.getChild(id).getOutput();
            hasMatch[id] = hasHasMatchOutput(output) && output.hasMatch;
        });
        props.embeddable.getChildIds().forEach(id => (checked[id] = false));
        this.state = {
            checked,
            hasMatch,
        };
    }
    componentDidMount() {
        this.props.embeddable.getChildIds().forEach(id => {
            this.subscriptions[id] = this.props.embeddable
                .getChild(id)
                .getOutput$()
                .subscribe(output => {
                if (hasHasMatchOutput(output)) {
                    this.setState(prevState => ({
                        hasMatch: {
                            ...prevState.hasMatch,
                            [id]: output.hasMatch,
                        },
                    }));
                }
            });
        });
    }
    componentWillUnmount() {
        Object.values(this.subscriptions).forEach(sub => sub.unsubscribe());
    }
    renderControls() {
        const { input } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "s" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiFormRow, { hasEmptyLabelSpace: true },
                    react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "deleteCheckedTodos", onClick: () => this.deleteChecked() }, "Delete checked"))),
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiFormRow, { hasEmptyLabelSpace: true },
                    react_1.default.createElement(eui_1.EuiButton, { "data-test-subj": "checkMatchingTodos", disabled: input.search === '', onClick: () => this.checkMatching() }, "Check matching"))),
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement(eui_1.EuiFormRow, { label: "Filter" },
                    react_1.default.createElement(eui_1.EuiFieldText, { "data-test-subj": "filterTodos", value: this.props.input.search || '', onChange: ev => this.updateSearch(ev.target.value) }))),
            react_1.default.createElement(eui_1.EuiFlexItem, null)));
    }
    render() {
        const { embeddable } = this.props;
        return (react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none" },
            react_1.default.createElement(eui_1.EuiFlexItem, null,
                react_1.default.createElement("h2", { "data-test-subj": "searchableListContainerTitle" }, embeddable.getTitle()),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
                this.renderControls(),
                react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
                this.renderList())));
    }
    renderList() {
        const { embeddableServices, input, embeddable } = this.props;
        let id = 0;
        const list = Object.values(input.panels).map(panel => {
            const childEmbeddable = embeddable.getChild(panel.explicitInput.id);
            id++;
            return childEmbeddable ? (react_1.default.createElement(eui_1.EuiPanel, { key: childEmbeddable.id },
                react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiCheckbox, { "data-test-subj": `todoCheckBox-${childEmbeddable.id}`, disabled: !childEmbeddable, id: childEmbeddable ? childEmbeddable.id : '', checked: this.state.checked[childEmbeddable.id], onChange: e => this.toggleCheck(e.target.checked, childEmbeddable.id) })),
                    react_1.default.createElement(eui_1.EuiFlexItem, null,
                        react_1.default.createElement(embeddableServices.EmbeddablePanel, { embeddable: childEmbeddable }))))) : (react_1.default.createElement(eui_1.EuiLoadingSpinner, { size: "l", key: id }));
        });
        return list;
    }
}
exports.SearchableListContainerComponentInner = SearchableListContainerComponentInner;
exports.SearchableListContainerComponent = public_1.withEmbeddableSubscription(SearchableListContainerComponentInner);
