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
const operators_1 = require("rxjs/operators");
const services_1 = require("./services");
const routes_1 = require("./routes");
const capabilities_provider_1 = require("./capabilities_provider");
class SavedObjectsManagementPlugin {
    constructor(context) {
        this.context = context;
        this.managementService$ = new rxjs_1.Subject();
        this.logger = this.context.logger.get();
    }
    async setup({ http, capabilities }) {
        this.logger.debug('Setting up SavedObjectsManagement plugin');
        routes_1.registerRoutes({
            http,
            managementServicePromise: this.managementService$.pipe(operators_1.first()).toPromise(),
        });
        capabilities.registerProvider(capabilities_provider_1.capabilitiesProvider);
        return {};
    }
    async start(core) {
        this.logger.debug('Starting up SavedObjectsManagement plugin');
        const managementService = new services_1.SavedObjectsManagement(core.savedObjects.getTypeRegistry());
        this.managementService$.next(managementService);
        return {};
    }
}
exports.SavedObjectsManagementPlugin = SavedObjectsManagementPlugin;
