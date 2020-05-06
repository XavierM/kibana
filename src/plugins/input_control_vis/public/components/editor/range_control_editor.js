"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const index_pattern_select_form_row_1 = require("./index_pattern_select_form_row");
const field_select_1 = require("./field_select");
function filterField(field) {
    return field.type === 'number';
}
class RangeControlEditor extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            IndexPatternSelect: null,
        };
    }
    componentDidMount() {
        this.getIndexPatternSelect();
    }
    async getIndexPatternSelect() {
        const [, { data }] = await this.props.deps.core.getStartServices();
        this.setState({
            IndexPatternSelect: data.ui.IndexPatternSelect,
        });
    }
    render() {
        const stepSizeId = `stepSize-${this.props.controlIndex}`;
        const decimalPlacesId = `decimalPlaces-${this.props.controlIndex}`;
        if (this.state.IndexPatternSelect === null) {
            return null;
        }
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(index_pattern_select_form_row_1.IndexPatternSelectFormRow, { indexPatternId: this.props.controlParams.indexPattern, onChange: this.props.handleIndexPatternChange, controlIndex: this.props.controlIndex, IndexPatternSelect: this.state.IndexPatternSelect }),
            react_1.default.createElement(field_select_1.FieldSelect, { fieldName: this.props.controlParams.fieldName, indexPatternId: this.props.controlParams.indexPattern, filterField: filterField, onChange: this.props.handleFieldNameChange, getIndexPattern: this.props.getIndexPattern, controlIndex: this.props.controlIndex }),
            react_1.default.createElement(eui_1.EuiFormRow, { id: stepSizeId, label: react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.rangeControl.stepSizeLabel", defaultMessage: "Step Size" }) },
                react_1.default.createElement(eui_1.EuiFieldNumber, { value: this.props.controlParams.options.step, onChange: event => {
                        this.props.handleOptionsChange(this.props.controlIndex, 'step', event.target.valueAsNumber);
                    }, "data-test-subj": `rangeControlSizeInput${this.props.controlIndex}` })),
            react_1.default.createElement(eui_1.EuiFormRow, { id: decimalPlacesId, label: react_1.default.createElement(react_2.FormattedMessage, { id: "inputControl.editor.rangeControl.decimalPlacesLabel", defaultMessage: "Decimal Places" }) },
                react_1.default.createElement(eui_1.EuiFieldNumber, { min: 0, value: this.props.controlParams.options.decimalPlaces, onChange: event => {
                        this.props.handleOptionsChange(this.props.controlIndex, 'decimalPlaces', event.target.valueAsNumber);
                    }, "data-test-subj": `rangeControlDecimalPlacesInput${this.props.controlIndex}` }))));
    }
}
exports.RangeControlEditor = RangeControlEditor;
