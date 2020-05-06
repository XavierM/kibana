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
const react_1 = tslib_1.__importStar(require("react"));
const reselect_1 = require("reselect");
const table_1 = require("./components/table");
const lib_1 = require("./lib");
class IndexedFieldsTable extends react_1.Component {
    constructor(props) {
        super(props);
        this.getFilteredFields = reselect_1.createSelector((state) => state.fields, (state, props) => props.fieldFilter, (state, props) => props.indexedFieldTypeFilter, (fields, fieldFilter, indexedFieldTypeFilter) => {
            if (fieldFilter) {
                const normalizedFieldFilter = fieldFilter.toLowerCase();
                fields = fields.filter(field => field.name.toLowerCase().includes(normalizedFieldFilter));
            }
            if (indexedFieldTypeFilter) {
                fields = fields.filter(field => field.type === indexedFieldTypeFilter);
            }
            return fields;
        });
        this.state = {
            fields: this.mapFields(this.props.fields),
        };
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.fields !== this.props.fields) {
            this.setState({
                fields: this.mapFields(nextProps.fields),
            });
        }
    }
    mapFields(fields) {
        const { indexPattern, fieldWildcardMatcher, helpers } = this.props;
        const sourceFilters = indexPattern.sourceFilters &&
            indexPattern.sourceFilters.map((f) => f.value);
        const fieldWildcardMatch = fieldWildcardMatcher(sourceFilters || []);
        return ((fields &&
            fields.map(field => {
                return {
                    ...field,
                    displayName: field.displayName,
                    indexPattern: field.indexPattern,
                    format: lib_1.getFieldFormat(indexPattern, field.name),
                    excluded: fieldWildcardMatch ? fieldWildcardMatch(field.name) : false,
                    info: helpers.getFieldInfo && helpers.getFieldInfo(indexPattern, field),
                };
            })) ||
            []);
    }
    render() {
        const { indexPattern } = this.props;
        const fields = this.getFilteredFields(this.state, this.props);
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(table_1.Table, { indexPattern: indexPattern, items: fields, editField: field => this.props.helpers.redirectToRoute(field) })));
    }
}
exports.IndexedFieldsTable = IndexedFieldsTable;
