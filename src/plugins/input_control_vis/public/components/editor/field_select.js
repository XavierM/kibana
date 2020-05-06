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
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const react_1 = tslib_1.__importStar(require("react"));
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
class FieldSelectUi extends react_1.Component {
    constructor(props) {
        super(props);
        this.loadFields = (indexPatternId) => {
            this.setState({
                isLoading: true,
                fields: [],
                indexPatternId,
            }, this.debouncedLoad.bind(null, indexPatternId));
        };
        this.debouncedLoad = lodash_1.default.debounce(async (indexPatternId) => {
            if (!indexPatternId || indexPatternId.length === 0) {
                return;
            }
            let indexPattern;
            try {
                indexPattern = await this.props.getIndexPattern(indexPatternId);
            }
            catch (err) {
                // index pattern no longer exists
                return;
            }
            if (this.hasUnmounted) {
                return;
            }
            // props.indexPatternId may be updated before getIndexPattern returns
            // ignore response when fetched index pattern does not match active index pattern
            if (indexPattern.id !== this.state.indexPatternId) {
                return;
            }
            const fieldsByTypeMap = new Map();
            const fields = [];
            indexPattern.fields
                .filter(this.props.filterField ?? (() => true))
                .forEach((field) => {
                const fieldsList = fieldsByTypeMap.get(field.type) ?? [];
                fieldsList.push(field.name);
                fieldsByTypeMap.set(field.type, fieldsList);
            });
            fieldsByTypeMap.forEach((fieldsList, fieldType) => {
                fields.push({
                    label: fieldType,
                    options: fieldsList.sort().map(fieldName => {
                        return { value: fieldName, label: fieldName };
                    }),
                });
            });
            fields.sort((a, b) => {
                if (a.label < b.label)
                    return -1;
                if (a.label > b.label)
                    return 1;
                return 0;
            });
            this.setState({
                isLoading: false,
                fields,
            });
        }, 300);
        this.onChange = (selectedOptions) => {
            this.props.onChange(lodash_1.default.get(selectedOptions, '0.value'));
        };
        this.hasUnmounted = false;
        this.state = {
            isLoading: false,
            fields: [],
            indexPatternId: props.indexPatternId,
        };
    }
    componentWillUnmount() {
        this.hasUnmounted = true;
    }
    componentDidMount() {
        this.loadFields(this.state.indexPatternId);
    }
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (this.props.indexPatternId !== nextProps.indexPatternId) {
            this.loadFields(nextProps.indexPatternId ?? '');
        }
    }
    render() {
        if (!this.props.indexPatternId || this.props.indexPatternId.trim().length === 0) {
            return null;
        }
        const selectId = `fieldSelect-${this.props.controlIndex}`;
        const selectedOptions = [];
        const { intl } = this.props;
        if (this.props.fieldName) {
            selectedOptions.push({ value: this.props.fieldName, label: this.props.fieldName });
        }
        return (react_1.default.createElement(eui_1.EuiFormRow, { id: selectId, label: react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.fieldSelect.fieldLabel", defaultMessage: "Field" }) },
            react_1.default.createElement(eui_1.EuiComboBox, { placeholder: intl.formatMessage({
                    id: 'inputControl.editor.fieldSelect.selectFieldPlaceholder',
                    defaultMessage: 'Select field...',
                }), singleSelection: true, isLoading: this.state.isLoading, options: this.state.fields, selectedOptions: selectedOptions, onChange: this.onChange, "data-test-subj": selectId })));
    }
}
exports.FieldSelect = react_2.injectI18n(FieldSelectUi);
