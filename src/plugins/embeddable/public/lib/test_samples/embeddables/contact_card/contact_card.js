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
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const eui_2 = require("@elastic/eui");
const Rx = tslib_1.__importStar(require("rxjs"));
const contact_card_embeddable_1 = require("./contact_card_embeddable");
class ContactCardEmbeddableComponent extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        this.emitContactTrigger = () => {
            this.props.execTrigger(contact_card_embeddable_1.CONTACT_USER_TRIGGER, {
                embeddable: this.props.embeddable,
            });
        };
        this.getCardFooterContent = () => (react_1.default.createElement(eui_1.EuiFlexGroup, { justifyContent: "flexEnd" },
            react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                react_1.default.createElement(eui_1.EuiFormRow, { label: "" },
                    react_1.default.createElement(eui_2.EuiButton, { onClick: this.emitContactTrigger }, `Contact ${this.state.firstName}`)))));
        this.state = {
            fullName: this.props.embeddable.getOutput().fullName,
            firstName: this.props.embeddable.getInput().firstName,
        };
    }
    componentDidMount() {
        this.mounted = true;
        this.subscription = Rx.merge(this.props.embeddable.getOutput$(), this.props.embeddable.getInput$()).subscribe(() => {
            if (this.mounted) {
                this.setState({
                    fullName: this.props.embeddable.getOutput().fullName,
                    firstName: this.props.embeddable.getInput().firstName,
                });
            }
        });
    }
    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.mounted = false;
    }
    render() {
        return (react_1.default.createElement(eui_1.EuiCard, { textAlign: "left", title: this.state.fullName, footer: this.getCardFooterContent(), description: "" }));
    }
}
exports.ContactCardEmbeddableComponent = ContactCardEmbeddableComponent;
