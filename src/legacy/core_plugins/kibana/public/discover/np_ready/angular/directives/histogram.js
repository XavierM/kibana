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
const eui_1 = require("@elastic/eui");
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const react_1 = tslib_1.__importStar(require("react"));
const prop_types_1 = tslib_1.__importDefault(require("prop-types"));
const eui_theme_light_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_light.json"));
const eui_theme_dark_json_1 = tslib_1.__importDefault(require("@elastic/eui/dist/eui_theme_dark.json"));
const charts_1 = require("@elastic/charts");
const i18n_1 = require("@kbn/i18n");
const kibana_services_1 = require("../../../kibana_services");
function findIntervalFromDuration(dateValue, esValue, esUnit, timeZone) {
    const date = moment_timezone_1.default.tz(dateValue, timeZone);
    const startOfDate = moment_timezone_1.default.tz(date, timeZone).startOf(esUnit);
    const endOfDate = moment_timezone_1.default
        .tz(date, timeZone)
        .startOf(esUnit)
        .add(esValue, esUnit);
    return endOfDate.valueOf() - startOfDate.valueOf();
}
function getIntervalInMs(value, esValue, esUnit, timeZone) {
    switch (esUnit) {
        case 's':
            return 1000 * esValue;
        case 'ms':
            return 1 * esValue;
        default:
            return findIntervalFromDuration(value, esValue, esUnit, timeZone);
    }
}
function getTimezone(uiSettings) {
    if (uiSettings.isDefault('dateFormat:tz')) {
        const detectedTimezone = moment_timezone_1.default.tz.guess();
        if (detectedTimezone)
            return detectedTimezone;
        else
            return moment_timezone_1.default().format('Z');
    }
    else {
        return uiSettings.get('dateFormat:tz', 'Browser');
    }
}
function findMinInterval(xValues, esValue, esUnit, timeZone) {
    return xValues.reduce((minInterval, currentXvalue, index) => {
        let currentDiff = minInterval;
        if (index > 0) {
            currentDiff = Math.abs(xValues[index - 1] - currentXvalue);
        }
        const singleUnitInterval = getIntervalInMs(currentXvalue, esValue, esUnit, timeZone);
        return Math.min(minInterval, singleUnitInterval, currentDiff);
    }, Number.MAX_SAFE_INTEGER);
}
exports.findMinInterval = findMinInterval;
class DiscoverHistogram extends react_1.Component {
    constructor() {
        super(...arguments);
        this.state = {
            chartsTheme: kibana_services_1.getServices().theme.chartsDefaultTheme,
        };
        this.onBrushEnd = (min, max) => {
            const range = {
                from: min,
                to: max,
            };
            this.props.timefilterUpdateHandler(range);
        };
        this.onElementClick = (xInterval) => ([elementData]) => {
            const startRange = elementData[0].x;
            const range = {
                from: startRange,
                to: startRange + xInterval,
            };
            this.props.timefilterUpdateHandler(range);
        };
        this.formatXValue = (val) => {
            const xAxisFormat = this.props.chartData.xAxisFormat.params.pattern;
            return moment_timezone_1.default(val).format(xAxisFormat);
        };
        this.renderBarTooltip = (xInterval, domainStart, domainEnd) => (headerData) => {
            const headerDataValue = headerData.value;
            const formattedValue = this.formatXValue(headerDataValue);
            const partialDataText = i18n_1.i18n.translate('kbn.discover.histogram.partialData.bucketTooltipText', {
                defaultMessage: 'The selected time range does not include this entire bucket, it may contain partial data.',
            });
            if (headerDataValue < domainStart || headerDataValue + xInterval > domainEnd) {
                return (react_1.default.createElement(react_1.default.Fragment, null,
                    react_1.default.createElement(eui_1.EuiFlexGroup, { alignItems: "center", className: "dscHistogram__header--partial", responsive: false, gutterSize: "xs" },
                        react_1.default.createElement(eui_1.EuiFlexItem, { grow: false },
                            react_1.default.createElement(eui_1.EuiIcon, { type: "iInCircle" })),
                        react_1.default.createElement(eui_1.EuiFlexItem, null, partialDataText)),
                    react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
                    react_1.default.createElement("p", null, formattedValue)));
            }
            return formattedValue;
        };
    }
    componentDidMount() {
        this.subscription = kibana_services_1.getServices().theme.chartsTheme$.subscribe((chartsTheme) => this.setState({ chartsTheme }));
    }
    componentWillUnmount() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
    render() {
        const uiSettings = kibana_services_1.getServices().uiSettings;
        const timeZone = getTimezone(uiSettings);
        const { chartData } = this.props;
        const { chartsTheme } = this.state;
        if (!chartData) {
            return null;
        }
        const data = chartData.values;
        /**
         * Deprecation: [interval] on [date_histogram] is deprecated, use [fixed_interval] or [calendar_interval].
         * see https://github.com/elastic/kibana/issues/27410
         * TODO: Once the Discover query has been update, we should change the below to use the new field
         */
        const { intervalESValue, intervalESUnit, interval } = chartData.ordered;
        const xInterval = interval.asMilliseconds();
        const xValues = chartData.xAxisOrderedValues;
        const lastXValue = xValues[xValues.length - 1];
        const domain = chartData.ordered;
        const domainStart = domain.min.valueOf();
        const domainEnd = domain.max.valueOf();
        const domainMin = data[0]?.x > domainStart ? domainStart : data[0]?.x;
        const domainMax = domainEnd - xInterval > lastXValue ? domainEnd - xInterval : lastXValue;
        const xDomain = {
            min: domainMin,
            max: domainMax,
            minInterval: findMinInterval(xValues, intervalESValue, intervalESUnit, timeZone),
        };
        // Domain end of 'now' will be milliseconds behind current time, so we extend time by 1 minute and check if
        // the annotation is within this range; if so, the line annotation uses the domainEnd as its value
        const now = moment_timezone_1.default();
        const isAnnotationAtEdge = moment_timezone_1.default(domainEnd)
            .add(60000)
            .isAfter(now) && now.isAfter(domainEnd);
        const lineAnnotationValue = isAnnotationAtEdge ? domainEnd : now;
        const lineAnnotationData = [
            {
                dataValue: lineAnnotationValue,
            },
        ];
        const isDarkMode = uiSettings.get('theme:darkMode');
        const lineAnnotationStyle = {
            line: {
                strokeWidth: 2,
                stroke: isDarkMode ? eui_theme_dark_json_1.default.euiColorDanger : eui_theme_light_json_1.default.euiColorDanger,
                opacity: 0.7,
            },
        };
        const rectAnnotations = [];
        if (domainStart !== domainMin) {
            rectAnnotations.push({
                coordinates: {
                    x1: domainStart,
                },
            });
        }
        if (domainEnd !== domainMax) {
            rectAnnotations.push({
                coordinates: {
                    x0: domainEnd,
                },
            });
        }
        const rectAnnotationStyle = {
            stroke: isDarkMode ? eui_theme_dark_json_1.default.euiColorLightShade : eui_theme_light_json_1.default.euiColorDarkShade,
            strokeWidth: 0,
            opacity: isDarkMode ? 0.6 : 0.2,
            fill: isDarkMode ? eui_theme_dark_json_1.default.euiColorLightShade : eui_theme_light_json_1.default.euiColorDarkShade,
        };
        const tooltipProps = {
            headerFormatter: this.renderBarTooltip(xInterval, domainStart, domainEnd),
            type: charts_1.TooltipType.VerticalCursor,
        };
        return (react_1.default.createElement(charts_1.Chart, { size: "100%" },
            react_1.default.createElement(charts_1.Settings, { xDomain: xDomain, onBrushEnd: this.onBrushEnd, onElementClick: this.onElementClick(xInterval), tooltip: tooltipProps, theme: chartsTheme }),
            react_1.default.createElement(charts_1.Axis, { id: "discover-histogram-left-axis", position: charts_1.Position.Left, ticks: 5, title: chartData.yAxisLabel }),
            react_1.default.createElement(charts_1.Axis, { id: "discover-histogram-bottom-axis", position: charts_1.Position.Bottom, title: chartData.xAxisLabel, tickFormat: this.formatXValue, ticks: 10 }),
            react_1.default.createElement(charts_1.LineAnnotation, { id: "line-annotation", domainType: charts_1.AnnotationDomainTypes.XDomain, dataValues: lineAnnotationData, hideTooltips: true, style: lineAnnotationStyle }),
            react_1.default.createElement(charts_1.RectAnnotation, { dataValues: rectAnnotations, id: "rect-annotation", zIndex: 2, style: rectAnnotationStyle, hideTooltips: true }),
            react_1.default.createElement(charts_1.HistogramBarSeries, { id: "discover-histogram", xScaleType: charts_1.ScaleType.Time, yScaleType: charts_1.ScaleType.Linear, xAccessor: "x", yAccessors: ['y'], data: data, timeZone: timeZone, name: chartData.yAxisLabel })));
    }
}
exports.DiscoverHistogram = DiscoverHistogram;
DiscoverHistogram.propTypes = {
    chartData: prop_types_1.default.object,
    timefilterUpdateHandler: prop_types_1.default.func,
};
