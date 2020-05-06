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
jest.mock('./mode/worker', () => {
    return { workerModule: { id: 'sense_editor/mode/worker', src: '' } };
});
// @ts-ignore
window.Worker = function () {
    this.postMessage = () => { };
    this.terminate = () => { };
};
// @ts-ignore
window.URL = {
    createObjectURL: () => {
        return '';
    },
};
require("brace");
require("brace/ext/language_tools");
require("brace/ext/searchbox");
require("brace/mode/json");
require("brace/mode/text");
document.queryCommandSupported = () => true;
