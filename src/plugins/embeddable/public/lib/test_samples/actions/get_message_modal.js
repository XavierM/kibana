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
class GetMessageModal extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiModalHeader, null,
                react_1.default.createElement(eui_1.EuiModalHeaderTitle, null, "Enter your message")),
            react_1.default.createElement(eui_1.EuiModalBody, null,
                react_1.default.createElement(eui_1.EuiForm, null,
                    react_1.default.createElement(eui_1.EuiFormRow, { label: "Message" },
                        react_1.default.createElement(eui_1.EuiFieldText, { name: "popfirst", value: this.state.message, onChange: e => this.setState({ message: e.target.value }) })))),
            react_1.default.createElement(eui_1.EuiModalFooter, null,
                react_1.default.createElement(eui_1.EuiButtonEmpty, { onClick: this.props.onCancel }, "Cancel"),
                react_1.default.createElement(eui_1.EuiButton, { isDisabled: !this.state.message, onClick: () => {
                        if (this.state.message) {
                            this.props.onDone(this.state.message);
                        }
                    }, fill: true }, "Done"))));
    }
}
exports.GetMessageModal = GetMessageModal;
