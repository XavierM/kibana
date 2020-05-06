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
/**
 * Enumeration of the different states the current position can be in.
 *
 * Current implementation uses low-level binary operations OR ('|') and AND ('&') to, respectively:
 *
 * - Create a combination of acceptable states.
 * - Extract the states from the acceptable combination.
 *
 * E.g.
 * ```ts
 * const acceptableStates = LINE_MODE.REQUEST_START | LINE_MODE.IN_REQUEST; // binary '110'
 *
 * // Is MULTI_DOC_CUR_DOC_END ('1000') acceptable?
 * Boolean(acceptableStates & LINE_MODE.MULTI_DOC_CUR_DOC_END) // false
 *
 * // Is REQUEST_START ('10') acceptable?
 * Boolean(acceptableStates & LINE_MODE.REQUEST_START) // true
 * ```
 *
 * This implementation will probably be changed to something more accessible in future but is documented
 * here for reference.
 */
var LINE_MODE;
(function (LINE_MODE) {
    LINE_MODE[LINE_MODE["REQUEST_START"] = 2] = "REQUEST_START";
    LINE_MODE[LINE_MODE["IN_REQUEST"] = 4] = "IN_REQUEST";
    LINE_MODE[LINE_MODE["MULTI_DOC_CUR_DOC_END"] = 8] = "MULTI_DOC_CUR_DOC_END";
    LINE_MODE[LINE_MODE["REQUEST_END"] = 16] = "REQUEST_END";
    LINE_MODE[LINE_MODE["BETWEEN_REQUESTS"] = 32] = "BETWEEN_REQUESTS";
    LINE_MODE[LINE_MODE["UNKNOWN"] = 64] = "UNKNOWN";
})(LINE_MODE = exports.LINE_MODE || (exports.LINE_MODE = {}));
