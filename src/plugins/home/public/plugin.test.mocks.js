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
const feature_catalogue_registry_mock_1 = require("./services/feature_catalogue/feature_catalogue_registry.mock");
const environment_mock_1 = require("./services/environment/environment.mock");
const tutorial_service_mock_1 = require("./services/tutorials/tutorial_service.mock");
exports.registryMock = feature_catalogue_registry_mock_1.featureCatalogueRegistryMock.create();
exports.environmentMock = environment_mock_1.environmentServiceMock.create();
exports.tutorialMock = tutorial_service_mock_1.tutorialServiceMock.create();
jest.doMock('./services', () => ({
    FeatureCatalogueRegistry: jest.fn(() => exports.registryMock),
    EnvironmentService: jest.fn(() => exports.environmentMock),
    TutorialService: jest.fn(() => exports.tutorialMock),
}));
