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
const mocks_1 = require("../mocks");
const action1 = {
    id: 'action1',
    order: 1,
    type: 'type1',
};
const action2 = {
    id: 'action2',
    order: 2,
    type: 'type2',
};
test('returns actions set on trigger', () => {
    const { setup, doStart } = mocks_1.uiActionsPluginMock.createPlugin();
    setup.registerAction(action1);
    setup.registerAction(action2);
    setup.registerTrigger({
        description: 'foo',
        id: 'trigger',
        title: 'baz',
    });
    const start = doStart();
    const list0 = start.getTriggerActions('trigger');
    expect(list0).toHaveLength(0);
    setup.attachAction('trigger', action1);
    const list1 = start.getTriggerActions('trigger');
    expect(list1).toHaveLength(1);
    expect(list1).toEqual([action1]);
    setup.attachAction('trigger', action2);
    const list2 = start.getTriggerActions('trigger');
    expect(list2).toHaveLength(2);
    expect(!!list2.find(({ id }) => id === 'action1')).toBe(true);
    expect(!!list2.find(({ id }) => id === 'action2')).toBe(true);
});
