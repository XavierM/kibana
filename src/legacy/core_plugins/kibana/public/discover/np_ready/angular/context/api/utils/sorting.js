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
var SortDirection;
(function (SortDirection) {
    SortDirection["asc"] = "asc";
    SortDirection["desc"] = "desc";
})(SortDirection = exports.SortDirection || (exports.SortDirection = {}));
/**
 * The list of field names that are allowed for sorting, but not included in
 * index pattern fields.
 */
const META_FIELD_NAMES = ['_seq_no', '_doc', '_uid'];
/**
 * Returns a field from the intersection of the set of sortable fields in the
 * given index pattern and a given set of candidate field names.
 */
function getFirstSortableField(indexPattern, fieldNames) {
    const sortableFields = fieldNames.filter(fieldName => META_FIELD_NAMES.includes(fieldName) ||
        // @ts-ignore
        (indexPattern.fields.getByName(fieldName) || { sortable: false }).sortable);
    return sortableFields[0];
}
exports.getFirstSortableField = getFirstSortableField;
/**
 * Return the reversed sort direction.
 */
function reverseSortDir(sortDirection) {
    return sortDirection === SortDirection.asc ? SortDirection.desc : SortDirection.asc;
}
exports.reverseSortDir = reverseSortDir;
