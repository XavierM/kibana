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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
class HeaderBreadcrumbs extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = { breadcrumbs: [] };
    }
    componentDidMount() {
        this.subscribe();
    }
    componentDidUpdate(prevProps) {
        if (prevProps.breadcrumbs$ === this.props.breadcrumbs$) {
            return;
        }
        this.unsubscribe();
        this.subscribe();
    }
    componentWillUnmount() {
        this.unsubscribe();
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiHeaderBreadcrumbs, { breadcrumbs: this.getBreadcrumbs(), max: 10, "data-test-subj": "breadcrumbs" }));
    }
    subscribe() {
        this.subscription = this.props.breadcrumbs$.subscribe(breadcrumbs => {
            this.setState({
                breadcrumbs,
            });
        });
    }
    unsubscribe() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            delete this.subscription;
        }
    }
    getBreadcrumbs() {
        let breadcrumbs = this.state.breadcrumbs;
        if (breadcrumbs.length === 0 && this.props.appTitle) {
            breadcrumbs = [{ text: this.props.appTitle }];
        }
        return breadcrumbs.map((breadcrumb, i) => ({
            ...breadcrumb,
            'data-test-subj': classnames_1.default('breadcrumb', breadcrumb['data-test-subj'], i === 0 && 'first', i === breadcrumbs.length - 1 && 'last'),
        }));
    }
}
exports.HeaderBreadcrumbs = HeaderBreadcrumbs;
