"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const react_1 = require("react");
const editor_registry_1 = require("../../contexts/editor_context/editor_registry");
const restore_request_from_history_1 = require("./restore_request_from_history");
exports.useRestoreRequestFromHistory = () => {
    return react_1.useCallback((req) => {
        const editor = editor_registry_1.instance.getInputEditor();
        restore_request_from_history_1.restoreRequestFromHistory(editor, req);
    }, []);
};
