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
const suggestions_component_1 = require("./suggestions_component");
const noop = () => {
    return;
};
const mockSuggestions = [
    {
        description: 'This is not a helpful suggestion',
        end: 0,
        start: 42,
        text: 'as promised, not helpful',
        type: autocomplete_1.QuerySuggestionTypes.Value,
    },
    {
        description: 'This is another unhelpful suggestion',
        end: 0,
        start: 42,
        text: 'yep',
        type: autocomplete_1.QuerySuggestionTypes.Field,
    },
];
describe('SuggestionsComponent', () => {
    it('Should not display anything if the show prop is false', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(suggestions_component_1.SuggestionsComponent, { index: 0, onClick: noop, onMouseEnter: noop, show: false, suggestions: mockSuggestions, loadMore: noop }));
        expect(component.isEmptyRender()).toBe(true);
    });
    it('Should not display anything if there are no suggestions', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(suggestions_component_1.SuggestionsComponent, { index: 0, onClick: noop, onMouseEnter: noop, show: true, suggestions: [], loadMore: noop }));
        expect(component.isEmptyRender()).toBe(true);
    });
    it('Should display given suggestions if the show prop is true', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(suggestions_component_1.SuggestionsComponent, { index: 0, onClick: noop, onMouseEnter: noop, show: true, suggestions: mockSuggestions, loadMore: noop }));
        expect(component.isEmptyRender()).toBe(false);
        expect(component).toMatchSnapshot();
    });
    it('Passing the index should control which suggestion is selected', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(suggestions_component_1.SuggestionsComponent, { index: 1, onClick: noop, onMouseEnter: noop, show: true, suggestions: mockSuggestions, loadMore: noop }));
        expect(component).toMatchSnapshot();
    });
    it('Should call onClick with the selected suggestion when it is clicked', () => {
        const mockCallback = jest.fn();
        const component = enzyme_1.mount(react_1.default.createElement(suggestions_component_1.SuggestionsComponent, { index: 0, onClick: mockCallback, onMouseEnter: noop, show: true, suggestions: mockSuggestions, loadMore: noop }));
        component
            .find(suggestion_component_1.SuggestionComponent)
            .at(1)
            .simulate('click');
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(mockSuggestions[1]);
    });
    it('Should call onMouseEnter with the index of the suggestion that was entered', () => {
        const mockCallback = jest.fn();
        const component = enzyme_1.mount(react_1.default.createElement(suggestions_component_1.SuggestionsComponent, { index: 0, onClick: noop, onMouseEnter: mockCallback, show: true, suggestions: mockSuggestions, loadMore: noop }));
        component
            .find(suggestion_component_1.SuggestionComponent)
            .at(1)
            .simulate('mouseenter');
        expect(mockCallback).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(1);
    });
});
