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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const brace_1 = tslib_1.__importDefault(require("brace"));
// @ts-ignore
const OutputMode = tslib_1.__importStar(require("./mode/output"));
const smart_resize_1 = tslib_1.__importDefault(require("./smart_resize"));
/**
 * Note: using read-only ace editor leaks the Ace editor API - use this as sparingly as possible or
 * create an interface for it so that we don't rely directly on vendor APIs.
 */
function createReadOnlyAceEditor(element) {
    const output = brace_1.default.acequire('ace/ace').edit(element);
    const outputMode = new OutputMode.Mode();
    output.$blockScrolling = Infinity;
    output.resize = smart_resize_1.default(output);
    output.update = (val, mode, cb) => {
        if (typeof mode === 'function') {
            cb = mode;
            mode = void 0;
        }
        const session = output.getSession();
        session.setMode(val ? mode || outputMode : 'ace/mode/text');
        session.setValue(val);
        if (typeof cb === 'function') {
            setTimeout(cb);
        }
    };
    output.append = (val, foldPrevious, cb) => {
        if (typeof foldPrevious === 'function') {
            cb = foldPrevious;
            foldPrevious = true;
        }
        if (lodash_1.default.isUndefined(foldPrevious)) {
            foldPrevious = true;
        }
        const session = output.getSession();
        const lastLine = session.getLength();
        if (foldPrevious) {
            output.moveCursorTo(Math.max(0, lastLine - 1), 0);
        }
        session.insert({ row: lastLine, column: 0 }, '\n' + val);
        output.moveCursorTo(lastLine + 1, 0);
        if (typeof cb === 'function') {
            setTimeout(cb);
        }
    };
    // eslint-disable-next-line
    (function setupSession(session) {
        session.setMode('ace/mode/text');
        session.setFoldStyle('markbeginend');
        session.setTabSize(2);
        session.setUseWrapMode(true);
    })(output.getSession());
    output.setShowPrintMargin(false);
    output.setReadOnly(true);
    return output;
}
exports.createReadOnlyAceEditor = createReadOnlyAceEditor;
