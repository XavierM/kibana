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
class EmbeddableRoot extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.alreadyMounted = false;
        this.root = react_1.default.createRef();
    }
    componentDidMount() {
        if (this.root && this.root.current && this.props.embeddable) {
            this.alreadyMounted = true;
            this.props.embeddable.render(this.root.current);
        }
    }
    componentDidUpdate() {
        if (this.root && this.root.current && this.props.embeddable && !this.alreadyMounted) {
            this.alreadyMounted = true;
            this.props.embeddable.render(this.root.current);
        }
    }
    shouldComponentUpdate(newProps) {
        return Boolean(newProps.error !== this.props.error ||
            newProps.loading !== this.props.loading ||
            newProps.embeddable !== this.props.embeddable ||
            (this.root && this.root.current && newProps.embeddable && !this.alreadyMounted));
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", { ref: this.root }),
            this.props.loading && react_1.default.createElement(eui_1.EuiLoadingSpinner, { "data-test-subj": "embedSpinner" }),
            this.props.error && react_1.default.createElement(eui_2.EuiText, { "data-test-subj": "embedError" }, this.props.error)));
    }
}
exports.EmbeddableRoot = EmbeddableRoot;
