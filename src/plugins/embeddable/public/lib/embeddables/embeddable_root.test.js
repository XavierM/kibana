"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const public_1 = require("../../../../../../examples/embeddable_examples/public");
const embeddable_root_1 = require("./embeddable_root");
const enzyme_1 = require("enzyme");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
test('EmbeddableRoot renders an embeddable', async () => {
    const embeddable = new public_1.HelloWorldEmbeddable({ id: 'hello' });
    const component = enzyme_1.mount(react_1.default.createElement(embeddable_root_1.EmbeddableRoot, { embeddable: embeddable }));
    // Due to the way embeddables mount themselves on the dom node, they are not forced to be
    // react components, and hence, we can't use the usual
    // findTestSubject.
    expect(component.getDOMNode().querySelectorAll('[data-test-subj="helloWorldEmbeddable"]').length).toBe(1);
    expect(test_1.findTestSubject(component, 'embedSpinner').length).toBe(0);
    expect(test_1.findTestSubject(component, 'embedError').length).toBe(0);
});
test('EmbeddableRoot renders a spinner if loading an no embeddable given', async () => {
    const component = enzyme_1.mount(react_1.default.createElement(embeddable_root_1.EmbeddableRoot, { loading: true }));
    // Due to the way embeddables mount themselves on the dom node, they are not forced to be
    // react components, and hence, we can't use the usual
    // findTestSubject.
    expect(test_1.findTestSubject(component, 'embedSpinner').length).toBe(1);
    expect(test_1.findTestSubject(component, 'embedError').length).toBe(0);
});
test('EmbeddableRoot renders an error if given with no embeddable', async () => {
    const component = enzyme_1.mount(react_1.default.createElement(embeddable_root_1.EmbeddableRoot, { error: "bad" }));
    // Due to the way embeddables mount themselves on the dom node, they are not forced to be
    // react components, and hence, we can't use the usual
    // findTestSubject.
    expect(test_1.findTestSubject(component, 'embedError').length).toBe(1);
    expect(test_1.findTestSubject(component, 'embedSpinner').length).toBe(0);
});
