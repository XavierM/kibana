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
const markdown_1 = require("./markdown");
test('render', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, null));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('should never render html tags', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { markdown: "<div>I may be dangerous if rendered as html</div>" }));
    expect(component).toMatchSnapshot(); // eslint-disable-line
});
test('should render links with parentheses correctly', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { markdown: "[link](https://example.com/foo/bar?group=(()filters:!t))" }));
    expect(component
        .render()
        .find('a')
        .prop('href')).toBe('https://example.com/foo/bar?group=(()filters:!t)');
});
test('should add `noreferrer` and `nooopener` to unknown links in new tabs', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { openLinksInNewTab: true, markdown: "[link](https://example.com/foo/bar?group=(()filters:!t))" }));
    expect(component
        .render()
        .find('a')
        .prop('rel')).toBe('noopener noreferrer');
});
test('should only add `nooopener` to known links in new tabs', () => {
    const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { openLinksInNewTab: true, markdown: "[link](https://www.elastic.co/cool/path" }));
    expect(component
        .render()
        .find('a')
        .prop('rel')).toBe('noopener');
});
describe('props', () => {
    const markdown = 'I am *some* [content](https://en.wikipedia.org/wiki/Content) with `markdown`';
    test('markdown', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { markdown: markdown }));
        expect(component).toMatchSnapshot(); // eslint-disable-line
    });
    test('openLinksInNewTab', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { markdown: markdown, openLinksInNewTab: true }));
        expect(component).toMatchSnapshot(); // eslint-disable-line
    });
    test('whiteListedRules', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { markdown: markdown, whiteListedRules: ['backticks', 'emphasis'] }));
        expect(component).toMatchSnapshot(); // eslint-disable-line
    });
    test('should update markdown when openLinksInNewTab prop change', () => {
        const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { markdown: markdown, openLinksInNewTab: false }));
        expect(component
            .render()
            .find('a')
            .prop('target')).not.toBe('_blank');
        component.setProps({ openLinksInNewTab: true });
        expect(component
            .render()
            .find('a')
            .prop('target')).toBe('_blank');
    });
    test('should update markdown when whiteListedRules prop change', () => {
        const md = '*emphasis* `backticks`';
        const component = enzyme_1.shallow(react_1.default.createElement(markdown_1.Markdown, { markdown: md, whiteListedRules: ['emphasis', 'backticks'] }));
        expect(component.render().find('em')).toHaveLength(1);
        expect(component.render().find('code')).toHaveLength(1);
        component.setProps({ whiteListedRules: ['backticks'] });
        expect(component.render().find('code')).toHaveLength(1);
        expect(component.render().find('em')).toHaveLength(0);
    });
});
