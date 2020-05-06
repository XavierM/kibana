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
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const react_1 = tslib_1.__importStar(require("react"));
function getDisplayName(component) {
    return component.displayName || component.name || 'Component';
}
function injectUICapabilities(WrappedComponent) {
    class InjectUICapabilities extends react_1.Component {
        constructor(props, context) {
            super(props, context);
        }
        render() {
            return (react_1.default.createElement(WrappedComponent, Object.assign({}, this.props, { uiCapabilities: this.context.uiCapabilities })));
        }
    }
    InjectUICapabilities.displayName = `InjectUICapabilities(${getDisplayName(WrappedComponent)})`;
    InjectUICapabilities.WrappedComponent = WrappedComponent;
    InjectUICapabilities.contextTypes = {
        uiCapabilities: prop_types_1.default.object.isRequired,
    };
    return InjectUICapabilities;
}
exports.injectUICapabilities = injectUICapabilities;
