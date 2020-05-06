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
const index_1 = require("../index");
const worker_1 = require("./worker");
const { WorkerClient } = brace_1.default.acequire('ace/worker/worker_client');
const oop = brace_1.default.acequire('ace/lib/oop');
const { Mode: JSONMode } = brace_1.default.acequire('ace/mode/json');
const { Tokenizer: AceTokenizer } = brace_1.default.acequire('ace/tokenizer');
const { MatchingBraceOutdent } = brace_1.default.acequire('ace/mode/matching_brace_outdent');
const { CstyleBehaviour } = brace_1.default.acequire('ace/mode/behaviour/cstyle');
const { FoldMode: CStyleFoldMode } = brace_1.default.acequire('ace/mode/folding/cstyle');
const XJsonMode = function XJsonMode() {
    const ruleset = new index_1.XJsonHighlightRules();
    ruleset.normalizeRules();
    this.$tokenizer = new AceTokenizer(ruleset.getRules());
    this.$outdent = new MatchingBraceOutdent();
    this.$behaviour = new CstyleBehaviour();
    this.foldingRules = new CStyleFoldMode();
};
exports.XJsonMode = XJsonMode;
oop.inherits(XJsonMode, JSONMode);
// Then clobber `createWorker` method to install our worker source. Per ace's wiki: https://github.com/ajaxorg/ace/wiki/Syntax-validation
XJsonMode.prototype.createWorker = function (session) {
    const xJsonWorker = new WorkerClient(['ace'], worker_1.workerModule, 'JsonWorker');
    xJsonWorker.attachToDocument(session.getDocument());
    xJsonWorker.on('annotate', function (e) {
        session.setAnnotations(e.data);
    });
    xJsonWorker.on('terminate', function () {
        session.clearAnnotations();
    });
    return xJsonWorker;
};
function installXJsonMode(editor) {
    const session = editor.getSession();
    session.setMode(new XJsonMode());
}
exports.installXJsonMode = installXJsonMode;
