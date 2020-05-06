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
// @ts-ignore
const kibana_services_1 = require("./kibana_services");
// @ts-ignore
const service_settings_1 = require("./map/service_settings");
// @ts-ignore
const precision_1 = require("./map/precision");
/**
 * These are the interfaces with your public contracts. You should export these
 * for other plugins to use in _their_ `SetupDeps`/`StartDeps` interfaces.
 * @public
 */
exports.bindSetupCoreAndPlugins = (core) => {
    kibana_services_1.setToasts(core.notifications.toasts);
    kibana_services_1.setUiSettings(core.uiSettings);
    kibana_services_1.setInjectedVarFunc(core.injectedMetadata.getInjectedVar);
};
class MapsLegacyPlugin {
    setup(core, plugins) {
        exports.bindSetupCoreAndPlugins(core);
        return {
            serviceSettings: new service_settings_1.ServiceSettings(),
            getZoomPrecision: precision_1.getZoomPrecision,
            getPrecision: precision_1.getPrecision,
        };
    }
    start(core, plugins) { }
}
exports.MapsLegacyPlugin = MapsLegacyPlugin;
