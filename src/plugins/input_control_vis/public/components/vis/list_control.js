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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const form_row_1 = require("./form_row");
class ListControlUi extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.isMounted = false;
        this.state = {
            isLoading: false,
        };
        this.componentDidMount = () => {
            if (this.textInput) {
                this.textInput.setAttribute('focusable', 'false'); // remove when #59039 is fixed
            }
            this.isMounted = true;
        };
        this.componentWillUnmount = () => {
            this.isMounted = false;
        };
        this.setTextInputRef = (ref) => {
            this.textInput = ref;
        };
        this.handleOnChange = (selectedOptions) => {
            const selectedValues = selectedOptions.map(({ value }) => {
                return value;
            });
            this.props.stageFilter(this.props.controlIndex, selectedValues);
        };
        this.debouncedFetch = lodash_1.default.debounce(async (searchValue) => {
            if (this.props.fetchOptions) {
                await this.props.fetchOptions(searchValue);
            }
            if (this.isMounted) {
                this.setState({
                    isLoading: false,
                });
            }
        }, 300);
        this.onSearchChange = (searchValue) => {
            this.setState({
                isLoading: true,
            }, this.debouncedFetch.bind(null, searchValue));
        };
        this.textInput = null;
    }
    renderControl() {
        const { intl } = this.props;
        if (this.props.disableMsg) {
            return (react_1.default.createElement(eui_1.EuiFieldText, { placeholder: intl.formatMessage({
                    id: 'inputControl.vis.listControl.selectTextPlaceholder',
                    defaultMessage: 'Select...',
                }), disabled: true }));
        }
        const options = this.props.options
            ?.map(option => {
            return {
                label: this.props.formatOptionLabel(option).toString(),
                value: option,
                ['data-test-subj']: `option_${option.toString().replace(' ', '_')}`,
            };
        })
            .sort((a, b) => {
            return a.label.toLowerCase().localeCompare(b.label.toLowerCase());
        });
        const selectedOptions = this.props.selectedOptions.map(selectedOption => {
            return {
                label: this.props.formatOptionLabel(selectedOption).toString(),
                value: selectedOption,
            };
        });
        return (react_1.default.createElement(eui_1.EuiComboBox, { placeholder: intl.formatMessage({
                id: 'inputControl.vis.listControl.selectPlaceholder',
                defaultMessage: 'Select...',
            }), options: options, isLoading: this.state.isLoading, async: this.props.dynamicOptions, onSearchChange: this.props.dynamicOptions ? this.onSearchChange : undefined, selectedOptions: selectedOptions, onChange: this.handleOnChange, singleSelection: !this.props.multiselect, "data-test-subj": `listControlSelect${this.props.controlIndex}`, inputRef: this.setTextInputRef }));
    }
    render() {
        const partialResultsWarningMessage = i18n_1.i18n.translate('inputControl.vis.listControl.partialResultsWarningMessage', {
            defaultMessage: 'Terms list might be incomplete because the request is taking too long. ' +
                'Adjust the autocomplete settings in kibana.yml for complete results.',
        });
        return (react_1.default.createElement(form_row_1.FormRow, { id: this.props.id, label: this.props.label, warningMsg: this.props.partialResults ? partialResultsWarningMessage : undefined, controlIndex: this.props.controlIndex, disableMsg: this.props.disableMsg }, this.renderControl()));
    }
}
ListControlUi.defaultProps = {
    dynamicOptions: false,
    multiselect: true,
    selectedOptions: [],
    options: [],
};
exports.ListControl = react_2.injectI18n(ListControlUi);
