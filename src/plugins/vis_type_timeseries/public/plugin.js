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
require("./application/index.scss");
const metrics_fn_1 = require("./metrics_fn");
const metrics_type_1 = require("./metrics_type");
const services_1 = require("./services");
/** @internal */
class MetricsPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { expressions, visualizations, charts }) {
        expressions.registerFunction(metrics_fn_1.createMetricsFn);
        services_1.setUISettings(core.uiSettings);
        services_1.setChartsSetup(charts);
        visualizations.createReactVisualization(metrics_type_1.metricsVisDefinition);
    }
    start(core, { data }) {
        services_1.setSavedObjectsClient(core.savedObjects);
        services_1.setI18n(core.i18n);
        services_1.setFieldFormats(data.fieldFormats);
        services_1.setDataStart(data);
        services_1.setCoreStart(core);
    }
}
exports.MetricsPlugin = MetricsPlugin;
