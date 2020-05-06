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
const edit_panel_action_1 = require("./edit_panel_action");
const embeddables_1 = require("../embeddables");
const types_1 = require("../types");
const test_samples_1 = require("../test_samples");
const mocks_1 = require("../../mocks");
const { doStart } = mocks_1.embeddablePluginMock.createInstance();
const start = doStart();
const getFactory = start.getEmbeddableFactory;
class EditableEmbeddable extends embeddables_1.Embeddable {
    constructor(input, editable) {
        super(input, {
            editUrl: 'www.google.com',
            editable,
        });
        this.type = 'EDITABLE_EMBEDDABLE';
    }
    reload() { }
}
test('is compatible when edit url is available, in edit mode and editable', async () => {
    const action = new edit_panel_action_1.EditPanelAction(getFactory, {});
    expect(await action.isCompatible({
        embeddable: new EditableEmbeddable({ id: '123', viewMode: types_1.ViewMode.EDIT }, true),
    })).toBe(true);
});
test('getHref returns the edit urls', async () => {
    const action = new edit_panel_action_1.EditPanelAction(getFactory, {});
    expect(action.getHref).toBeDefined();
    if (action.getHref) {
        const embeddable = new EditableEmbeddable({ id: '123', viewMode: types_1.ViewMode.EDIT }, true);
        expect(await action.getHref({
            embeddable,
        })).toBe(embeddable.getOutput().editUrl);
    }
});
test('is not compatible when edit url is not available', async () => {
    const action = new edit_panel_action_1.EditPanelAction(getFactory, {});
    const embeddable = new test_samples_1.ContactCardEmbeddable({
        id: '123',
        firstName: 'sue',
        viewMode: types_1.ViewMode.EDIT,
    }, {
        execAction: () => Promise.resolve(undefined),
    });
    expect(await action.isCompatible({
        embeddable,
    })).toBe(false);
});
test('is not visible when edit url is available but in view mode', async () => {
    const action = new edit_panel_action_1.EditPanelAction(getFactory, {});
    expect(await action.isCompatible({
        embeddable: new EditableEmbeddable({
            id: '123',
            viewMode: types_1.ViewMode.VIEW,
        }, true),
    })).toBe(false);
});
test('is not compatible when edit url is available, in edit mode, but not editable', async () => {
    const action = new edit_panel_action_1.EditPanelAction(getFactory, {});
    expect(await action.isCompatible({
        embeddable: new EditableEmbeddable({
            id: '123',
            viewMode: types_1.ViewMode.EDIT,
        }, false),
    })).toBe(false);
});
