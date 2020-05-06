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
const public_1 = require("../../../../../kibana_react/public");
/**
 * Since both "phrase" and "phrases" filter inputs suggest values (if enabled and the field is
 * aggregatable), we pull out the common logic for requesting suggestions into this component
 * which both of them extend.
 */
class PhraseSuggestorUI extends react_1.Component {
    constructor() {
        super(...arguments);
        this.services = this.props.kibana.services;
        this.state = {
            suggestions: [],
            isLoading: false,
        };
        this.onSearchChange = (value) => {
            this.updateSuggestions(`${value}`);
        };
        this.updateSuggestions = lodash_1.debounce(async (query = '') => {
            const { indexPattern, field } = this.props;
            if (!field || !this.isSuggestingValues()) {
                return;
            }
            this.setState({ isLoading: true });
            const suggestions = await this.services.data.autocomplete.getValueSuggestions({
                indexPattern,
                field,
                query,
            });
            this.setState({ suggestions, isLoading: false });
        }, 500);
    }
    componentDidMount() {
        this.updateSuggestions();
    }
    isSuggestingValues() {
        const shouldSuggestValues = this.services.uiSettings.get('filterEditor:suggestValues');
        const { field } = this.props;
        return shouldSuggestValues && field && field.aggregatable && field.type === 'string';
    }
}
exports.PhraseSuggestorUI = PhraseSuggestorUI;
exports.PhraseSuggestor = public_1.withKibana(PhraseSuggestorUI);
