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
const mocks_1 = require("../../../../../core/public/mocks");
const toast_notifications_1 = require("./toast_notifications");
const rxjs_1 = require("rxjs");
describe('ToastNotifications', () => {
    describe('interface', () => {
        function setup() {
            const toastsMock = mocks_1.notificationServiceMock.createStartContract().toasts;
            return { toastNotifications: new toast_notifications_1.ToastNotifications(toastsMock), toastsMock };
        }
        describe('add method', () => {
            test('adds a toast', () => {
                const { toastNotifications, toastsMock } = setup();
                toastNotifications.add({});
                expect(toastsMock.add).toHaveBeenCalled();
            });
        });
        describe('remove method', () => {
            test('removes a toast', () => {
                const { toastNotifications, toastsMock } = setup();
                const fakeToast = {};
                toastNotifications.remove(fakeToast);
                expect(toastsMock.remove).toHaveBeenCalledWith(fakeToast);
            });
        });
        describe('onChange method', () => {
            test('callback is called when observable changes', () => {
                const toastsMock = mocks_1.notificationServiceMock.createStartContract().toasts;
                const toasts$ = new rxjs_1.BehaviorSubject([]);
                toastsMock.get$.mockReturnValue(toasts$);
                const toastNotifications = new toast_notifications_1.ToastNotifications(toastsMock);
                const onChangeSpy = jest.fn();
                toastNotifications.onChange(onChangeSpy);
                toasts$.next([{ id: 'toast1' }]);
                toasts$.next([]);
                expect(onChangeSpy).toHaveBeenCalledTimes(2);
            });
        });
        describe('addSuccess method', () => {
            test('adds a success toast', () => {
                const { toastNotifications, toastsMock } = setup();
                toastNotifications.addSuccess({});
                expect(toastsMock.addSuccess).toHaveBeenCalled();
            });
        });
        describe('addWarning method', () => {
            test('adds a warning toast', () => {
                const { toastNotifications, toastsMock } = setup();
                toastNotifications.addWarning({});
                expect(toastsMock.addWarning).toHaveBeenCalled();
            });
        });
        describe('addDanger method', () => {
            test('adds a danger toast', () => {
                const { toastNotifications, toastsMock } = setup();
                toastNotifications.addWarning({});
                expect(toastsMock.addWarning).toHaveBeenCalled();
            });
        });
    });
});
