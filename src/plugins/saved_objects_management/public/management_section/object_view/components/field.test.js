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
const react_2 = require("@kbn/i18n/react");
const field_1 = require("./field");
describe('Field component', () => {
    const mountField = (props) => enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null,
        react_1.default.createElement(field_1.Field, Object.assign({}, props)))).find('Field');
    const defaultProps = {
        type: 'text',
        name: 'field',
        value: '',
        disabled: false,
        state: undefined,
        onChange: (name, state) => undefined,
    };
    it('uses the field name as the label', () => {
        let mounted = mountField({ ...defaultProps, name: 'some.name' });
        expect(mounted.find('EuiFormLabel').text()).toMatchInlineSnapshot(`"some.name"`);
        mounted = mountField({ ...defaultProps, name: 'someother.name' });
        expect(mounted.find('EuiFormLabel').text()).toMatchInlineSnapshot(`"someother.name"`);
    });
    it('renders a EuiCodeEditor for json type', () => {
        const mounted = mountField({ ...defaultProps, type: 'json' });
        expect(mounted.exists('EuiCodeEditor')).toEqual(true);
    });
    it('renders a EuiCodeEditor for array type', () => {
        const mounted = mountField({ ...defaultProps, type: 'array' });
        expect(mounted.exists('EuiCodeEditor')).toEqual(true);
    });
    it('renders a EuiSwitch for boolean type', () => {
        const mounted = mountField({ ...defaultProps, type: 'boolean' });
        expect(mounted.exists('EuiSwitch')).toEqual(true);
    });
    it('display correct label for boolean type depending on value', () => {
        let mounted = mountField({ ...defaultProps, type: 'boolean', value: true });
        expect(mounted.find('EuiSwitch').text()).toMatchInlineSnapshot(`"On"`);
        mounted = mountField({ ...defaultProps, type: 'boolean', value: false });
        expect(mounted.find('EuiSwitch').text()).toMatchInlineSnapshot(`"Off"`);
    });
    it('renders a EuiFieldNumber for number type', () => {
        const mounted = mountField({ ...defaultProps, type: 'number' });
        expect(mounted.exists('EuiFieldNumber')).toEqual(true);
    });
    it('renders a EuiFieldText for text type', () => {
        const mounted = mountField({ ...defaultProps, type: 'text' });
        expect(mounted.exists('EuiFieldText')).toEqual(true);
    });
    it('renders a EuiFieldText as fallback', () => {
        const mounted = mountField({ ...defaultProps, type: 'unknown-type' });
        expect(mounted.exists('EuiFieldText')).toEqual(true);
    });
});
