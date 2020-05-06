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
const common_1 = require("../../common");
const migrateMatchAllQuery = doc => {
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
const migrateIndexPattern = doc => {
    const searchSourceJSON = lodash_1.get(doc, 'attributes.kibanaSavedObjectMeta.searchSourceJSON');
    if (typeof searchSourceJSON !== 'string') {
        return doc;
    }
    let searchSource;
    try {
        searchSource = JSON.parse(searchSourceJSON);
    }
    catch (e) {
        // Let it go, the data is invalid and we'll leave it as is
        return doc;
    }
    if (searchSource.index && Array.isArray(doc.references)) {
        searchSource.indexRefName = 'kibanaSavedObjectMeta.searchSourceJSON.index';
        doc.references.push({
            name: searchSource.indexRefName,
            type: 'index-pattern',
            id: searchSource.index,
        });
        delete searchSource.index;
    }
    if (searchSource.filter) {
        searchSource.filter.forEach((filterRow, i) => {
            if (!filterRow.meta || !filterRow.meta.index || !Array.isArray(doc.references)) {
                return;
            }
            filterRow.meta.indexRefName = `kibanaSavedObjectMeta.searchSourceJSON.filter[${i}].meta.index`;
            doc.references.push({
                name: filterRow.meta.indexRefName,
                type: 'index-pattern',
                id: filterRow.meta.index,
            });
            delete filterRow.meta.index;
        });
    }
    doc.attributes.kibanaSavedObjectMeta.searchSourceJSON = JSON.stringify(searchSource);
    return doc;
};
const setNewReferences = (doc, context) => {
    doc.references = doc.references || [];
    // Migrate index pattern
    return migrateIndexPattern(doc, context);
};
const migrateSearchSortToNestedArray = doc => {
    const sort = lodash_1.get(doc, 'attributes.sort');
    if (!sort)
        return doc;
    // Don't do anything if we already have a two dimensional array
    if (Array.isArray(sort) && sort.length > 0 && Array.isArray(sort[0])) {
        return doc;
    }
    return {
        ...doc,
        attributes: {
            ...doc.attributes,
            sort: [doc.attributes.sort],
        },
    };
};
exports.searchSavedObjectTypeMigrations = {
    '6.7.2': lodash_1.flow(migrateMatchAllQuery),
    '7.0.0': lodash_1.flow(setNewReferences),
    '7.4.0': lodash_1.flow(migrateSearchSortToNestedArray),
};
