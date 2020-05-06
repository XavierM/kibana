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
const tslib_1 = require("tslib");
const react_1 = tslib_1.__importDefault(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const chart_options_1 = require("./chart_options");
function SeriesPanel({ seriesParams, ...chartProps }) {
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(eui_1.EuiTitle, { size: "xs" },
            react_1.default.createElement("h3", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.controls.pointSeries.series.metricsTitle", defaultMessage: "Metrics" }))),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        seriesParams.map((chart, index) => (react_1.default.createElement(eui_1.EuiAccordion, { id: `visEditorSeriesAccordion${chart.data.id}`, key: index, className: "visEditorSidebar__section visEditorSidebar__collapsible", initialIsOpen: index === 0, buttonContent: chart.data.label, buttonContentClassName: "visEditorSidebar__aggGroupAccordionButtonContent eui-textTruncate", "aria-label": i18n_1.i18n.translate('visTypeVislib.controls.pointSeries.seriesAccordionAriaLabel', {
                defaultMessage: 'Toggle {agg} options',
                values: { agg: chart.data.label },
            }) },
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
                react_1.default.createElement(chart_options_1.ChartOptions, Object.assign({ index: index, chart: chart }, chartProps))))))));
}
exports.SeriesPanel = SeriesPanel;
