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
/**
 * The Kibana Core APIs for server-side plugins.
 *
 * A plugin requires a `kibana.json` file at it's root directory that follows
 * {@link PluginManifest | the manfiest schema} to define static plugin
 * information required to load the plugin.
 *
 * A plugin's `server/index` file must contain a named import, `plugin`, that
 * implements {@link PluginInitializer} which returns an object that implements
 * {@link Plugin}.
 *
 * The plugin integrates with the core system via lifecycle events: `setup`,
 * `start`, and `stop`. In each lifecycle method, the plugin will receive the
 * corresponding core services available (either {@link CoreSetup} or
 * {@link CoreStart}) and any interfaces returned by dependency plugins'
 * lifecycle method. Anything returned by the plugin's lifecycle method will be
 * exposed to downstream dependencies when their corresponding lifecycle methods
 * are invoked.
 *
 * @packageDocumentation
 */
const elasticsearch_1 = require("./elasticsearch");
var bootstrap_1 = require("./bootstrap");
exports.bootstrap = bootstrap_1.bootstrap;
var config_1 = require("./config");
exports.ConfigService = config_1.ConfigService;
var csp_1 = require("./csp");
exports.CspConfig = csp_1.CspConfig;
var elasticsearch_2 = require("./elasticsearch");
exports.ClusterClient = elasticsearch_2.ClusterClient;
exports.ScopedClusterClient = elasticsearch_2.ScopedClusterClient;
exports.ElasticsearchConfig = elasticsearch_2.ElasticsearchConfig;
exports.ElasticsearchErrorHelpers = elasticsearch_2.ElasticsearchErrorHelpers;
var http_1 = require("./http");
exports.AuthStatus = http_1.AuthStatus;
exports.AuthResultType = http_1.AuthResultType;
exports.BasePath = http_1.BasePath;
exports.KibanaRequest = http_1.KibanaRequest;
exports.kibanaResponseFactory = http_1.kibanaResponseFactory;
exports.validBodyOutput = http_1.validBodyOutput;
exports.RouteValidationError = http_1.RouteValidationError;
var logging_1 = require("./logging");
exports.LogLevel = logging_1.LogLevel;
var saved_objects_1 = require("./saved_objects");
exports.SavedObjectsClient = saved_objects_1.SavedObjectsClient;
exports.SavedObjectsErrorHelpers = saved_objects_1.SavedObjectsErrorHelpers;
exports.SavedObjectsSchema = saved_objects_1.SavedObjectsSchema;
exports.SavedObjectsSerializer = saved_objects_1.SavedObjectsSerializer;
exports.SavedObjectsRepository = saved_objects_1.SavedObjectsRepository;
exports.SavedObjectTypeRegistry = saved_objects_1.SavedObjectTypeRegistry;
exports.exportSavedObjectsToStream = saved_objects_1.exportSavedObjectsToStream;
exports.importSavedObjectsFromStream = saved_objects_1.importSavedObjectsFromStream;
exports.resolveSavedObjectsImportErrors = saved_objects_1.resolveSavedObjectsImportErrors;
var legacy_1 = require("./legacy");
exports.LegacyInternals = legacy_1.LegacyInternals;
var status_1 = require("./status");
exports.ServiceStatusLevels = status_1.ServiceStatusLevels;
/**
 * Config schemas for the platform services.
 *
 * @alpha
 */
exports.config = {
    elasticsearch: {
        schema: elasticsearch_1.configSchema,
    },
};
