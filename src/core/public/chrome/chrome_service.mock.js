"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const rxjs_1 = require("rxjs");
const createStartContractMock = () => {
    const startContract = {
        getHeaderComponent: jest.fn(),
        navLinks: {
            getNavLinks$: jest.fn(),
            has: jest.fn(),
            get: jest.fn(),
            getAll: jest.fn(),
            showOnly: jest.fn(),
            update: jest.fn(),
            enableForcedAppSwitcherNavigation: jest.fn(),
            getForceAppSwitcherNavigation$: jest.fn(),
        },
        recentlyAccessed: {
            add: jest.fn(),
            get: jest.fn(),
            get$: jest.fn(),
        },
        docTitle: {
            change: jest.fn(),
            reset: jest.fn(),
            __legacy: {
                setBaseTitle: jest.fn(),
            },
        },
        navControls: {
            registerLeft: jest.fn(),
            registerRight: jest.fn(),
            getLeft$: jest.fn(),
            getRight$: jest.fn(),
        },
        setAppTitle: jest.fn(),
        setBrand: jest.fn(),
        getBrand$: jest.fn(),
        setIsVisible: jest.fn(),
        getIsVisible$: jest.fn(),
        addApplicationClass: jest.fn(),
        removeApplicationClass: jest.fn(),
        getApplicationClasses$: jest.fn(),
        getBadge$: jest.fn(),
        setBadge: jest.fn(),
        getBreadcrumbs$: jest.fn(),
        setBreadcrumbs: jest.fn(),
        getHelpExtension$: jest.fn(),
        setHelpExtension: jest.fn(),
        setHelpSupportUrl: jest.fn(),
        getIsNavDrawerLocked$: jest.fn(),
    };
    startContract.navLinks.getAll.mockReturnValue([]);
    startContract.getBrand$.mockReturnValue(new rxjs_1.BehaviorSubject({}));
    startContract.getIsVisible$.mockReturnValue(new rxjs_1.BehaviorSubject(false));
    startContract.getApplicationClasses$.mockReturnValue(new rxjs_1.BehaviorSubject(['class-name']));
    startContract.getBadge$.mockReturnValue(new rxjs_1.BehaviorSubject({}));
    startContract.getBreadcrumbs$.mockReturnValue(new rxjs_1.BehaviorSubject([{}]));
    startContract.getHelpExtension$.mockReturnValue(new rxjs_1.BehaviorSubject(undefined));
    startContract.getIsNavDrawerLocked$.mockReturnValue(new rxjs_1.BehaviorSubject(false));
    return startContract;
};
const createMock = () => {
    const mocked = {
        start: jest.fn(),
        stop: jest.fn(),
    };
    mocked.start.mockResolvedValue(createStartContractMock());
    return mocked;
};
exports.chromeServiceMock = {
    create: createMock,
    createStartContract: createStartContractMock,
};
