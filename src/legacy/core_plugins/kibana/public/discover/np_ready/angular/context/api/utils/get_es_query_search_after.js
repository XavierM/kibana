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
const date_conversion_1 = require("./date_conversion");
/**
 * Get the searchAfter query value for elasticsearch
 * When there are already documents available, which means successors or predecessors
 * were already fetched, the new searchAfter for the next fetch has to be the sort value
 * of the first (prececessor), or last (successor) of the list
 */
function getEsQuerySearchAfter(type, documents, timeFieldName, anchor, nanoSeconds) {
    if (documents.length) {
        // already surrounding docs -> first or last record  is used
        const afterTimeRecIdx = type === 'successors' && documents.length ? documents.length - 1 : 0;
        const afterTimeDoc = documents[afterTimeRecIdx];
        const afterTimeValue = nanoSeconds
            ? date_conversion_1.convertIsoToNanosAsStr(afterTimeDoc.fields[timeFieldName][0])
            : afterTimeDoc.sort[0];
        return [afterTimeValue, afterTimeDoc.sort[1]];
    }
    // if data_nanos adapt timestamp value for sorting, since numeric value was rounded by browser
    // ES search_after also works when number is provided as string
    return [
        nanoSeconds ? date_conversion_1.convertIsoToNanosAsStr(anchor.fields[timeFieldName][0]) : anchor.sort[0],
        anchor.sort[1],
    ];
}
exports.getEsQuerySearchAfter = getEsQuerySearchAfter;
