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
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const react_2 = require("@kbn/i18n/react");
exports.createRenderer = (element) => {
    const dom = element && enzyme_1.mount(react_1.default.createElement(react_2.I18nProvider, null, element));
    return () => new Promise(async (resolve) => {
        if (dom) {
            dom.update();
        }
        setImmediate(() => resolve(dom)); // flushes any pending promises
    });
};
exports.createAppMounter = ({ appId, html = `<div>App ${appId}</div>`, appRoute = `/app/${appId}`, extraMountHook, }) => {
    const unmount = jest.fn();
    return [
        appId,
        {
            mounter: {
                appRoute,
                appBasePath: appRoute,
                mount: jest.fn(async (params) => {
                    const { appBasePath: basename, element } = params;
                    Object.assign(element, {
                        innerHTML: `<div>\nbasename: ${basename}\nhtml: ${html}\n</div>`,
                    });
                    unmount.mockImplementation(() => Object.assign(element, { innerHTML: '' }));
                    if (extraMountHook) {
                        extraMountHook(params);
                    }
                    return unmount;
                }),
            },
            unmount,
        },
    ];
};
exports.createLegacyAppMounter = (appId, legacyMount) => [
    appId,
    {
        mounter: {
            appRoute: `/app/${appId.split(':')[0]}`,
            appBasePath: `/app/${appId.split(':')[0]}`,
            unmountBeforeMounting: true,
            mount: legacyMount,
        },
        unmount: jest.fn(),
    },
];
function getUnmounter(app) {
    return app.mounter.mount.mock.results[0].value;
}
exports.getUnmounter = getUnmounter;
