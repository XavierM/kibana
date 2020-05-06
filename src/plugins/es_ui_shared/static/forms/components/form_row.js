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
const field_1 = require("./field");
function isTitleString(title) {
    return typeof title === 'string' || title.type.name === 'FormattedMessage';
}
exports.FormRow = ({ title, idAria, description, field, children, titleTag = 'h4', ...rest }) => {
    let titleWrapped;
    // If a string is provided, create a default Euititle of size "m"
    if (isTitleString(title)) {
        // Create the correct title tag
        const titleWithHTag = react_1.default.createElement(titleTag, undefined, title);
        titleWrapped = react_1.default.createElement(eui_1.EuiTitle, { size: "s" }, titleWithHTag);
    }
    else {
        titleWrapped = title;
    }
    if (!children && !field) {
        throw new Error('You need to provide either children or a field to the FormRow');
    }
    return (react_1.default.createElement(eui_1.EuiDescribedFormGroup, { title: titleWrapped, description: description, fullWidth: true }, children ? children : react_1.default.createElement(field_1.Field, Object.assign({ field: field }, rest))));
};
/**
 * Get a <FormRow /> component providing some common props for all instances.
 * @param partialProps Partial props to apply to all <FormRow /> instances
 */
exports.getFormRow = (partialProps) => (props) => {
    const componentProps = { ...partialProps, ...props };
    return react_1.default.createElement(exports.FormRow, Object.assign({}, componentProps));
};
