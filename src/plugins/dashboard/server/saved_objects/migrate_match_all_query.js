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
const lodash_1 = require("lodash");
const common_1 = require("../../../data/common");
exports.migrateMatchAllQuery = doc => {
    const searchSourceJSON = lodash_1.get(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');
    if (searchSourceJSON) {
        let searchSource;
        try {
            searchSource = JSON.parse(searchSourceJSON);
        }
        catch (e) {
            // Let it go, the data is invalid and we'll leave it as is
        }
        if (searchSource.query?.match_all) {
            return {
                ...doc,
                attributes: {
                    ...doc.attributes,
                    kibanaSavedObjectMeta: {
                        searchSourceJSON: JSON.stringify({
                            ...searchSource,
                            query: {
                                query: '',
                                language: common_1.DEFAULT_QUERY_LANGUAGE,
                            },
                        }),
                    },
                },
            };
        }
    }
    return doc;
};
