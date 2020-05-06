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
const string_1 = require("../../../validators/string");
const array_1 = require("../../../validators/array");
exports.emptyField = (message) => (...args) => {
    const [{ value, path }] = args;
    if (typeof value === 'string') {
        return string_1.isEmptyString(value) ? { code: 'ERR_FIELD_MISSING', path, message } : undefined;
    }
    if (Array.isArray(value)) {
        return array_1.isEmptyArray(value) ? { code: 'ERR_FIELD_MISSING', path, message } : undefined;
    }
};
