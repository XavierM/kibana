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
const enzyme_1 = require("enzyme");
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const react_1 = tslib_1.__importDefault(require("react"));
jest.mock('angular-sanitize', () => { });
jest.mock('ui/new_platform', () => ({
    npStart: {
        core: {
            i18n: { Context: ({ children }) => react_1.default.createElement("div", null,
                    "Context: ",
                    children) },
        },
    },
}));
const _1 = require(".");
describe('ui/i18n', () => {
    test('renders children and forwards properties', () => {
        var _a;
        const mockPropTypes = {
            stringProp: prop_types_1.default.string.isRequired,
            numberProp: prop_types_1.default.number,
        };
        const WrappedComponent = _1.wrapInI18nContext((_a = class extends react_1.default.PureComponent {
                render() {
                    return (react_1.default.createElement("span", null,
                        "Child: ",
                        this.props.stringProp,
                        ":",
                        this.props.numberProp));
                }
            },
            _a.propTypes = mockPropTypes,
            _a));
        expect(WrappedComponent.propTypes).toBe(mockPropTypes);
        expect(enzyme_1.render(react_1.default.createElement(WrappedComponent, { stringProp: 'some prop', numberProp: 100500 }))).toMatchSnapshot();
    });
});
