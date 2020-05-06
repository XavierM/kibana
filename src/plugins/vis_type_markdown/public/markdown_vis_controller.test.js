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
const markdown_vis_controller_1 = require("./markdown_vis_controller");
describe('markdown vis controller', () => {
    it('should set html from markdown params', () => {
        const vis = {
            params: {
                markdown: 'This is a test of the [markdown](http://daringfireball.net/projects/markdown) vis.',
            },
        };
        const wrapper = enzyme_1.render(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: jest.fn() }));
        expect(wrapper.find('a').text()).toBe('markdown');
    });
    it('should not render the html', () => {
        const vis = {
            params: {
                markdown: 'Testing <a>html</a>',
            },
        };
        const wrapper = enzyme_1.render(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: jest.fn() }));
        expect(wrapper.text()).toBe('Testing <a>html</a>\n');
    });
    it('should update the HTML when render again with changed params', () => {
        const vis = {
            params: {
                markdown: 'Initial',
            },
        };
        const wrapper = enzyme_1.mount(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: jest.fn() }));
        expect(wrapper.text().trim()).toBe('Initial');
        vis.params.markdown = 'Updated';
        wrapper.setProps({ vis });
        expect(wrapper.text().trim()).toBe('Updated');
    });
    describe('renderComplete', () => {
        it('should be called on initial rendering', () => {
            const vis = {
                params: {
                    markdown: 'test',
                },
            };
            const renderComplete = jest.fn();
            enzyme_1.mount(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: renderComplete }));
            expect(renderComplete.mock.calls.length).toBe(1);
        });
        it('should be called on successive render when params change', () => {
            const vis = {
                params: {
                    markdown: 'test',
                },
            };
            const renderComplete = jest.fn();
            enzyme_1.mount(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: renderComplete }));
            expect(renderComplete.mock.calls.length).toBe(1);
            renderComplete.mockClear();
            vis.params.markdown = 'changed';
            enzyme_1.mount(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: renderComplete }));
            expect(renderComplete.mock.calls.length).toBe(1);
        });
        it('should be called on successive render even without data change', () => {
            const vis = {
                params: {
                    markdown: 'test',
                },
            };
            const renderComplete = jest.fn();
            enzyme_1.mount(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: renderComplete }));
            expect(renderComplete.mock.calls.length).toBe(1);
            renderComplete.mockClear();
            enzyme_1.mount(react_1.default.createElement(markdown_vis_controller_1.MarkdownVisWrapper, { vis: vis, visParams: vis.params, renderComplete: renderComplete }));
            expect(renderComplete.mock.calls.length).toBe(1);
        });
    });
});
