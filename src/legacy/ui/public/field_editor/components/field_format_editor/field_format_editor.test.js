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
const enzyme_1 = require("enzyme");
const field_format_editor_1 = require("./field_format_editor");
class TestEditor extends react_1.PureComponent {
    render() {
        if (this.props) {
            return null;
        }
        return react_1.default.createElement("div", null, "Test editor");
    }
}
const formatEditors = {
    byFormatId: {
        ip: TestEditor,
        number: TestEditor,
    },
};
describe('FieldFormatEditor', () => {
    it('should render normally', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(field_format_editor_1.FieldFormatEditor, { fieldType: "number", fieldFormat: {}, fieldFormatId: "number", fieldFormatParams: {}, fieldFormatEditors: formatEditors, onChange: () => { }, onError: () => { } }));
        expect(component).toMatchSnapshot();
    });
    it('should render nothing if there is no editor for the format', async () => {
        const component = enzyme_1.shallow(react_1.default.createElement(field_format_editor_1.FieldFormatEditor, { fieldType: "number", fieldFormat: {}, fieldFormatId: "ip", fieldFormatParams: {}, fieldFormatEditors: formatEditors, onChange: () => { }, onError: () => { } }));
        expect(component).toMatchSnapshot();
    });
});
