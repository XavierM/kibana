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
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const utils_1 = require("../legacy/utils");
exports.PUBLIC_PATH_PLACEHOLDER = '__REPLACE_WITH_PUBLIC_PATH__';
function replacePlaceholder(read, replacement) {
    const replace = utils_1.createReplaceStream(exports.PUBLIC_PATH_PLACEHOLDER, replacement);
    // handle errors on the read stream by proxying them
    // to the replace stream so that the consumer can
    // choose what to do with them.
    Rx.fromEvent(read, 'error')
        .pipe(operators_1.take(1), operators_1.takeUntil(Rx.fromEvent(read, 'end')))
        .forEach(error => {
        replace.emit('error', error);
        replace.end();
    });
    const closableReplace = Object.assign(replace, {
        close: () => {
            read.unpipe();
            if ('close' in read) {
                read.close();
            }
        },
    });
    return read.pipe(closableReplace);
}
exports.replacePlaceholder = replacePlaceholder;
