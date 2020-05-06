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
const indices_list_1 = require("../indices_list");
const enzyme_1 = require("enzyme");
const indices = [
    { name: 'kibana', tags: [] },
    { name: 'es', tags: [] },
];
describe('IndicesList', () => {
    it('should render normally', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(indices_list_1.IndicesList, { indices: indices, query: "" }));
        expect(component).toMatchSnapshot();
    });
    it('should change pages', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(indices_list_1.IndicesList, { indices: indices, query: "" }));
        const instance = component.instance();
        component.setState({ perPage: 1 });
        instance.onChangePage(1);
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should change per page', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(indices_list_1.IndicesList, { indices: indices, query: "" }));
        const instance = component.instance();
        instance.onChangePerPage(1);
        component.update();
        expect(component).toMatchSnapshot();
    });
    it('should highlight the query in the matches', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(indices_list_1.IndicesList, { indices: indices, query: "ki" }));
        expect(component).toMatchSnapshot();
    });
    describe('updating props', () => {
        it('should render all new indices', () => {
            const component = enzyme_1.shallow(react_1.default.createElement(indices_list_1.IndicesList, { indices: indices, query: "" }));
            const moreIndices = [
                ...indices,
                ...indices,
                ...indices,
                ...indices,
                ...indices,
                ...indices,
                ...indices,
                ...indices,
            ];
            component.setProps({ indices: moreIndices });
            component.update();
            expect(component).toMatchSnapshot();
        });
    });
});
