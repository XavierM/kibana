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
require("./index.scss");
const vis_type_vislib_vis_fn_1 = require("./vis_type_vislib_vis_fn");
const pie_fn_1 = require("./pie_fn");
const vis_type_vislib_vis_types_1 = require("./vis_type_vislib_vis_types");
const services_1 = require("./services");
/** @internal */
class VisTypeVislibPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { expressions, visualizations, charts, visTypeXy }) {
        const visualizationDependencies = {
            uiSettings: core.uiSettings,
            charts,
        };
        const vislibTypes = [
            vis_type_vislib_vis_types_1.createHistogramVisTypeDefinition,
            vis_type_vislib_vis_types_1.createLineVisTypeDefinition,
            vis_type_vislib_vis_types_1.createPieVisTypeDefinition,
            vis_type_vislib_vis_types_1.createAreaVisTypeDefinition,
            vis_type_vislib_vis_types_1.createHeatmapVisTypeDefinition,
            vis_type_vislib_vis_types_1.createHorizontalBarVisTypeDefinition,
            vis_type_vislib_vis_types_1.createGaugeVisTypeDefinition,
            vis_type_vislib_vis_types_1.createGoalVisTypeDefinition,
        ];
        const vislibFns = [vis_type_vislib_vis_fn_1.createVisTypeVislibVisFn(), pie_fn_1.createPieVisFn()];
        // if visTypeXy plugin is disabled it's config will be undefined
        if (!visTypeXy) {
            const convertedTypes = [];
            const convertedFns = [];
            // Register legacy vislib types that have been converted
            convertedFns.forEach(expressions.registerFunction);
            convertedTypes.forEach(vis => visualizations.createBaseVisualization(vis(visualizationDependencies)));
        }
        // Register non-converted types
        vislibFns.forEach(expressions.registerFunction);
        vislibTypes.forEach(vis => visualizations.createBaseVisualization(vis(visualizationDependencies)));
    }
    start(core, { data }) {
        services_1.setFormatService(data.fieldFormats);
        services_1.setDataActions(data.actions);
    }
}
exports.VisTypeVislibPlugin = VisTypeVislibPlugin;
