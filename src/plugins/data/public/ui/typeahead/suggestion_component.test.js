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
const react_1 = tslib_1.__importDefault(require("react"));
const autocomplete_1 = require("../../autocomplete");
const suggestion_component_1 = require("./suggestion_component");
const noop = () => {
    return;
};
const mockSuggestion = {
    description: 'This is not a helpful suggestion',
    end: 0,
    start: 42,
    text: 'as promised, not helpful',
    type: autocomplete_1.QuerySuggestionTypes.Value,
};
describe('SuggestionComponent', () => {
    it('Should display the suggestion and use the provided ariaId', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(suggestion_component_1.SuggestionComponent, { onClick: noop, onMouseEnter: noop, selected: false, suggestion: mockSuggestion, innerRef: noop, ariaId: 'suggestion-1' }));
        expect(component).toMatchSnapshot();
    });
    it('Should make the element active if the selected prop is true', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(suggestion_component_1.SuggestionComponent, { onClick: noop, onMouseEnter: noop, selected: true, suggestion: mockSuggestion, innerRef: noop, ariaId: 'suggestion-1' }));
        expect(component).toMatchSnapshot();
    });
    it('Should call innerRef with a reference to the root div element', () => {
        const innerRefCallback = (ref) => {
            expect(ref.className).toBe('kbnTypeahead__item');
            expect(ref.id).toBe('suggestion-1');
        };
        enzyme_1.mount(react_1.default.createElement(suggestion_component_1.SuggestionComponent, { onClick: noop, onMouseEnter: noop, selected: false, suggestion: mockSuggestion, innerRef: innerRefCallback, ariaId: 'suggestion-1' }));
    });
    it('Should call onClick with the provided suggestion', () => {
        const mockHandler = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(suggestion_component_1.SuggestionComponent, { onClick: mockHandler, onMouseEnter: noop, selected: false, suggestion: mockSuggestion, innerRef: noop, ariaId: 'suggestion-1' }));
        component.simulate('click');
        expect(mockHandler).toHaveBeenCalledTimes(1);
        expect(mockHandler).toHaveBeenCalledWith(mockSuggestion);
    });
    it('Should call onMouseEnter when user mouses over the element', () => {
        const mockHandler = jest.fn();
        const component = enzyme_1.shallow(react_1.default.createElement(suggestion_component_1.SuggestionComponent, { onClick: noop, onMouseEnter: mockHandler, selected: false, suggestion: mockSuggestion, innerRef: noop, ariaId: 'suggestion-1' }));
        component.simulate('mouseenter');
        expect(mockHandler).toHaveBeenCalledTimes(1);
    });
});
