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
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const react_1 = tslib_1.__importDefault(require("react"));
const react_2 = require("@kbn/i18n/react");
const newsfeed_header_nav_button_1 = require("./components/newsfeed_header_nav_button");
const api_1 = require("./lib/api");
class NewsfeedPublicPlugin {
    constructor(initializerContext) {
        this.stop$ = new Rx.ReplaySubject(1);
        this.kibanaVersion = initializerContext.env.packageInfo.version;
    }
    setup(core) {
        return {};
    }
    start(core) {
        const api$ = this.fetchNewsfeed(core);
        core.chrome.navControls.registerRight({
            order: 1000,
            mount: target => this.mount(api$, target),
        });
        return {};
    }
    stop() {
        this.stop$.next();
    }
    fetchNewsfeed(core) {
        const { http, injectedMetadata } = core;
        const config = injectedMetadata.getInjectedVar('newsfeed');
        if (!config) {
            // running in new platform, injected metadata not available
            return new Rx.Observable();
        }
        return api_1.getApi(http, config, this.kibanaVersion).pipe(operators_1.takeUntil(this.stop$), // stop the interval when stop method is called
        operators_1.catchError(() => Rx.of(null)) // do not throw error
        );
    }
    mount(api$, targetDomElement) {
        react_dom_1.default.render(react_1.default.createElement(react_2.I18nProvider, null,
            react_1.default.createElement(newsfeed_header_nav_button_1.NewsfeedNavButton, { apiFetchResult: api$ })), targetDomElement);
        return () => react_dom_1.default.unmountComponentAtNode(targetDomElement);
    }
}
exports.NewsfeedPublicPlugin = NewsfeedPublicPlugin;
