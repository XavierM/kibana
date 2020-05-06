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
const eui_1 = require("@elastic/eui");
const header_extension_1 = require("./header_extension");
class HeaderNavControls extends react_1.Component {
    constructor() {
        super(...arguments);
        // It should be performant to use the index as the key since these are unlikely
        // to change while Kibana is running.
        this.renderNavControl = (navControl, index) => (react_1.default.createElement(eui_1.EuiHeaderSectionItem, { key: index, border: this.props.side === 'left' ? 'right' : 'left' },
            react_1.default.createElement(header_extension_1.HeaderExtension, { extension: navControl.mount })));
    }
    render() {
        const { navControls } = this.props;
        if (!navControls) {
            return null;
        }
        return navControls.map(this.renderNavControl);
    }
}
exports.HeaderNavControls = HeaderNavControls;
