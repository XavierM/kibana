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
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const lib_1 = require("../../lib");
class Search extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.categories = [];
        this.state = {
            isSearchTextValid: true,
            parseErrorMessage: null,
        };
        this.onChange = ({ query, error }) => {
            if (error) {
                this.setState({
                    isSearchTextValid: false,
                    parseErrorMessage: error.message,
                });
                return;
            }
            this.setState({
                isSearchTextValid: true,
                parseErrorMessage: null,
            });
            this.props.onQueryChange({ query: query });
        };
        const { categories } = props;
        this.categories = categories.map(category => {
            return {
                value: category,
                name: lib_1.getCategoryName(category),
            };
        });
    }
    render() {
        const { query } = this.props;
        const box = {
            incremental: true,
            'data-test-subj': 'settingsSearchBar',
            'aria-label': i18n_1.i18n.translate('advancedSettings.searchBarAriaLabel', {
                defaultMessage: 'Search advanced settings',
            }),
        };
        const filters = [
            {
                type: 'field_value_selection',
                field: 'category',
                name: i18n_1.i18n.translate('advancedSettings.categorySearchLabel', {
                    defaultMessage: 'Category',
                }),
                multiSelect: 'or',
                options: this.categories,
            },
        ];
        let queryParseError;
        if (!this.state.isSearchTextValid) {
            const parseErrorMsg = i18n_1.i18n.translate('advancedSettings.searchBar.unableToParseQueryErrorMessage', { defaultMessage: 'Unable to parse query' });
            queryParseError = (react_1.default.createElement(eui_1.EuiFormErrorText, null, `${parseErrorMsg}. ${this.state.parseErrorMessage}`));
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiSearchBar, { box: box, filters: filters, onChange: this.onChange, query: query }),
            queryParseError));
    }
}
exports.Search = Search;
