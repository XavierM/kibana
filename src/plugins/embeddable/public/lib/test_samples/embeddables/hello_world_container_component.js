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
const __1 = require("../..");
class HelloWorldContainerComponent extends react_1.Component {
    constructor(props) {
        super(props);
        this.roots = {};
        this.mounted = false;
        Object.values(this.props.container.getInput().panels).forEach(panelState => {
            this.roots[panelState.explicitInput.id] = react_1.default.createRef();
        });
        this.state = {
            loaded: this.props.container.getOutput().embeddableLoaded,
            panels: this.props.container.getInput().panels,
        };
    }
    async componentDidMount() {
        this.mounted = true;
        this.inputSubscription = this.props.container.getInput$().subscribe(() => {
            if (this.mounted) {
                this.setState({ panels: this.props.container.getInput().panels });
            }
        });
        this.outputSubscription = this.props.container.getOutput$().subscribe(() => {
            if (this.mounted) {
                this.setState({ loaded: this.props.container.getOutput().embeddableLoaded });
            }
        });
    }
    componentWillUnmount() {
        this.mounted = false;
        this.props.container.destroy();
        if (this.inputSubscription) {
            this.inputSubscription.unsubscribe();
        }
        if (this.outputSubscription) {
            this.outputSubscription.unsubscribe();
        }
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement("h2", null, "HELLO WORLD! These are my precious embeddable children:"),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
            react_1.default.createElement(eui_1.EuiFlexGroup, null, this.renderList())));
    }
    renderList() {
        const list = Object.values(this.state.panels).map(panelState => {
            const item = (react_1.default.createElement(eui_1.EuiFlexItem, { key: panelState.explicitInput.id },
                react_1.default.createElement(__1.EmbeddableChildPanel, { container: this.props.container, embeddableId: panelState.explicitInput.id, getActions: this.props.getActions, getEmbeddableFactory: this.props.getEmbeddableFactory, getAllEmbeddableFactories: this.props.getAllEmbeddableFactories, overlays: this.props.overlays, notifications: this.props.notifications, application: this.props.application, inspector: this.props.inspector, SavedObjectFinder: this.props.SavedObjectFinder })));
            return item;
        });
        return list;
    }
}
exports.HelloWorldContainerComponent = HelloWorldContainerComponent;
