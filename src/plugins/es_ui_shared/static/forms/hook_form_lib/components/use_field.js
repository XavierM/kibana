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
const hooks_1 = require("../hooks");
const form_context_1 = require("../form_context");
exports.UseField = react_1.default.memo(({ path, config, defaultValue, component, componentProps, readDefaultValueOnForm = true, onChange, children, }) => {
    const form = form_context_1.useFormContext();
    component = component === undefined ? 'input' : component;
    componentProps = componentProps === undefined ? {} : componentProps;
    if (typeof defaultValue === 'undefined' && readDefaultValueOnForm) {
        defaultValue = form.getFieldDefaultValue(path);
    }
    if (!config) {
        config = form.__readFieldConfigFromSchema(path);
    }
    // Don't modify the config object
    const configCopy = typeof defaultValue !== 'undefined' ? { ...config, defaultValue } : { ...config };
    if (!configCopy.path) {
        configCopy.path = path;
    }
    else {
        if (configCopy.path !== path) {
            throw new Error(`Field path mismatch. Got "${path}" but field config has "${configCopy.path}".`);
        }
    }
    const field = hooks_1.useField(form, path, configCopy, onChange);
    // Children prevails over anything else provided.
    if (children) {
        return children(field);
    }
    if (component === 'input') {
        return (react_1.default.createElement("input", Object.assign({ type: field.type, onChange: field.onChange, value: field.value }, componentProps)));
    }
    return component({ field, ...componentProps });
});
/**
 * Get a <UseField /> component providing some common props for all instances.
 * @param partialProps Partial props to apply to all <UseField /> instances
 */
exports.getUseField = (partialProps) => (props) => {
    const componentProps = { ...partialProps, ...props };
    return react_1.default.createElement(exports.UseField, Object.assign({}, componentProps));
};
