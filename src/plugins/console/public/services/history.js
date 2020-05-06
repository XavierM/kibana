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
const rxjs_1 = require("rxjs");
class History {
    constructor(storage) {
        this.storage = storage;
        this.changeEmitter = new rxjs_1.BehaviorSubject(this.getHistory() || []);
    }
    getHistoryKeys() {
        return this.storage
            .keys()
            .filter((key) => key.indexOf('hist_elem') === 0)
            .sort()
            .reverse();
    }
    getHistory() {
        return this.getHistoryKeys().map(key => this.storage.get(key));
    }
    // This is used as an optimization mechanism so that different components
    // can listen for changes to history and update because changes to history can
    // be triggered from different places in the app. The alternative would be to store
    // this in state so that we hook into the React model, but it would require loading history
    // every time the application starts even if a user is not going to view history.
    change(listener) {
        const subscription = this.changeEmitter.subscribe(listener);
        return () => subscription.unsubscribe();
    }
    addToHistory(endpoint, method, data) {
        const keys = this.getHistoryKeys();
        keys.splice(0, 500); // only maintain most recent X;
        keys.forEach(key => {
            this.storage.delete(key);
        });
        const timestamp = new Date().getTime();
        const k = 'hist_elem_' + timestamp;
        this.storage.set(k, {
            time: timestamp,
            endpoint,
            method,
            data,
        });
        this.changeEmitter.next(this.getHistory());
    }
    updateCurrentState(content) {
        const timestamp = new Date().getTime();
        this.storage.set('editor_state', {
            time: timestamp,
            content,
        });
    }
    getLegacySavedEditorState() {
        const saved = this.storage.get('editor_state');
        if (!saved)
            return;
        const { time, content } = saved;
        return { time, content };
    }
    /**
     * This function should only ever be called once for a user if they had legacy state.
     */
    deleteLegacySavedEditorState() {
        this.storage.delete('editor_state');
    }
    clearHistory() {
        this.getHistoryKeys().forEach(key => this.storage.delete(key));
    }
}
exports.History = History;
function createHistory(deps) {
    return new History(deps.storage);
}
exports.createHistory = createHistory;
