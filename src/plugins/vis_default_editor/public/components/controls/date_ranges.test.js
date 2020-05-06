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
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const date_ranges_1 = require("./date_ranges");
const public_1 = require("../../../../kibana_react/public");
const mocks_1 = require("../../../../../core/public/mocks");
describe('DateRangesParamEditor component', () => {
    let setValue;
    let setValidity;
    let setTouched;
    let defaultProps;
    beforeEach(() => {
        setValue = jest.fn();
        setValidity = jest.fn();
        setTouched = jest.fn();
        defaultProps = {
            agg: {},
            aggParam: {
                name: 'ranges',
            },
            value: [],
            editorConfig: {},
            showValidation: false,
            setValue,
            setValidity,
            setTouched,
        };
    });
    function DateRangesWrapped(props) {
        const services = {
            docLinks: mocks_1.docLinksServiceMock.createStartContract(),
        };
        return (react_1.default.createElement(public_1.KibanaContextProvider, { services: services },
            react_1.default.createElement(date_ranges_1.DateRangesParamEditor, Object.assign({}, props))));
    }
    it('should add default range if there is an empty ininitial value', () => {
        enzyme_helpers_1.mountWithIntl(react_1.default.createElement(DateRangesWrapped, Object.assign({}, defaultProps)));
        expect(setValue).toHaveBeenCalledWith([{}]);
    });
    it('should validate range values with date math', function () {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(DateRangesWrapped, Object.assign({}, defaultProps)));
        // should allow empty values
        expect(setValidity).toHaveBeenNthCalledWith(1, true);
        component.setProps({ value: [{ from: 'hello, world' }] });
        expect(setValidity).toHaveBeenNthCalledWith(2, false);
        component.setProps({ value: [{ from: 'now' }] });
        expect(setValidity).toHaveBeenNthCalledWith(3, true);
        component.setProps({ value: [{ from: 'now', to: 'Hello, Dan! =)' }] });
        expect(setValidity).toHaveBeenNthCalledWith(4, false);
        component.setProps({ value: [{ from: '2012-02-28' }] });
        expect(setValidity).toHaveBeenNthCalledWith(5, true);
        component.setProps({ value: [{ from: 'now+-5w', to: 'now-3d' }] });
        expect(setValidity).toHaveBeenNthCalledWith(6, false);
        component.setProps({ value: [{ from: 'now-3M/M' }] });
        expect(setValidity).toHaveBeenNthCalledWith(7, true);
        component.setProps({ value: [{ from: '2012-02-31', to: 'now-3d' }] });
        expect(setValidity).toHaveBeenNthCalledWith(8, false);
        component.setProps({ value: [{ to: '2012-05-31||-3M/M' }] });
        expect(setValidity).toHaveBeenNthCalledWith(9, true);
        component.setProps({ value: [{ from: '5/5/2005+3d' }] });
        expect(setValidity).toHaveBeenNthCalledWith(10, false);
    });
});
