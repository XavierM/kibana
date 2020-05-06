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
const timelion_vis_fn_1 = require("./timelion_vis_fn");
const timelion_vis_type_1 = require("./timelion_vis_type");
const plugin_services_1 = require("./helpers/plugin_services");
require("./index.scss");
const arg_value_suggestions_1 = require("./helpers/arg_value_suggestions");
/** @internal */
class TimelionVisPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    setup(core, { expressions, visualizations, data }) {
        const dependencies = {
            uiSettings: core.uiSettings,
            http: core.http,
            timefilter: data.query.timefilter.timefilter,
        };
        expressions.registerFunction(() => timelion_vis_fn_1.getTimelionVisualizationConfig(dependencies));
        visualizations.createReactVisualization(timelion_vis_type_1.getTimelionVisDefinition(dependencies));
    }
    start(core, plugins) {
        plugin_services_1.setIndexPatterns(plugins.data.indexPatterns);
        plugin_services_1.setSavedObjectsClient(core.savedObjects.client);
        if (this.initializerContext.config.get().ui.enabled === false) {
            core.chrome.navLinks.update('timelion', { hidden: true });
        }
        return {
            getArgValueSuggestions: arg_value_suggestions_1.getArgValueSuggestions,
        };
    }
}
exports.TimelionVisPlugin = TimelionVisPlugin;
