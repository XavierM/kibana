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
const lib_1 = require("../../lib");
const header_1 = require("./components/header");
const time_field_1 = require("./components/time_field");
const advanced_options_1 = require("./components/advanced_options");
const action_buttons_1 = require("./components/action_buttons");
class StepTimeField extends react_1.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            timeFields: [],
            selectedTimeField: undefined,
            timeFieldSet: false,
            isAdvancedOptionsVisible: false,
            isFetchingTimeFields: false,
            isCreating: false,
            indexPatternId: '',
            indexPatternType: '',
            indexPatternName: '',
        };
        this.mounted = false;
        this.fetchTimeFields = async () => {
            const { indexPatternsService, indexPattern: pattern } = this.props;
            const { getFetchForWildcardOptions } = this.props.indexPatternCreationType;
            const indexPattern = await indexPatternsService.make();
            indexPattern.title = pattern;
            this.setState({ isFetchingTimeFields: true });
            const fields = await lib_1.ensureMinimumTime(indexPattern.fieldsFetcher.fetchForWildcard(pattern, getFetchForWildcardOptions()));
            const timeFields = lib_1.extractTimeFields(fields);
            this.setState({ timeFields, isFetchingTimeFields: false });
        };
        this.onTimeFieldChanged = (e) => {
            const value = e.target.value;
            // Find the time field based on the selected value
            const timeField = this.state.timeFields.find((timeFld) => timeFld.fieldName === value);
            // If the value is an empty string, it's not a valid selection
            const validSelection = value !== '';
            this.setState({
                selectedTimeField: timeField ? timeField.fieldName : undefined,
                timeFieldSet: validSelection,
            });
        };
        this.onChangeIndexPatternId = (e) => {
            this.setState({ indexPatternId: e.target.value });
        };
        this.toggleAdvancedOptions = () => {
            this.setState(state => ({
                isAdvancedOptionsVisible: !state.isAdvancedOptionsVisible,
            }));
        };
        this.createIndexPattern = async () => {
            const { createIndexPattern } = this.props;
            const { selectedTimeField, indexPatternId } = this.state;
            this.setState({ isCreating: true });
            try {
                await createIndexPattern(selectedTimeField, indexPatternId);
            }
            catch (error) {
                if (!this.mounted)
                    return;
                this.setState({
                    error: error instanceof Error ? error.message : String(error),
                    isCreating: false,
                });
            }
        };
        this.state.indexPatternType = props.indexPatternCreationType.getIndexPatternType() || '';
        this.state.indexPatternName = props.indexPatternCreationType.getIndexPatternName();
    }
    componentDidMount() {
        this.mounted = true;
        this.fetchTimeFields();
    }
    componentWillUnmount() {
        this.mounted = false;
    }
    formatErrorMessage(message) {
        // `createIndexPattern` throws "Conflict" when index pattern ID already exists.
        return message === 'Conflict' ? (react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.patterAlreadyExists", defaultMessage: "Custom index pattern ID already exists." })) : (message);
    }
    render() {
        const { timeFields, selectedTimeField, timeFieldSet, isAdvancedOptionsVisible, indexPatternId, isCreating, isFetchingTimeFields, indexPatternName, } = this.state;
        if (isCreating) {
            return (react_1.default.createElement(eui_1.EuiPanel, null,
                react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center" },
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiLoadingSpinner, null)),
                    react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                        react_1.default.createElement(eui_1.EuiText, null,
                            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.creatingLabel", defaultMessage: "Creating index pattern\u2026" }))))));
        }
        const { indexPattern, goToPreviousStep } = this.props;
        const timeFieldOptions = timeFields.length > 0
            ? [
                { text: '', value: '' },
                ...timeFields.map((timeField) => ({
                    text: timeField.display,
                    value: timeField.fieldName,
                    disabled: timeFields.isDisabled,
                })),
            ]
            : [];
        const showTimeField = !timeFields || timeFields.length > 1;
        const submittable = !showTimeField || timeFieldSet;
        const error = this.state.error ? (react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(eui_1.EuiCallOut, { title: react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.stepTime.error", defaultMessage: "Error" }), color: "danger", iconType: "cross" },
                react_1.default.createElement("p", null, this.formatErrorMessage(this.state.error))),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }))) : null;
        return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "l" },
            react_1.default.createElement(header_1.Header, { indexPattern: indexPattern, indexPatternName: indexPatternName }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(time_field_1.TimeField, { isVisible: showTimeField, fetchTimeFields: this.fetchTimeFields, timeFieldOptions: timeFieldOptions, isLoading: isFetchingTimeFields, selectedTimeField: selectedTimeField, onTimeFieldChanged: this.onTimeFieldChanged }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
            react_1.default.createElement(advanced_options_1.AdvancedOptions, { isVisible: isAdvancedOptionsVisible, indexPatternId: indexPatternId, toggleAdvancedOptions: this.toggleAdvancedOptions, onChangeIndexPatternId: this.onChangeIndexPatternId }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            error,
            react_1.default.createElement(action_buttons_1.ActionButtons, { goToPreviousStep: goToPreviousStep, submittable: submittable, createIndexPattern: this.createIndexPattern })));
    }
}
exports.StepTimeField = StepTimeField;
