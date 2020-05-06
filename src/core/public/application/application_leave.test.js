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
const application_leave_1 = require("./application_leave");
const types_1 = require("./types");
describe('isConfirmAction', () => {
    it('returns true if action is confirm', () => {
        expect(application_leave_1.isConfirmAction({ type: types_1.AppLeaveActionType.confirm, text: 'message' })).toEqual(true);
    });
    it('returns false if action is default', () => {
        expect(application_leave_1.isConfirmAction({ type: types_1.AppLeaveActionType.default })).toEqual(false);
    });
});
describe('getLeaveAction', () => {
    it('returns the default action provided by the handler', () => {
        expect(application_leave_1.getLeaveAction(actions => actions.default())).toEqual({
            type: types_1.AppLeaveActionType.default,
        });
    });
    it('returns the confirm action provided by the handler', () => {
        expect(application_leave_1.getLeaveAction(actions => actions.confirm('some message'))).toEqual({
            type: types_1.AppLeaveActionType.confirm,
            text: 'some message',
        });
        expect(application_leave_1.getLeaveAction(actions => actions.confirm('another message', 'a title'))).toEqual({
            type: types_1.AppLeaveActionType.confirm,
            text: 'another message',
            title: 'a title',
        });
    });
});
