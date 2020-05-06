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
const metric_vis_fn_1 = require("./metric_vis_fn");
const metric_vis_type_1 = require("./metric_vis_type");
const services_1 = require("./services");
/** @internal */
class MetricVisPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    setup(core, { expressions, visualizations, charts }) {
        expressions.registerFunction(metric_vis_fn_1.createMetricVisFn);
        visualizations.createReactVisualization(metric_vis_type_1.createMetricVisTypeDefinition());
    }
    start(core, { data }) {
        services_1.setFormatService(data.fieldFormats);
    }
}
exports.MetricVisPlugin = MetricVisPlugin;
