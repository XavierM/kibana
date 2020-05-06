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
const ui_actions_service_1 = require("./ui_actions_service");
const actions_1 = require("../actions");
const test_samples_1 = require("../tests/test_samples");
// Casting to ActionType or TriggerId is a hack - in a real situation use
// declare module and add this id to the appropriate context mapping.
const FOO_TRIGGER = 'FOO_TRIGGER';
const BAR_TRIGGER = 'BAR_TRIGGER';
const MY_TRIGGER = 'MY_TRIGGER';
const testAction1 = {
    id: 'action1',
    order: 1,
    type: 'type1',
    execute: async () => { },
    getDisplayName: () => 'test1',
    getIconType: () => '',
    isCompatible: async () => true,
};
const testAction2 = {
    id: 'action2',
    order: 2,
    type: 'type2',
    execute: async () => { },
    getDisplayName: () => 'test2',
    getIconType: () => '',
    isCompatible: async () => true,
};
describe('UiActionsService', () => {
    test('can instantiate', () => {
        new ui_actions_service_1.UiActionsService();
    });
    describe('.registerTrigger()', () => {
        test('can register a trigger', () => {
            const service = new ui_actions_service_1.UiActionsService();
            service.registerTrigger({
                id: BAR_TRIGGER,
            });
        });
    });
    describe('.getTrigger()', () => {
        test('can get Trigger from registry', () => {
            const service = new ui_actions_service_1.UiActionsService();
            service.registerTrigger({
                description: 'foo',
                id: BAR_TRIGGER,
                title: 'baz',
            });
            const trigger = service.getTrigger(BAR_TRIGGER);
            expect(trigger).toMatchObject({
                description: 'foo',
                id: BAR_TRIGGER,
                title: 'baz',
            });
        });
        test('throws if trigger does not exist', () => {
            const service = new ui_actions_service_1.UiActionsService();
            expect(() => service.getTrigger(FOO_TRIGGER)).toThrowError('Trigger [triggerId = FOO_TRIGGER] does not exist.');
        });
    });
    describe('.registerAction()', () => {
        test('can register an action', () => {
            const service = new ui_actions_service_1.UiActionsService();
            service.registerAction({
                id: 'test',
                execute: async () => { },
                getDisplayName: () => 'test',
                getIconType: () => '',
                isCompatible: async () => true,
                type: 'test',
            });
        });
    });
    describe('.getTriggerActions()', () => {
        const action1 = {
            id: 'action1',
            order: 1,
            type: 'type1',
            execute: async () => { },
            getDisplayName: () => 'test',
            getIconType: () => '',
            isCompatible: async () => true,
        };
        const action2 = {
            id: 'action2',
            order: 2,
            type: 'type2',
            execute: async () => { },
            getDisplayName: () => 'test',
            getIconType: () => '',
            isCompatible: async () => true,
        };
        test('returns actions set on trigger', () => {
            const service = new ui_actions_service_1.UiActionsService();
            service.registerAction(action1);
            service.registerAction(action2);
            service.registerTrigger({
                description: 'foo',
                id: FOO_TRIGGER,
                title: 'baz',
            });
            const list0 = service.getTriggerActions(FOO_TRIGGER);
            expect(list0).toHaveLength(0);
            service.attachAction(FOO_TRIGGER, action1);
            const list1 = service.getTriggerActions(FOO_TRIGGER);
            expect(list1).toHaveLength(1);
            expect(list1).toEqual([action1]);
            service.attachAction(FOO_TRIGGER, action2);
            const list2 = service.getTriggerActions(FOO_TRIGGER);
            expect(list2).toHaveLength(2);
            expect(!!list2.find(({ id }) => id === 'action1')).toBe(true);
            expect(!!list2.find(({ id }) => id === 'action2')).toBe(true);
        });
    });
    describe('.getTriggerCompatibleActions()', () => {
        test('can register and get actions', async () => {
            const actions = new Map();
            const service = new ui_actions_service_1.UiActionsService({ actions });
            const helloWorldAction = test_samples_1.createHelloWorldAction({});
            const length = actions.size;
            service.registerAction(helloWorldAction);
            expect(actions.size - length).toBe(1);
            expect(actions.get(helloWorldAction.id)).toBe(helloWorldAction);
        });
        test('getTriggerCompatibleActions returns attached actions', async () => {
            const service = new ui_actions_service_1.UiActionsService();
            const helloWorldAction = test_samples_1.createHelloWorldAction({});
            service.registerAction(helloWorldAction);
            const testTrigger = {
                id: MY_TRIGGER,
                title: 'My trigger',
            };
            service.registerTrigger(testTrigger);
            service.attachAction(MY_TRIGGER, helloWorldAction);
            const compatibleActions = await service.getTriggerCompatibleActions(MY_TRIGGER, {
                hi: 'there',
            });
            expect(compatibleActions.length).toBe(1);
            expect(compatibleActions[0].id).toBe(helloWorldAction.id);
        });
        test('filters out actions not applicable based on the context', async () => {
            const service = new ui_actions_service_1.UiActionsService();
            const action = actions_1.createAction({
                type: 'test',
                isCompatible: ({ accept }) => Promise.resolve(accept),
                execute: () => Promise.resolve(),
            });
            service.registerAction(action);
            const testTrigger = {
                id: MY_TRIGGER,
                title: 'My trigger',
            };
            service.registerTrigger(testTrigger);
            service.attachAction(testTrigger.id, action);
            const compatibleActions1 = await service.getTriggerCompatibleActions(testTrigger.id, {
                accept: true,
            });
            expect(compatibleActions1.length).toBe(1);
            const compatibleActions2 = await service.getTriggerCompatibleActions(testTrigger.id, {
                accept: false,
            });
            expect(compatibleActions2.length).toBe(0);
        });
        test(`throws an error with an invalid trigger ID`, async () => {
            const service = new ui_actions_service_1.UiActionsService();
            // Without the cast "as TriggerId" typescript will happily throw an error!
            await expect(service.getTriggerCompatibleActions('I do not exist', {})).rejects.toMatchObject(new Error('Trigger [triggerId = I do not exist] does not exist.'));
        });
        test('returns empty list if trigger not attached to any action', async () => {
            const service = new ui_actions_service_1.UiActionsService();
            const testTrigger = {
                id: '123',
                title: '123',
            };
            service.registerTrigger(testTrigger);
            const actions = await service.getTriggerCompatibleActions(testTrigger.id, {});
            expect(actions).toEqual([]);
        });
    });
    describe('.fork()', () => {
        test('returns a new instance of the service', () => {
            const service1 = new ui_actions_service_1.UiActionsService();
            const service2 = service1.fork();
            expect(service1).not.toBe(service2);
            expect(service2).toBeInstanceOf(ui_actions_service_1.UiActionsService);
        });
        test('triggers registered in original service are available in original an forked services', () => {
            const service1 = new ui_actions_service_1.UiActionsService();
            service1.registerTrigger({
                id: FOO_TRIGGER,
            });
            const service2 = service1.fork();
            const trigger1 = service1.getTrigger(FOO_TRIGGER);
            const trigger2 = service2.getTrigger(FOO_TRIGGER);
            expect(trigger1.id).toBe(FOO_TRIGGER);
            expect(trigger2.id).toBe(FOO_TRIGGER);
        });
        test('triggers registered in forked service are not available in original service', () => {
            const service1 = new ui_actions_service_1.UiActionsService();
            const service2 = service1.fork();
            service2.registerTrigger({
                id: FOO_TRIGGER,
            });
            expect(() => service1.getTrigger(FOO_TRIGGER)).toThrowErrorMatchingInlineSnapshot(`"Trigger [triggerId = FOO_TRIGGER] does not exist."`);
            const trigger2 = service2.getTrigger(FOO_TRIGGER);
            expect(trigger2.id).toBe(FOO_TRIGGER);
        });
        test('forked service preserves trigger-to-actions mapping', () => {
            const service1 = new ui_actions_service_1.UiActionsService();
            service1.registerTrigger({
                id: FOO_TRIGGER,
            });
            service1.registerAction(testAction1);
            service1.attachAction(FOO_TRIGGER, testAction1);
            const service2 = service1.fork();
            const actions1 = service1.getTriggerActions(FOO_TRIGGER);
            const actions2 = service2.getTriggerActions(FOO_TRIGGER);
            expect(actions1).toHaveLength(1);
            expect(actions2).toHaveLength(1);
            expect(actions1[0].id).toBe(testAction1.id);
            expect(actions2[0].id).toBe(testAction1.id);
        });
        test('new attachments in fork do not appear in original service', () => {
            const service1 = new ui_actions_service_1.UiActionsService();
            service1.registerTrigger({
                id: FOO_TRIGGER,
            });
            service1.registerAction(testAction1);
            service1.registerAction(testAction2);
            service1.attachAction(FOO_TRIGGER, testAction1);
            const service2 = service1.fork();
            expect(service1.getTriggerActions(FOO_TRIGGER)).toHaveLength(1);
            expect(service2.getTriggerActions(FOO_TRIGGER)).toHaveLength(1);
            service2.attachAction(FOO_TRIGGER, testAction2);
            expect(service1.getTriggerActions(FOO_TRIGGER)).toHaveLength(1);
            expect(service2.getTriggerActions(FOO_TRIGGER)).toHaveLength(2);
        });
        test('new attachments in original service do not appear in fork', () => {
            const service1 = new ui_actions_service_1.UiActionsService();
            service1.registerTrigger({
                id: FOO_TRIGGER,
            });
            service1.registerAction(testAction1);
            service1.registerAction(testAction2);
            service1.attachAction(FOO_TRIGGER, testAction1);
            const service2 = service1.fork();
            expect(service1.getTriggerActions(FOO_TRIGGER)).toHaveLength(1);
            expect(service2.getTriggerActions(FOO_TRIGGER)).toHaveLength(1);
            service1.attachAction(FOO_TRIGGER, testAction2);
            expect(service1.getTriggerActions(FOO_TRIGGER)).toHaveLength(2);
            expect(service2.getTriggerActions(FOO_TRIGGER)).toHaveLength(1);
        });
    });
    describe('registries', () => {
        const ACTION_HELLO_WORLD = 'ACTION_HELLO_WORLD';
        test('can register trigger', () => {
            const triggers = new Map();
            const service = new ui_actions_service_1.UiActionsService({ triggers });
            service.registerTrigger({
                description: 'foo',
                id: BAR_TRIGGER,
                title: 'baz',
            });
            const triggerContract = service.getTrigger(BAR_TRIGGER);
            expect(triggerContract).toMatchObject({
                description: 'foo',
                id: BAR_TRIGGER,
                title: 'baz',
            });
        });
        test('can register action', () => {
            const actions = new Map();
            const service = new ui_actions_service_1.UiActionsService({ actions });
            service.registerAction({
                id: ACTION_HELLO_WORLD,
                order: 13,
            });
            expect(actions.get(ACTION_HELLO_WORLD)).toMatchObject({
                id: ACTION_HELLO_WORLD,
                order: 13,
            });
        });
        test('can attach an action to a trigger', () => {
            const service = new ui_actions_service_1.UiActionsService();
            const trigger = {
                id: MY_TRIGGER,
            };
            const action = {
                id: ACTION_HELLO_WORLD,
                order: 25,
            };
            service.registerTrigger(trigger);
            service.attachAction(MY_TRIGGER, action);
            const actions = service.getTriggerActions(trigger.id);
            expect(actions.length).toBe(1);
            expect(actions[0].id).toBe(ACTION_HELLO_WORLD);
        });
        test('can detach an action to a trigger', () => {
            const service = new ui_actions_service_1.UiActionsService();
            const trigger = {
                id: MY_TRIGGER,
            };
            const action = {
                id: ACTION_HELLO_WORLD,
                order: 25,
            };
            service.registerTrigger(trigger);
            service.registerAction(action);
            service.attachAction(trigger.id, action);
            service.detachAction(trigger.id, action.id);
            const actions2 = service.getTriggerActions(trigger.id);
            expect(actions2).toEqual([]);
        });
        test('detaching an invalid action from a trigger throws an error', async () => {
            const service = new ui_actions_service_1.UiActionsService();
            const action = {
                id: ACTION_HELLO_WORLD,
                order: 25,
            };
            service.registerAction(action);
            expect(() => service.detachAction('i do not exist', ACTION_HELLO_WORLD)).toThrowError('No trigger [triggerId = i do not exist] exists, for detaching action [actionId = ACTION_HELLO_WORLD].');
        });
        test('attaching an invalid action to a trigger throws an error', async () => {
            const service = new ui_actions_service_1.UiActionsService();
            const action = {
                id: ACTION_HELLO_WORLD,
                order: 25,
            };
            service.registerAction(action);
            expect(() => service.attachAction('i do not exist', action)).toThrowError('No trigger [triggerId = i do not exist] exists, for attaching action [actionId = ACTION_HELLO_WORLD].');
        });
        test('cannot register another action with the same ID', async () => {
            const service = new ui_actions_service_1.UiActionsService();
            const action = {
                id: ACTION_HELLO_WORLD,
                order: 25,
            };
            service.registerAction(action);
            expect(() => service.registerAction(action)).toThrowError('Action [action.id = ACTION_HELLO_WORLD] already registered.');
        });
        test('cannot register another trigger with the same ID', async () => {
            const service = new ui_actions_service_1.UiActionsService();
            const trigger = { id: 'MY-TRIGGER' };
            service.registerTrigger(trigger);
            expect(() => service.registerTrigger(trigger)).toThrowError('Trigger [trigger.id = MY-TRIGGER] already registered.');
        });
    });
});
