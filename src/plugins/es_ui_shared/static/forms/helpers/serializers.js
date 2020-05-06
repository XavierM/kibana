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
exports.multiSelectComponent = {
    /**
     * Return an array of labels of all the options that are selected
     *
     * @param value The Eui Selectable options array
     */
    optionsToSelectedValue(options) {
        return options.filter(option => option.checked === 'on').map(option => option.label);
    },
};
/**
 * Strip empty fields from a data object.
 * Empty fields can either be an empty string (one or several blank spaces) or an empty object (no keys)
 *
 * @param object Object to remove the empty fields from.
 * @param types An array of types to strip. Types can be "string" or "object". Defaults to ["string", "object"]
 * @param options An optional configuration object. By default recursive it turned on.
 */
exports.stripEmptyFields = (object, options) => {
    const { types = ['string', 'object'], recursive = false } = options || {};
    return Object.entries(object).reduce((acc, [key, value]) => {
        const type = typeof value;
        const shouldStrip = types.includes(type);
        if (shouldStrip && type === 'string' && value.trim() === '') {
            return acc;
        }
        else if (type === 'object' && !Array.isArray(value) && value !== null) {
            if (Object.keys(value).length === 0 && shouldStrip) {
                return acc;
            }
            else if (recursive) {
                value = exports.stripEmptyFields({ ...value }, options);
            }
        }
        acc[key] = value;
        return acc;
    }, {});
};
