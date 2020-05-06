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
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const panel_1 = require("../panel");
/**
 * This component can be used by embeddable containers using react to easily render children. It waits
 * for the child to be initialized, showing a loading indicator until that is complete.
 */
class EmbeddableChildPanel extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
        };
        this.mounted = false;
    }
    async componentDidMount() {
        this.mounted = true;
        const { container } = this.props;
        this.embeddable = await container.untilEmbeddableLoaded(this.props.embeddableId);
        if (this.mounted) {
            this.setState({ loading: false });
        }
    }
    componentWillUnmount() {
        this.mounted = false;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    render() {
        const classes = classnames_1.default('embPanel', {
            'embPanel-isLoading': this.state.loading,
        });
        return (react_1.default.createElement("div", { className: classes }, this.state.loading || !this.embeddable ? (react_1.default.createElement(eui_1.EuiLoadingChart, { size: "l", mono: true })) : (react_1.default.createElement(panel_1.EmbeddablePanel, { embeddable: this.embeddable, getActions: this.props.getActions, getEmbeddableFactory: this.props.getEmbeddableFactory, getAllEmbeddableFactories: this.props.getAllEmbeddableFactories, overlays: this.props.overlays, application: this.props.application, notifications: this.props.notifications, inspector: this.props.inspector, SavedObjectFinder: this.props.SavedObjectFinder }))));
    }
}
exports.EmbeddableChildPanel = EmbeddableChildPanel;
