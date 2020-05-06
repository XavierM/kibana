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
const react_2 = require("@kbn/i18n/react");
const i18n_1 = require("@kbn/i18n");
const step_index_pattern_1 = require("./components/step_index_pattern");
const step_time_field_1 = require("./components/step_time_field");
const header_1 = require("./components/header");
const loading_state_1 = require("./components/loading_state");
const empty_state_1 = require("./components/empty_state");
const constants_1 = require("./constants");
const lib_1 = require("./lib");
class CreateIndexPatternWizard extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            step: 1,
            indexPattern: '',
            allIndices: [],
            remoteClustersExist: false,
            isInitiallyLoadingIndices: true,
            isIncludingSystemIndices: false,
            toasts: [],
        };
        this.catchAndWarn = async (asyncFn, errorValue, errorMsg) => {
            try {
                return await asyncFn;
            }
            catch (errors) {
                this.setState(prevState => ({
                    toasts: prevState.toasts.concat([
                        {
                            title: errorMsg,
                            id: errorMsg.props.id,
                            color: 'warning',
                            iconType: 'alert',
                        },
                    ]),
                }));
                return errorValue;
            }
        };
        this.fetchData = async () => {
            const { services } = this.props;
            this.setState({
                allIndices: [],
                isInitiallyLoadingIndices: true,
                remoteClustersExist: false,
            });
            const indicesFailMsg = (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.loadIndicesFailMsg", defaultMessage: "Failed to load indices" }));
            const clustersFailMsg = (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.loadClustersFailMsg", defaultMessage: "Failed to load remote clusters" }));
            // query local and remote indices, updating state independently
            lib_1.ensureMinimumTime(this.catchAndWarn(lib_1.getIndices(services.es, services.indexPatternCreationType, `*`, constants_1.MAX_SEARCH_SIZE), [], indicesFailMsg)).then((allIndices) => this.setState({ allIndices, isInitiallyLoadingIndices: false }));
            this.catchAndWarn(
            // if we get an error from remote cluster query, supply fallback value that allows user entry.
            // ['a'] is fallback value
            lib_1.getIndices(services.es, services.indexPatternCreationType, `*:*`, 1), ['a'], clustersFailMsg).then((remoteIndices) => this.setState({ remoteClustersExist: !!remoteIndices.length }));
        };
        this.createIndexPattern = async (timeFieldName, indexPatternId) => {
            const { services } = this.props;
            const { indexPattern } = this.state;
            const emptyPattern = await services.indexPatterns.make();
            Object.assign(emptyPattern, {
                id: indexPatternId,
                title: indexPattern,
                timeFieldName,
                ...services.indexPatternCreationType.getIndexPatternMappings(),
            });
            const createdId = await emptyPattern.create();
            if (!createdId) {
                const confirmMessage = i18n_1.i18n.translate('kbn.management.indexPattern.titleExistsLabel', {
                    values: { title: emptyPattern.title },
                    defaultMessage: "An index pattern with the title '{title}' already exists.",
                });
                const isConfirmed = await services.openConfirm(confirmMessage, {
                    confirmButtonText: i18n_1.i18n.translate('kbn.management.indexPattern.goToPatternButtonLabel', {
                        defaultMessage: 'Go to existing pattern',
                    }),
                });
                if (isConfirmed) {
                    return services.changeUrl(`/management/kibana/index_patterns/${indexPatternId}`);
                }
                else {
                    return false;
                }
            }
            if (!services.uiSettings.get('defaultIndex')) {
                await services.uiSettings.set('defaultIndex', createdId);
            }
            services.indexPatterns.clearCache(createdId);
            services.changeUrl(`/management/kibana/index_patterns/${createdId}`);
        };
        this.goToTimeFieldStep = (indexPattern) => {
            this.setState({ step: 2, indexPattern });
        };
        this.goToIndexPatternStep = () => {
            this.setState({ step: 1 });
        };
        this.onChangeIncludingSystemIndices = () => {
            this.setState(prevState => ({
                isIncludingSystemIndices: !prevState.isIncludingSystemIndices,
            }));
        };
        this.removeToast = (id) => {
            this.setState(prevState => ({
                toasts: prevState.toasts.filter(toast => toast.id !== id),
            }));
        };
    }
    async UNSAFE_componentWillMount() {
        this.fetchData();
    }
    renderHeader() {
        const { isIncludingSystemIndices } = this.state;
        const { services } = this.props;
        return (react_1.default.createElement(header_1.Header, { prompt: services.indexPatternCreationType.renderPrompt(), showSystemIndices: services.indexPatternCreationType.getShowSystemIndices(), isIncludingSystemIndices: isIncludingSystemIndices, onChangeIncludingSystemIndices: this.onChangeIncludingSystemIndices, indexPatternName: services.indexPatternCreationType.getIndexPatternName(), isBeta: services.indexPatternCreationType.getIsBeta() }));
    }
    renderContent() {
        const { allIndices, isInitiallyLoadingIndices, isIncludingSystemIndices, step, indexPattern, remoteClustersExist, } = this.state;
        if (isInitiallyLoadingIndices) {
            return react_1.default.createElement(loading_state_1.LoadingState, null);
        }
        const hasDataIndices = allIndices.some(({ name }) => !name.startsWith('.'));
        if (!hasDataIndices && !isIncludingSystemIndices && !remoteClustersExist) {
            return react_1.default.createElement(empty_state_1.EmptyState, { onRefresh: this.fetchData });
        }
        if (step === 1) {
            const { services, initialQuery } = this.props;
            return (react_1.default.createElement(step_index_pattern_1.StepIndexPattern, { allIndices: allIndices, initialQuery: indexPattern || initialQuery, isIncludingSystemIndices: isIncludingSystemIndices, esService: services.es, savedObjectsClient: services.savedObjectsClient, indexPatternCreationType: services.indexPatternCreationType, goToNextStep: this.goToTimeFieldStep, uiSettings: services.uiSettings }));
        }
        if (step === 2) {
            const { services } = this.props;
            return (react_1.default.createElement(step_time_field_1.StepTimeField, { indexPattern: indexPattern, indexPatternsService: services.indexPatterns, goToPreviousStep: this.goToIndexPatternStep, createIndexPattern: this.createIndexPattern, indexPatternCreationType: services.indexPatternCreationType }));
        }
        return null;
    }
    render() {
        const header = this.renderHeader();
        const content = this.renderContent();
        return (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement("div", null,
                header,
                content),
            react_1.default.createElement(eui_1.EuiGlobalToastList, { toasts: this.state.toasts, dismissToast: ({ id }) => {
                    this.removeToast(id);
                }, toastLifeTimeMs: 6000 })));
    }
}
exports.CreateIndexPatternWizard = CreateIndexPatternWizard;
