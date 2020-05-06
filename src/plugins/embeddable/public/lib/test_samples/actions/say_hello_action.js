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
const ui_actions_1 = require("../../ui_actions");
// Casting to ActionType is a hack - in a real situation use
// declare module and add this id to ActionContextMapping.
exports.SAY_HELLO_ACTION = 'SAY_HELLO_ACTION';
function hasFullNameOutput(embeddable) {
    return (embeddable.getOutput().fullName !==
        undefined);
}
exports.hasFullNameOutput = hasFullNameOutput;
class SayHelloAction {
    // Taking in a function, instead of always directly interacting with the dom,
    // can make testing the execute part of the action easier.
    constructor(sayHello) {
        this.type = exports.SAY_HELLO_ACTION;
        this.id = exports.SAY_HELLO_ACTION;
        this.sayHello = sayHello;
    }
    getDisplayName() {
        return 'Say hello';
    }
    getIconType() {
        return undefined;
    }
    // Can use typescript generics to get compiler time warnings for immediate feedback if
    // the context is not compatible.
    async isCompatible(context) {
        // Option 1: only compatible with Greeting Embeddables.
        // return context.embeddable.type === CONTACT_CARD_EMBEDDABLE;
        // Option 2: require an embeddable with a specific input or output shape
        return hasFullNameOutput(context.embeddable);
    }
    async execute(context) {
        if (!(await this.isCompatible(context))) {
            throw new ui_actions_1.IncompatibleActionError();
        }
        const greeting = `Hello, ${context.embeddable.getOutput().fullName}`;
        if (context.message) {
            this.sayHello(`${greeting}.  ${context.message}`);
        }
        else {
            this.sayHello(greeting);
        }
    }
}
exports.SayHelloAction = SayHelloAction;
