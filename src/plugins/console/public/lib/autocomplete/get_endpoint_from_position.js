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
const autocomplete_1 = require("./autocomplete");
// @ts-ignore
const kb_1 = require("../kb/kb");
// @ts-ignore
const engine_1 = require("./engine");
function getEndpointFromPosition(editor, pos, parser) {
    const lineValue = editor.getLineValue(pos.lineNumber);
    const context = {
        ...autocomplete_1.getCurrentMethodAndTokenPaths(editor, {
            column: lineValue.length + 1 /* Go to the very end of the line */,
            lineNumber: pos.lineNumber,
        }, parser, true),
    };
    const components = kb_1.getTopLevelUrlCompleteComponents(context.method);
    engine_1.populateContext(context.urlTokenPath, context, editor, true, components);
    return context.endpoint;
}
exports.getEndpointFromPosition = getEndpointFromPosition;
