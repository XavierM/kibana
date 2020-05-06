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
const eui_1 = require("@elastic/eui");
const components_1 = require("./components");
class SourceFiltersTable extends react_1.Component {
    constructor(props) {
        super(props);
        // Source filters do not have any unique ids, only the value is stored.
        // To ensure we can create a consistent and expected UX when managing
        // source filters, we are assigning a unique id to each filter on the
        // client side only
        this.clientSideId = 0;
        this.updateFilters = () => {
            const sourceFilters = this.props.indexPattern.sourceFilters;
            const filters = (sourceFilters || []).map((sourceFilter) => ({
                ...sourceFilter,
                clientId: ++this.clientSideId,
            }));
            this.setState({ filters });
        };
        this.getFilteredFilters = reselect_1.createSelector((state) => state.filters, (state, props) => props.filterFilter, (filters, filterFilter) => {
            if (filterFilter) {
                const filterFilterToLowercase = filterFilter.toLowerCase();
                return filters.filter(filter => filter.value.toLowerCase().includes(filterFilterToLowercase));
            }
            return filters;
        });
        this.startDeleteFilter = (filter) => {
            this.setState({
                filterToDelete: filter,
                isDeleteConfirmationModalVisible: true,
            });
        };
        this.hideDeleteConfirmationModal = () => {
            this.setState({
                filterToDelete: undefined,
                isDeleteConfirmationModalVisible: false,
            });
        };
        this.deleteFilter = async () => {
            const { indexPattern, onAddOrRemoveFilter } = this.props;
            const { filterToDelete, filters } = this.state;
            indexPattern.sourceFilters = filters.filter(filter => {
                return filter.clientId !== filterToDelete.clientId;
            });
            this.setState({ isSaving: true });
            await indexPattern.save();
            if (onAddOrRemoveFilter) {
                onAddOrRemoveFilter();
            }
            this.updateFilters();
            this.setState({ isSaving: false });
            this.hideDeleteConfirmationModal();
        };
        this.onAddFilter = async (value) => {
            const { indexPattern, onAddOrRemoveFilter } = this.props;
            indexPattern.sourceFilters = [...(indexPattern.sourceFilters || []), { value }];
            this.setState({ isSaving: true });
            await indexPattern.save();
            if (onAddOrRemoveFilter) {
                onAddOrRemoveFilter();
            }
            this.updateFilters();
            this.setState({ isSaving: false });
        };
        this.saveFilter = async ({ clientId, value }) => {
            const { indexPattern } = this.props;
            const { filters } = this.state;
            indexPattern.sourceFilters = filters.map(filter => {
                if (filter.clientId === clientId) {
                    return {
                        value,
                        clientId,
                    };
                }
                return filter;
            });
            this.setState({ isSaving: true });
            await indexPattern.save();
            this.updateFilters();
            this.setState({ isSaving: false });
        };
        this.state = {
            filterToDelete: undefined,
            isDeleteConfirmationModalVisible: false,
            isSaving: false,
            filters: [],
        };
    }
    UNSAFE_componentWillMount() {
        this.updateFilters();
    }
    render() {
        const { indexPattern, fieldWildcardMatcher } = this.props;
        const { isSaving, filterToDelete } = this.state;
        const filteredFilters = this.getFilteredFilters(this.state, this.props);
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(components_1.Header, null),
            react_1.default.createElement(components_1.AddFilter, { onAddFilter: this.onAddFilter }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" }),
            react_1.default.createElement(components_1.Table, { isSaving: isSaving, indexPattern: indexPattern, items: filteredFilters, fieldWildcardMatcher: fieldWildcardMatcher, deleteFilter: this.startDeleteFilter, saveFilter: this.saveFilter }),
            filterToDelete && (react_1.default.createElement(components_1.DeleteFilterConfirmationModal, { filterToDeleteValue: filterToDelete.value, onCancelConfirmationModal: this.hideDeleteConfirmationModal, onDeleteFilter: this.deleteFilter }))));
    }
}
exports.SourceFiltersTable = SourceFiltersTable;
