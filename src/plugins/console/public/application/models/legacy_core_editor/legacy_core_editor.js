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
const brace_1 = tslib_1.__importDefault(require("brace"));
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const ace_token_provider_1 = require("../../../lib/ace_token_provider");
const curl = tslib_1.__importStar(require("../sense_editor/curl"));
const smart_resize_1 = tslib_1.__importDefault(require("./smart_resize"));
// @ts-ignore
const InputMode = tslib_1.__importStar(require("./mode/input"));
const _AceRange = brace_1.default.acequire('ace/range').Range;
const rangeToAceRange = ({ start, end }) => new _AceRange(start.lineNumber - 1, start.column - 1, end.lineNumber - 1, end.column - 1);
class LegacyCoreEditor {
    constructor(editor, actions) {
        this.editor = editor;
        this.setActionsBar = (value, topOrBottom = 'top') => {
            if (value === null) {
                this.$actions.css('visibility', 'hidden');
            }
            else {
                if (topOrBottom === 'top') {
                    this.$actions.css({
                        bottom: 'auto',
                        top: value,
                        visibility: 'visible',
                    });
                }
                else {
                    this.$actions.css({
                        top: 'auto',
                        bottom: value,
                        visibility: 'visible',
                    });
                }
            }
        };
        this.hideActionsBar = () => {
            this.setActionsBar();
        };
        this.$actions = jquery_1.default(actions);
        this.editor.setShowPrintMargin(false);
        const session = this.editor.getSession();
        session.setMode(new InputMode.Mode());
        session.setFoldStyle('markbeginend');
        session.setTabSize(2);
        session.setUseWrapMode(true);
        this.resize = smart_resize_1.default(this.editor);
        // Intercept ace on paste handler.
        this._aceOnPaste = this.editor.onPaste;
        this.editor.onPaste = this.DO_NOT_USE_onPaste.bind(this);
        this.editor.setOptions({
            enableBasicAutocompletion: true,
        });
        this.editor.$blockScrolling = Infinity;
        this.hideActionsBar();
        this.editor.focus();
    }
    // dirty check for tokenizer state, uses a lot less cycles
    // than listening for tokenizerUpdate
    waitForLatestTokens() {
        return new Promise(resolve => {
            const session = this.editor.getSession();
            const checkInterval = 25;
            const check = () => {
                // If the bgTokenizer doesn't exist, we can assume that the underlying editor has been
                // torn down, e.g. by closing the History tab, and we don't need to do anything further.
                if (session.bgTokenizer) {
                    // Wait until the bgTokenizer is done running before executing the callback.
                    if (session.bgTokenizer.running) {
                        setTimeout(check, checkInterval);
                    }
                    else {
                        resolve();
                    }
                }
            };
            setTimeout(check, 0);
        });
    }
    getLineState(lineNumber) {
        const session = this.editor.getSession();
        return session.getState(lineNumber - 1);
    }
    getValueInRange(range) {
        return this.editor.getSession().getTextRange(rangeToAceRange(range));
    }
    getTokenProvider() {
        return new ace_token_provider_1.AceTokensProvider(this.editor.getSession());
    }
    getValue() {
        return this.editor.getValue();
    }
    async setValue(text, forceRetokenize) {
        const session = this.editor.getSession();
        session.setValue(text);
        if (forceRetokenize) {
            await this.forceRetokenize();
        }
    }
    getLineValue(lineNumber) {
        const session = this.editor.getSession();
        return session.getLine(lineNumber - 1);
    }
    getCurrentPosition() {
        const cursorPosition = this.editor.getCursorPosition();
        return {
            lineNumber: cursorPosition.row + 1,
            column: cursorPosition.column + 1,
        };
    }
    clearSelection() {
        this.editor.clearSelection();
    }
    getTokenAt(pos) {
        const provider = this.getTokenProvider();
        return provider.getTokenAt(pos);
    }
    insert(valueOrPos, value) {
        if (typeof valueOrPos === 'string') {
            this.editor.insert(valueOrPos);
            return;
        }
        const document = this.editor.getSession().getDocument();
        document.insert({
            column: valueOrPos.column - 1,
            row: valueOrPos.lineNumber - 1,
        }, value || '');
    }
    moveCursorToPosition(pos) {
        this.editor.moveCursorToPosition({ row: pos.lineNumber - 1, column: pos.column - 1 });
    }
    replace(range, value) {
        const session = this.editor.getSession();
        session.replace(rangeToAceRange(range), value);
    }
    getLines(startLine, endLine) {
        const session = this.editor.getSession();
        return session.getLines(startLine - 1, endLine - 1);
    }
    replaceRange(range, value) {
        const pos = this.editor.getCursorPosition();
        this.editor.getSession().replace(rangeToAceRange(range), value);
        const maxRow = Math.max(range.start.lineNumber - 1 + value.split('\n').length - 1, 1);
        pos.row = Math.min(pos.row, maxRow);
        this.editor.moveCursorToPosition(pos);
        // ACE UPGRADE - check if needed - at the moment the above may trigger a selection.
        this.editor.clearSelection();
    }
    getSelectionRange() {
        const result = this.editor.getSelectionRange();
        return {
            start: {
                lineNumber: result.start.row + 1,
                column: result.start.column + 1,
            },
            end: {
                lineNumber: result.end.row + 1,
                column: result.end.column + 1,
            },
        };
    }
    getLineCount() {
        // Only use this function to return line count as it uses
        // a cache.
        return this.editor.getSession().getLength();
    }
    addMarker(range) {
        return this.editor
            .getSession()
            .addMarker(rangeToAceRange(range), 'ace_snippet-marker', 'fullLine', false);
    }
    removeMarker(ref) {
        this.editor.getSession().removeMarker(ref);
    }
    getWrapLimit() {
        return this.editor.getSession().getWrapLimit();
    }
    on(event, listener) {
        if (event === 'changeCursor') {
            this.editor.getSession().selection.on(event, listener);
        }
        else if (event === 'changeSelection') {
            this.editor.on(event, listener);
        }
        else {
            this.editor.getSession().on(event, listener);
        }
    }
    off(event, listener) {
        if (event === 'changeSelection') {
            this.editor.off(event, listener);
        }
    }
    isCompleterActive() {
        // Secrets of the arcane here.
        return Boolean(this.editor.completer && this.editor.completer.activated);
    }
    forceRetokenize() {
        const session = this.editor.getSession();
        return new Promise(resolve => {
            // force update of tokens, but not on this thread to allow for ace rendering.
            setTimeout(function () {
                let i;
                for (i = 0; i < session.getLength(); i++) {
                    session.getTokens(i);
                }
                resolve();
            });
        });
    }
    // eslint-disable-next-line @typescript-eslint/camelcase
    DO_NOT_USE_onPaste(text) {
        if (text && curl.detectCURL(text)) {
            const curlInput = curl.parseCURL(text);
            this.editor.insert(curlInput);
            return;
        }
        this._aceOnPaste.call(this.editor, text);
    }
    execCommand(cmd) {
        this.editor.execCommand(cmd);
    }
    getContainer() {
        return this.editor.container;
    }
    setStyles(styles) {
        this.editor.getSession().setUseWrapMode(styles.wrapLines);
        this.editor.container.style.fontSize = styles.fontSize;
    }
    registerKeyboardShortcut(opts) {
        this.editor.commands.addCommand({
            exec: opts.fn,
            name: opts.name,
            bindKey: opts.keys,
        });
    }
    legacyUpdateUI(range) {
        if (!this.$actions) {
            return;
        }
        if (range) {
            // elements are positioned relative to the editor's container
            // pageY is relative to page, so subtract the offset
            // from pageY to get the new top value
            const offsetFromPage = jquery_1.default(this.editor.container).offset().top;
            const startLine = range.start.lineNumber;
            const startColumn = range.start.column;
            const firstLine = this.getLineValue(startLine);
            const maxLineLength = this.getWrapLimit() - 5;
            const isWrapping = firstLine.length > maxLineLength;
            const totalOffset = offsetFromPage - (window.pageYOffset || 0);
            const getScreenCoords = (line) => this.editor.renderer.textToScreenCoordinates(line - 1, startColumn).pageY - totalOffset;
            const topOfReq = getScreenCoords(startLine);
            if (topOfReq >= 0) {
                const { bottom: maxBottom } = this.editor.container.getBoundingClientRect();
                if (topOfReq > maxBottom - totalOffset) {
                    this.setActionsBar(0, 'bottom');
                    return;
                }
                let offset = 0;
                if (isWrapping) {
                    // Try get the line height of the text area in pixels.
                    const textArea = jquery_1.default(this.editor.container.querySelector('textArea'));
                    const hasRoomOnNextLine = this.getLineValue(startLine).length < maxLineLength;
                    if (textArea && hasRoomOnNextLine) {
                        // Line height + the number of wraps we have on a line.
                        offset += this.getLineValue(startLine).length * textArea.height();
                    }
                    else {
                        if (startLine > 1) {
                            this.setActionsBar(getScreenCoords(startLine - 1));
                            return;
                        }
                        this.setActionsBar(getScreenCoords(startLine + 1));
                        return;
                    }
                }
                this.setActionsBar(topOfReq + offset);
                return;
            }
            const bottomOfReq = this.editor.renderer.textToScreenCoordinates(range.end.lineNumber, range.end.column).pageY -
                offsetFromPage;
            if (bottomOfReq >= 0) {
                this.setActionsBar(0);
                return;
            }
        }
    }
    registerAutocompleter(autocompleter) {
        // Hook into Ace
        // disable standard context based autocompletion.
        // @ts-ignore
        brace_1.default.define('ace/autocomplete/text_completer', ['require', 'exports', 'module'], function (require, exports) {
            exports.getCompletions = function (innerEditor, session, pos, prefix, callback) {
                callback(null, []);
            };
        });
        const langTools = brace_1.default.acequire('ace/ext/language_tools');
        langTools.setCompleters([
            {
                identifierRegexps: [
                    /[a-zA-Z_0-9\.\$\-\u00A2-\uFFFF]/,
                ],
                getCompletions: (DO_NOT_USE_1, DO_NOT_USE_2, pos, prefix, callback) => {
                    const position = {
                        lineNumber: pos.row + 1,
                        column: pos.column + 1,
                    };
                    autocompleter(position, prefix, callback);
                },
            },
        ]);
    }
}
exports.LegacyCoreEditor = LegacyCoreEditor;
