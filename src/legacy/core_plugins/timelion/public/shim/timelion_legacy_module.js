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
require("ngreact");
require("brace/mode/hjson");
require("brace/ext/searchbox");
require("ui/accessibility/kbn_ui_ace_keyboard_mode");
const lodash_1 = require("lodash");
// @ts-ignore
const modules_1 = require("ui/modules");
// @ts-ignore
const chart_1 = require("../directives/chart/chart");
// @ts-ignore
const timelion_interval_1 = require("../directives/timelion_interval/timelion_interval");
// @ts-ignore
const timelion_expression_input_1 = require("../directives/timelion_expression_input");
// @ts-ignore
const timelion_expression_suggestions_1 = require("../directives/timelion_expression_suggestions/timelion_expression_suggestions");
/** @internal */
exports.initTimelionLegacyModule = lodash_1.once((timelionPanels) => {
    require('ui/state_management/app_state');
    modules_1.uiModules
        .get('apps/timelion', [])
        .controller('TimelionVisController', function ($scope) {
        $scope.$on('timelionChartRendered', (event) => {
            event.stopPropagation();
            $scope.renderComplete();
        });
    })
        .constant('timelionPanels', timelionPanels)
        .directive('chart', chart_1.Chart)
        .directive('timelionInterval', timelion_interval_1.TimelionInterval)
        .directive('timelionExpressionSuggestions', timelion_expression_suggestions_1.TimelionExpressionSuggestions)
        .directive('timelionExpressionInput', timelion_expression_input_1.TimelionExpInput);
});
