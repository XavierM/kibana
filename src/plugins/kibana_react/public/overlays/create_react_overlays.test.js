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
const React = tslib_1.__importStar(require("react"));
const create_react_overlays_1 = require("./create_react_overlays");
const mocks_1 = require("../../../../core/public/mocks");
test('throws if no overlays service provided', () => {
    const overlays = create_react_overlays_1.createReactOverlays({});
    expect(() => overlays.openFlyout(null)).toThrowErrorMatchingInlineSnapshot(`"Could not show overlay as overlays service is not available."`);
});
test('creates wrapped overlays service', () => {
    const overlays = create_react_overlays_1.createReactOverlays({
        overlays: mocks_1.overlayServiceMock.createStartContract(),
    });
    expect(typeof overlays.openFlyout).toBe('function');
    expect(typeof overlays.openModal).toBe('function');
});
test('can open flyout with React element', () => {
    const coreOverlays = mocks_1.overlayServiceMock.createStartContract();
    const overlays = create_react_overlays_1.createReactOverlays({
        overlays: coreOverlays,
    });
    expect(coreOverlays.openFlyout).toHaveBeenCalledTimes(0);
    overlays.openFlyout(React.createElement("div", null, "foo"));
    expect(coreOverlays.openFlyout).toHaveBeenCalledTimes(1);
    const container = document.createElement('div');
    const mount = coreOverlays.openFlyout.mock.calls[0][0];
    mount(container);
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div>foo</div>"`);
});
test('can open modal with React element', () => {
    const coreOverlays = mocks_1.overlayServiceMock.createStartContract();
    const overlays = create_react_overlays_1.createReactOverlays({
        overlays: coreOverlays,
    });
    expect(coreOverlays.openModal).toHaveBeenCalledTimes(0);
    overlays.openModal(React.createElement("div", null, "bar"));
    expect(coreOverlays.openModal).toHaveBeenCalledTimes(1);
    const container = document.createElement('div');
    const mount = coreOverlays.openModal.mock.calls[0][0];
    mount(container);
    expect(container.innerHTML).toMatchInlineSnapshot(`"<div>bar</div>"`);
});
test('passes through flyout options when opening flyout', () => {
    const coreOverlays = mocks_1.overlayServiceMock.createStartContract();
    const overlays = create_react_overlays_1.createReactOverlays({
        overlays: coreOverlays,
    });
    overlays.openFlyout(React.createElement(React.Fragment, null, "foo"), {
        'data-test-subj': 'foo',
        closeButtonAriaLabel: 'bar',
    });
    expect(coreOverlays.openFlyout.mock.calls[0][1]).toEqual({
        'data-test-subj': 'foo',
        closeButtonAriaLabel: 'bar',
    });
});
test('passes through modal options when opening modal', () => {
    const coreOverlays = mocks_1.overlayServiceMock.createStartContract();
    const overlays = create_react_overlays_1.createReactOverlays({
        overlays: coreOverlays,
    });
    overlays.openModal(React.createElement(React.Fragment, null, "foo"), {
        'data-test-subj': 'foo2',
        closeButtonAriaLabel: 'bar2',
    });
    expect(coreOverlays.openModal.mock.calls[0][1]).toEqual({
        'data-test-subj': 'foo2',
        closeButtonAriaLabel: 'bar2',
    });
});
