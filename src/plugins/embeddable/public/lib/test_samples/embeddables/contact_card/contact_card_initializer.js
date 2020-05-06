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
const react_1 = tslib_1.__importStar(require("react"));
class ContactCardInitializer extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiModalHeader, null,
                react_1.default.createElement(eui_1.EuiModalHeaderTitle, null, "Create a new greeting card")),
            react_1.default.createElement(eui_1.EuiModalBody, null,
                react_1.default.createElement(eui_1.EuiForm, null,
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "First name" },
                        react_1.default.createElement(eui_1.EuiFieldText, { name: "popfirst", value: this.state.firstName, onChange: e => this.setState({ firstName: e.target.value }) })),
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "Last name" },
                        react_1.default.createElement(eui_1.EuiFieldText, { name: "popfirst", value: this.state.lastName, placeholder: "optional", onChange: e => this.setState({ lastName: e.target.value }) })))),
            react_1.default.createElement(eui_1.EuiModalFooter, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.props.onCancel }, "Cancel"),
                react_1.default.createElement(eui_1.EuiButton, { isDisabled: !this.state.firstName, onClick: () => {
                        if (this.state.firstName) {
                            this.props.onCreate({
                                firstName: this.state.firstName,
                                ...(this.state.lastName ? { lastName: this.state.lastName } : {}),
                            });
                        }
                    }, fill: true }, "Create"))));
    }
}
exports.ContactCardInitializer = ContactCardInitializer;
