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
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../../../../../../../../plugins/data/public");
const constants_1 = require("../../constants");
const lib_1 = require("../../lib");
const loading_indices_1 = require("./components/loading_indices");
const status_message_1 = require("./components/status_message");
const indices_list_1 = require("./components/indices_list");
const header_1 = require("./components/header");
class StepIndexPattern extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            partialMatchedIndices: [],
            exactMatchedIndices: [],
            isLoadingIndices: false,
            existingIndexPatterns: [],
            indexPatternExists: false,
            query: '',
            appendedWildcard: false,
            showingIndexPatternQueryErrors: false,
            indexPatternName: '',
        };
        this.ILLEGAL_CHARACTERS = [...public_1.indexPatterns.ILLEGAL_CHARACTERS];
        this.fetchExistingIndexPatterns = async () => {
            const { savedObjects } = await this.props.savedObjectsClient.find({
                type: 'index-pattern',
                fields: ['title'],
                perPage: 10000,
            });
            const existingIndexPatterns = savedObjects.map(obj => obj && obj.attributes ? obj.attributes.title : '');
            this.setState({ existingIndexPatterns });
        };
        this.fetchIndices = async (query) => {
            const { esService, indexPatternCreationType } = this.props;
            const { existingIndexPatterns } = this.state;
            if (existingIndexPatterns.includes(query)) {
                this.setState({ indexPatternExists: true });
                return;
            }
            this.setState({ isLoadingIndices: true, indexPatternExists: false });
            if (query.endsWith('*')) {
                const exactMatchedIndices = await lib_1.ensureMinimumTime(lib_1.getIndices(esService, indexPatternCreationType, query, constants_1.MAX_SEARCH_SIZE));
                // If the search changed, discard this state
                if (query !== this.lastQuery) {
                    return;
                }
                this.setState({ exactMatchedIndices, isLoadingIndices: false });
                return;
            }
            const [partialMatchedIndices, exactMatchedIndices] = await lib_1.ensureMinimumTime([
                lib_1.getIndices(esService, indexPatternCreationType, `${query}*`, constants_1.MAX_SEARCH_SIZE),
                lib_1.getIndices(esService, indexPatternCreationType, query, constants_1.MAX_SEARCH_SIZE),
            ]);
            // If the search changed, discard this state
            if (query !== this.lastQuery) {
                return;
            }
            this.setState({
                partialMatchedIndices,
                exactMatchedIndices,
                isLoadingIndices: false,
            });
        };
        this.onQueryChanged = (e) => {
            const { appendedWildcard } = this.state;
            const { target } = e;
            let query = target.value;
            if (query.length === 1 && lib_1.canAppendWildcard(query)) {
                query += '*';
                this.setState({ appendedWildcard: true });
                setTimeout(() => target.setSelectionRange(1, 1));
            }
            else {
                if (query === '*' && appendedWildcard) {
                    query = '';
                    this.setState({ appendedWildcard: false });
                }
            }
            this.lastQuery = query;
            this.setState({ query, showingIndexPatternQueryErrors: !!query.length });
            this.fetchIndices(query);
        };
        const { indexPatternCreationType, initialQuery } = this.props;
        this.state.query = initialQuery || props.uiSettings.get('indexPattern:placeholder');
        this.state.indexPatternName = indexPatternCreationType.getIndexPatternName();
    }
    async UNSAFE_componentWillMount() {
        this.fetchExistingIndexPatterns();
        if (this.state.query) {
            this.lastQuery = this.state.query;
            this.fetchIndices(this.state.query);
        }
    }
    renderLoadingState() {
        const { isLoadingIndices } = this.state;
        if (!isLoadingIndices) {
            return null;
        }
        return react_1.default.createElement(loading_indices_1.LoadingIndices, { "data-test-subj": "createIndexPatternStep1Loading" });
    }
    renderStatusMessage(matchedIndices) {
        const { indexPatternCreationType, isIncludingSystemIndices } = this.props;
        const { query, isLoadingIndices, indexPatternExists } = this.state;
        if (isLoadingIndices || indexPatternExists) {
            return null;
        }
        return (react_1.default.createElement(status_message_1.StatusMessage, { matchedIndices: matchedIndices, showSystemIndices: indexPatternCreationType.getShowSystemIndices(), isIncludingSystemIndices: isIncludingSystemIndices, query: query }));
    }
    renderList({ visibleIndices, allIndices, }) {
        const { query, isLoadingIndices, indexPatternExists } = this.state;
        if (isLoadingIndices || indexPatternExists) {
            return null;
        }
        const indicesToList = query.length ? visibleIndices : allIndices;
        return (react_1.default.createElement(indices_list_1.IndicesList, { "data-test-subj": "createIndexPatternStep1IndicesList", query: query, indices: indicesToList }));
    }
    renderIndexPatternExists() {
        const { indexPatternExists, query } = this.state;
        if (!indexPatternExists) {
            return null;
        }
        return (react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.warningHeader", defaultMessage: "There's already an index pattern called {query}", values: { query } }), iconType: "help", color: "warning" }));
    }
    renderHeader({ exactMatchedIndices: indices }) {
        const { goToNextStep, indexPatternCreationType } = this.props;
        const { query, showingIndexPatternQueryErrors, indexPatternExists, indexPatternName, } = this.state;
        let containsErrors = false;
        const errors = [];
        const characterList = this.ILLEGAL_CHARACTERS.slice(0, this.ILLEGAL_CHARACTERS.length - 1).join(', ');
        const checkIndices = indexPatternCreationType.checkIndicesForErrors(indices);
        if (!query || !query.length || query === '.' || query === '..') {
            // This is an error scenario but do not report an error
            containsErrors = true;
        }
        else if (lib_1.containsIllegalCharacters(query, public_1.indexPatterns.ILLEGAL_CHARACTERS)) {
            const errorMessage = i18n_1.i18n.translate('kbn.management.createIndexPattern.step.invalidCharactersErrorMessage', {
                defaultMessage: 'A {indexPatternName} cannot contain spaces or the characters: {characterList}',
                values: { characterList, indexPatternName },
            });
            errors.push(errorMessage);
            containsErrors = true;
        }
        else if (checkIndices) {
            errors.push(...checkIndices);
            containsErrors = true;
        }
        const isInputInvalid = showingIndexPatternQueryErrors && containsErrors && errors.length > 0;
        const isNextStepDisabled = containsErrors || indices.length === 0 || indexPatternExists;
        return (react_1.default.createElement(header_1.Header, { "data-test-subj": "createIndexPatternStep1Header", isInputInvalid: isInputInvalid, errors: errors, characterList: characterList, query: query, onQueryChanged: this.onQueryChanged, goToNextStep: goToNextStep, isNextStepDisabled: isNextStepDisabled }));
    }
    render() {
        const { isIncludingSystemIndices, allIndices } = this.props;
        const { partialMatchedIndices, exactMatchedIndices } = this.state;
        const matchedIndices = lib_1.getMatchedIndices(allIndices, partialMatchedIndices, exactMatchedIndices, isIncludingSystemIndices);
        return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
            this.renderHeader(matchedIndices),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            this.renderLoadingState(),
            this.renderIndexPatternExists(),
            this.renderStatusMessage(matchedIndices),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            this.renderList(matchedIndices)));
    }
}
exports.StepIndexPattern = StepIndexPattern;
