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
const react_1 = require("react");
const lodash_1 = require("lodash");
const contexts_1 = require("../contexts");
const WAIT_MS = 500;
exports.useSaveCurrentTextObject = () => {
    const promiseChainRef = react_1.useRef(Promise.resolve());
    const { services: { objectStorageClient }, } = contexts_1.useServicesContext();
    const { currentTextObject } = contexts_1.useEditorReadContext();
    return react_1.useCallback(lodash_1.throttle((text) => {
        const { current: promise } = promiseChainRef;
        if (!currentTextObject)
            return;
        promise.finally(() => objectStorageClient.text.update({ ...currentTextObject, text, updatedAt: Date.now() }));
    }, WAIT_MS, { trailing: true }), [objectStorageClient, currentTextObject]);
};
