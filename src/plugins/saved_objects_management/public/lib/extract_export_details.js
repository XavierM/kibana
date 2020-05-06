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
async function extractExportDetails(blob) {
    const reader = new FileReader();
    const content = await new Promise((resolve, reject) => {
        reader.addEventListener('loadend', e => {
            resolve(e.target.result);
        });
        reader.addEventListener('error', e => {
            reject(e);
        });
        reader.readAsText(blob, 'utf-8');
    });
    const lines = content.split('\n').filter(l => l.length > 0);
    const maybeDetails = JSON.parse(lines[lines.length - 1]);
    if (isExportDetails(maybeDetails)) {
        return maybeDetails;
    }
}
exports.extractExportDetails = extractExportDetails;
function isExportDetails(object) {
    return 'exportedCount' in object && 'missingRefCount' in object && 'missingReferences' in object;
}
