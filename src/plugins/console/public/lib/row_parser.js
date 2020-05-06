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
exports.MODE = {
    REQUEST_START: 2,
    IN_REQUEST: 4,
    MULTI_DOC_CUR_DOC_END: 8,
    REQUEST_END: 16,
    BETWEEN_REQUESTS: 32,
};
// eslint-disable-next-line import/no-default-export
class RowParser {
    constructor(editor) {
        this.editor = editor;
        this.MODE = exports.MODE;
    }
    getRowParseMode(lineNumber = this.editor.getCurrentPosition().lineNumber) {
        const linesCount = this.editor.getLineCount();
        if (lineNumber > linesCount || lineNumber < 1) {
            return exports.MODE.BETWEEN_REQUESTS;
        }
        const mode = this.editor.getLineState(lineNumber);
        if (!mode) {
            return exports.MODE.BETWEEN_REQUESTS;
        } // shouldn't really happen
        // If another "start" mode is added here because we want to allow for new language highlighting
        // please see https://github.com/elastic/kibana/pull/51446 for a discussion on why
        // should consider a different approach.
        if (mode !== 'start' && mode !== 'start-sql') {
            return exports.MODE.IN_REQUEST;
        }
        let line = (this.editor.getLineValue(lineNumber) || '').trim();
        if (!line || line[0] === '#') {
            return exports.MODE.BETWEEN_REQUESTS;
        } // empty line or a comment waiting for a new req to start
        if (line.indexOf('}', line.length - 1) >= 0) {
            // check for a multi doc request (must start a new json doc immediately after this one end.
            lineNumber++;
            if (lineNumber < linesCount + 1) {
                line = (this.editor.getLineValue(lineNumber) || '').trim();
                if (line.indexOf('{') === 0) {
                    // next line is another doc in a multi doc
                    // eslint-disable-next-line no-bitwise
                    return exports.MODE.MULTI_DOC_CUR_DOC_END | exports.MODE.IN_REQUEST;
                }
            }
            // eslint-disable-next-line no-bitwise
            return exports.MODE.REQUEST_END | exports.MODE.MULTI_DOC_CUR_DOC_END; // end of request
        }
        // check for single line requests
        lineNumber++;
        if (lineNumber >= linesCount + 1) {
            // eslint-disable-next-line no-bitwise
            return exports.MODE.REQUEST_START | exports.MODE.REQUEST_END;
        }
        line = (this.editor.getLineValue(lineNumber) || '').trim();
        if (line.indexOf('{') !== 0) {
            // next line is another request
            // eslint-disable-next-line no-bitwise
            return exports.MODE.REQUEST_START | exports.MODE.REQUEST_END;
        }
        return exports.MODE.REQUEST_START;
    }
    rowPredicate(lineNumber, editor, value) {
        const mode = this.getRowParseMode(lineNumber);
        // eslint-disable-next-line no-bitwise
        return (mode & value) > 0;
    }
    isEndRequestRow(row, _e) {
        const editor = _e || this.editor;
        return this.rowPredicate(row, editor, exports.MODE.REQUEST_END);
    }
    isRequestEdge(row, _e) {
        const editor = _e || this.editor;
        // eslint-disable-next-line no-bitwise
        return this.rowPredicate(row, editor, exports.MODE.REQUEST_END | exports.MODE.REQUEST_START);
    }
    isStartRequestRow(row, _e) {
        const editor = _e || this.editor;
        return this.rowPredicate(row, editor, exports.MODE.REQUEST_START);
    }
    isInBetweenRequestsRow(row, _e) {
        const editor = _e || this.editor;
        return this.rowPredicate(row, editor, exports.MODE.BETWEEN_REQUESTS);
    }
    isInRequestsRow(row, _e) {
        const editor = _e || this.editor;
        return this.rowPredicate(row, editor, exports.MODE.IN_REQUEST);
    }
    isMultiDocDocEndRow(row, _e) {
        const editor = _e || this.editor;
        return this.rowPredicate(row, editor, exports.MODE.MULTI_DOC_CUR_DOC_END);
    }
    isEmptyToken(tokenOrTokenIter) {
        const token = tokenOrTokenIter && tokenOrTokenIter.getCurrentToken
            ? tokenOrTokenIter.getCurrentToken()
            : tokenOrTokenIter;
        return !token || token.type === 'whitespace';
    }
    isUrlOrMethodToken(tokenOrTokenIter) {
        const t = tokenOrTokenIter?.getCurrentToken() ?? tokenOrTokenIter;
        return t && t.type && (t.type === 'method' || t.type.indexOf('url') === 0);
    }
    nextNonEmptyToken(tokenIter) {
        let t = tokenIter.stepForward();
        while (t && this.isEmptyToken(t)) {
            t = tokenIter.stepForward();
        }
        return t;
    }
    prevNonEmptyToken(tokenIter) {
        let t = tokenIter.stepBackward();
        // empty rows return null token.
        while ((t || tokenIter.getCurrentPosition().lineNumber > 1) && this.isEmptyToken(t))
            t = tokenIter.stepBackward();
        return t;
    }
}
exports.default = RowParser;
