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
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const label_options_1 = require("./label_options");
const common_1 = require("../../common");
const mocks_1 = require("./mocks");
const FILTER = 'filter';
const ROTATE = 'rotate';
const DISABLED = 'disabled';
describe('LabelOptions component', () => {
    let setAxisLabel;
    let defaultProps;
    beforeEach(() => {
        setAxisLabel = jest.fn();
        defaultProps = {
            axisLabels: { ...mocks_1.valueAxis.labels },
            axisFilterCheckboxName: '',
            setAxisLabel,
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(label_options_1.LabelOptions, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should show other fields when axis.labels.show is true', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(label_options_1.LabelOptions, Object.assign({}, defaultProps)));
        expect(comp.find({ paramName: FILTER }).prop(DISABLED)).toBeFalsy();
        expect(comp.find({ paramName: ROTATE }).prop(DISABLED)).toBeFalsy();
        expect(comp.find(common_1.TruncateLabelsOption).prop(DISABLED)).toBeFalsy();
    });
    it('should disable other fields when axis.labels.show is false', () => {
        defaultProps.axisLabels.show = false;
        const comp = enzyme_1.shallow(react_1.default.createElement(label_options_1.LabelOptions, Object.assign({}, defaultProps)));
        expect(comp.find({ paramName: FILTER }).prop(DISABLED)).toBeTruthy();
        expect(comp.find({ paramName: ROTATE }).prop(DISABLED)).toBeTruthy();
        expect(comp.find(common_1.TruncateLabelsOption).prop(DISABLED)).toBeTruthy();
    });
    it('should set rotate as number', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(label_options_1.LabelOptions, Object.assign({}, defaultProps)));
        comp.find({ paramName: ROTATE }).prop('setValue')(ROTATE, '5');
        expect(setAxisLabel).toBeCalledWith('rotate', 5);
    });
    it('should set filter value', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(label_options_1.LabelOptions, Object.assign({}, defaultProps)));
        comp.find({ paramName: FILTER }).prop('setValue')(FILTER, false);
        expect(setAxisLabel).toBeCalledWith(FILTER, false);
    });
    it('should set value for valueAxes', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(label_options_1.LabelOptions, Object.assign({}, defaultProps)));
        comp.find(common_1.TruncateLabelsOption).prop('setValue')('truncate', 10);
        expect(setAxisLabel).toBeCalledWith('truncate', 10);
    });
});
