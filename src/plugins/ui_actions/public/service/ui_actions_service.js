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
const trigger_internal_1 = require("../triggers/trigger_internal");
class UiActionsService {
    constructor({ triggers = new Map(), actions = new Map(), triggerToActions = new Map(), } = {}) {
        this.registerTrigger = (trigger) => {
            if (this.triggers.has(trigger.id)) {
                throw new Error(`Trigger [trigger.id = ${trigger.id}] already registered.`);
            }
            const triggerInternal = new trigger_internal_1.TriggerInternal(this, trigger);
            this.triggers.set(trigger.id, triggerInternal);
            this.triggerToActions.set(trigger.id, []);
        };
        this.getTrigger = (triggerId) => {
            const trigger = this.triggers.get(triggerId);
            if (!trigger) {
                throw new Error(`Trigger [triggerId = ${triggerId}] does not exist.`);
            }
            return trigger.contract;
        };
        this.registerAction = (action) => {
            if (this.actions.has(action.id)) {
                throw new Error(`Action [action.id = ${action.id}] already registered.`);
            }
            this.actions.set(action.id, action);
        };
        this.getAction = (id) => {
            if (!this.actions.has(id)) {
                throw new Error(`Action [action.id = ${id}] not registered.`);
            }
            return this.actions.get(id);
        };
        this.attachAction = (triggerId, 
        // The action can accept partial or no context, but if it needs context not provided
        // by this type of trigger, typescript will complain. yay!
        action) => {
            if (!this.actions.has(action.id)) {
                this.registerAction(action);
            }
            else {
                const registeredAction = this.actions.get(action.id);
                if (registeredAction !== action) {
                    throw new Error(`A different action instance with this id is already registered.`);
                }
            }
            const trigger = this.triggers.get(triggerId);
            if (!trigger) {
                throw new Error(`No trigger [triggerId = ${triggerId}] exists, for attaching action [actionId = ${action.id}].`);
            }
            const actionIds = this.triggerToActions.get(triggerId);
            if (!actionIds.find(id => id === action.id)) {
                this.triggerToActions.set(triggerId, [...actionIds, action.id]);
            }
        };
        this.detachAction = (triggerId, actionId) => {
            const trigger = this.triggers.get(triggerId);
            if (!trigger) {
                throw new Error(`No trigger [triggerId = ${triggerId}] exists, for detaching action [actionId = ${actionId}].`);
            }
            const actionIds = this.triggerToActions.get(triggerId);
            this.triggerToActions.set(triggerId, actionIds.filter(id => id !== actionId));
        };
        this.getTriggerActions = (triggerId) => {
            // This line checks if trigger exists, otherwise throws.
            this.getTrigger(triggerId);
            const actionIds = this.triggerToActions.get(triggerId);
            const actions = actionIds.map(actionId => this.actions.get(actionId)).filter(Boolean);
            return actions;
        };
        this.getTriggerCompatibleActions = async (triggerId, context) => {
            const actions = this.getTriggerActions(triggerId);
            const isCompatibles = await Promise.all(actions.map(action => action.isCompatible(context)));
            return actions.reduce((acc, action, i) => isCompatibles[i] ? [...acc, action] : acc, []);
        };
        /**
         * @deprecated
         *
         * Use `plugins.uiActions.getTrigger(triggerId).exec(params)` instead.
         */
        this.executeTriggerActions = async (triggerId, context) => {
            const trigger = this.getTrigger(triggerId);
            await trigger.exec(context);
        };
        /**
         * Removes all registered triggers and actions.
         */
        this.clear = () => {
            this.actions.clear();
            this.triggers.clear();
            this.triggerToActions.clear();
        };
        /**
         * "Fork" a separate instance of `UiActionsService` that inherits all existing
         * triggers and actions, but going forward all new triggers and actions added
         * to this instance of `UiActionsService` are only available within this instance.
         */
        this.fork = () => {
            const triggers = new Map();
            const actions = new Map();
            const triggerToActions = new Map();
            for (const [key, value] of this.triggers.entries())
                triggers.set(key, value);
            for (const [key, value] of this.actions.entries())
                actions.set(key, value);
            for (const [key, value] of this.triggerToActions.entries())
                triggerToActions.set(key, [...value]);
            return new UiActionsService({ triggers, actions, triggerToActions });
        };
        this.triggers = triggers;
        this.actions = actions;
        this.triggerToActions = triggerToActions;
    }
}
exports.UiActionsService = UiActionsService;
