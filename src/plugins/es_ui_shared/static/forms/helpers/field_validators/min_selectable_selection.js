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
const array_1 = require("../../../validators/array");
const serializers_1 = require("../serializers");
const { optionsToSelectedValue } = serializers_1.multiSelectComponent;
/**
 * Validator to validate that a EuiSelectable has a minimum number
 * of items selected.
 * @param total Minimum number of items
 */
exports.minSelectableSelectionField = ({ total = 0, message, }) => (...args) => {
    const [{ value }] = args;
    // We need to convert all the options from the multi selectable component, to the
    // an actual Array of selection _before_ validating the Array length.
    return array_1.hasMinLengthArray(total)(optionsToSelectedValue(value))
        ? undefined
        : {
            code: 'ERR_MIN_SELECTION',
            total,
            message: typeof message === 'function' ? message({ length }) : message,
        };
};
