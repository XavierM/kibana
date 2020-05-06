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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const mocks_1 = require("../../../../../../core/public/mocks");
const mocks_2 = require("../../../mocks");
const services_1 = require("../../../services");
/**
 * Testing helper which calls all of the service setters used in the
 * data plugin. Services are added using their provided mocks.
 *
 * @internal
 */
function mockDataServices() {
    const core = mocks_1.coreMock.createStart();
    const data = mocks_2.dataPluginMock.createStartContract();
    services_1.setFieldFormats(data.fieldFormats);
    services_1.setIndexPatterns(data.indexPatterns);
    services_1.setInjectedMetadata(core.injectedMetadata);
    services_1.setNotifications(core.notifications);
    services_1.setOverlays(core.overlays);
    services_1.setQueryService(data.query);
    services_1.setSearchService(data.search);
    services_1.setUiSettings(core.uiSettings);
    return {
        core,
        data,
    };
}
exports.mockDataServices = mockDataServices;
