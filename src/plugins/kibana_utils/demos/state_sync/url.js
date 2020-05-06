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
const todomvc_1 = require("../state_containers/todomvc");
const state_containers_1 = require("../../common/state_containers");
const state_sync_1 = require("../../public/state_sync");
const tick = () => new Promise(resolve => setTimeout(resolve));
const stateContainer = state_containers_1.createStateContainer(todomvc_1.defaultState, todomvc_1.pureTransitions);
const { start, stop } = state_sync_1.syncState({
    stateContainer: withDefaultState(stateContainer, todomvc_1.defaultState),
    storageKey: '_s',
    stateStorage: state_sync_1.createKbnUrlStateStorage(),
});
start();
exports.result = Promise.resolve()
    .then(() => {
    // http://localhost/#?_s=!((completed:!f,id:0,text:'Learning+state+containers')"
    stateContainer.transitions.add({
        id: 2,
        text: 'test',
        completed: false,
    });
    // http://localhost/#?_s=!((completed:!f,id:0,text:'Learning+state+containers'),(completed:!f,id:2,text:test))"
    /* actual url updates happens async */
    return tick();
})
    .then(() => {
    stop();
    return window.location.href;
});
function withDefaultState(
// eslint-disable-next-line no-shadow
stateContainer, 
// eslint-disable-next-line no-shadow
defaultState) {
    return {
        ...stateContainer,
        set: (state) => {
            stateContainer.set(state || defaultState);
        },
    };
}
