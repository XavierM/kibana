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
const use_field_1 = require("./use_field");
exports.UseMultiFields = ({ fields, children }) => {
    const fieldsArray = Object.entries(fields).reduce((acc, [fieldId, field]) => [...acc, { id: fieldId, ...field }], []);
    const hookFields = {};
    const renderField = (index) => {
        const { id } = fieldsArray[index];
        return (react_1.default.createElement(use_field_1.UseField, Object.assign({}, fields[id]), field => {
            hookFields[id] = field;
            return index === fieldsArray.length - 1 ? children(hookFields) : renderField(index + 1);
        }));
    };
    if (!Boolean(fieldsArray.length)) {
        return null;
    }
    return renderField(0);
};
