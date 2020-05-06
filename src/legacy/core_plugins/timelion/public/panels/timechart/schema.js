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
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
require("../../../../../../plugins/vis_type_timelion/public/flot");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const timefilter_1 = require("ui/timefilter");
// @ts-ignore
const observe_resize_1 = tslib_1.__importDefault(require("../../lib/observe_resize"));
const lib_1 = require("../../../../../../plugins/vis_type_timelion/common/lib");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const tick_formatters_1 = require("../../../../../../plugins/vis_type_timelion/public/helpers/tick_formatters");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const xaxis_formatter_1 = require("../../../../../../plugins/vis_type_timelion/public/helpers/xaxis_formatter");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const tick_generator_1 = require("../../../../../../plugins/vis_type_timelion/public/helpers/tick_generator");
const DEBOUNCE_DELAY = 50;
function timechartFn(dependencies) {
    const { $rootScope, $compile, uiSettings } = dependencies;
    return function () {
        return {
            help: 'Draw a timeseries chart',
            render($scope, $elem) {
                const template = '<div class="chart-top-title"></div><div class="chart-canvas"></div>';
                const formatters = tick_formatters_1.tickFormatters();
                const getxAxisFormatter = xaxis_formatter_1.xaxisFormatterProvider(uiSettings);
                const generateTicks = tick_generator_1.generateTicksProvider();
                // TODO: I wonder if we should supply our own moment that sets this every time?
                // could just use angular's injection to provide a moment service?
                moment_timezone_1.default.tz.setDefault(uiSettings.get('dateFormat:tz'));
                const render = $scope.seriesList.render || {};
                $scope.chart = $scope.seriesList.list;
                $scope.interval = $scope.interval;
                $scope.search = $scope.search || lodash_1.default.noop;
                let legendValueNumbers;
                let legendCaption;
                const debouncedSetLegendNumbers = lodash_1.default.debounce(setLegendNumbers, DEBOUNCE_DELAY, {
                    maxWait: DEBOUNCE_DELAY,
                    leading: true,
                    trailing: false,
                });
                // ensure legend is the same height with or without a caption so legend items do not move around
                const emptyCaption = '<br>';
                const defaultOptions = {
                    xaxis: {
                        mode: 'time',
                        tickLength: 5,
                        timezone: 'browser',
                    },
                    selection: {
                        mode: 'x',
                        color: '#ccc',
                    },
                    crosshair: {
                        mode: 'x',
                        color: '#C66',
                        lineWidth: 2,
                    },
                    grid: {
                        show: render.grid,
                        borderWidth: 0,
                        borderColor: null,
                        margin: 10,
                        hoverable: true,
                        autoHighlight: false,
                    },
                    legend: {
                        backgroundColor: 'rgb(255,255,255,0)',
                        position: 'nw',
                        labelBoxBorderColor: 'rgb(255,255,255,0)',
                        labelFormatter(label, series) {
                            const wrapperSpan = document.createElement('span');
                            const labelSpan = document.createElement('span');
                            const numberSpan = document.createElement('span');
                            wrapperSpan.setAttribute('class', 'ngLegendValue');
                            wrapperSpan.setAttribute('kbn-accessible-click', '');
                            wrapperSpan.setAttribute('ng-click', `toggleSeries(${series._id})`);
                            wrapperSpan.setAttribute('ng-focus', `focusSeries(${series._id})`);
                            wrapperSpan.setAttribute('ng-mouseover', `highlightSeries(${series._id})`);
                            labelSpan.setAttribute('ng-non-bindable', '');
                            labelSpan.appendChild(document.createTextNode(label));
                            numberSpan.setAttribute('class', 'ngLegendValueNumber');
                            wrapperSpan.appendChild(labelSpan);
                            wrapperSpan.appendChild(numberSpan);
                            return wrapperSpan.outerHTML;
                        },
                    },
                    colors: [
                        '#01A4A4',
                        '#C66',
                        '#D0D102',
                        '#616161',
                        '#00A1CB',
                        '#32742C',
                        '#F18D05',
                        '#113F8C',
                        '#61AE24',
                        '#D70060',
                    ],
                };
                const originalColorMap = new Map();
                $scope.chart.forEach((series, seriesIndex) => {
                    if (!series.color) {
                        const colorIndex = seriesIndex % defaultOptions.colors.length;
                        series.color = defaultOptions.colors[colorIndex];
                    }
                    originalColorMap.set(series, series.color);
                });
                let highlightedSeries;
                let focusedSeries;
                function unhighlightSeries() {
                    if (highlightedSeries === null) {
                        return;
                    }
                    highlightedSeries = null;
                    focusedSeries = null;
                    $scope.chart.forEach((series) => {
                        series.color = originalColorMap.get(series); // reset the colors
                    });
                    drawPlot($scope.chart);
                }
                $scope.highlightSeries = lodash_1.default.debounce(function (id) {
                    if (highlightedSeries === id) {
                        return;
                    }
                    highlightedSeries = id;
                    $scope.chart.forEach((series, seriesIndex) => {
                        if (seriesIndex !== id) {
                            series.color = 'rgba(128,128,128,0.1)'; // mark as grey
                        }
                        else {
                            series.color = originalColorMap.get(series); // color it like it was
                        }
                    });
                    drawPlot($scope.chart);
                }, DEBOUNCE_DELAY);
                $scope.focusSeries = function (id) {
                    focusedSeries = id;
                    $scope.highlightSeries(id);
                };
                $scope.toggleSeries = function (id) {
                    const series = $scope.chart[id];
                    series._hide = !series._hide;
                    drawPlot($scope.chart);
                };
                const cancelResize = observe_resize_1.default($elem, function () {
                    drawPlot($scope.chart);
                });
                $scope.$on('$destroy', function () {
                    cancelResize();
                    $elem.off('plothover');
                    $elem.off('plotselected');
                    $elem.off('mouseleave');
                });
                $elem.on('plothover', function (event, pos, item) {
                    $rootScope.$broadcast('timelionPlotHover', event, pos, item);
                });
                $elem.on('plotselected', function (event, ranges) {
                    timefilter_1.timefilter.setTime({
                        from: moment_timezone_1.default(ranges.xaxis.from),
                        to: moment_timezone_1.default(ranges.xaxis.to),
                    });
                });
                $elem.on('mouseleave', function () {
                    $rootScope.$broadcast('timelionPlotLeave');
                });
                $scope.$on('timelionPlotHover', function (angularEvent, flotEvent, pos) {
                    if (!$scope.plot)
                        return;
                    $scope.plot.setCrosshair(pos);
                    debouncedSetLegendNumbers(pos);
                });
                $scope.$on('timelionPlotLeave', function () {
                    if (!$scope.plot)
                        return;
                    $scope.plot.clearCrosshair();
                    clearLegendNumbers();
                });
                // Shamelessly borrowed from the flotCrosshairs example
                function setLegendNumbers(pos) {
                    unhighlightSeries();
                    const plot = $scope.plot;
                    const axes = plot.getAxes();
                    if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max) {
                        return;
                    }
                    let i;
                    const dataset = plot.getData();
                    if (legendCaption) {
                        legendCaption.text(moment_timezone_1.default(pos.x).format(lodash_1.default.get(dataset, '[0]._global.legend.timeFormat', lib_1.DEFAULT_TIME_FORMAT)));
                    }
                    for (i = 0; i < dataset.length; ++i) {
                        const series = dataset[i];
                        const useNearestPoint = series.lines.show && !series.lines.steps;
                        const precision = lodash_1.default.get(series, '_meta.precision', 2);
                        if (series._hide)
                            continue;
                        const currentPoint = series.data.find((point, index) => {
                            if (index + 1 === series.data.length) {
                                return true;
                            }
                            if (useNearestPoint) {
                                return pos.x - point[0] < series.data[index + 1][0] - pos.x;
                            }
                            else {
                                return pos.x < series.data[index + 1][0];
                            }
                        });
                        const y = currentPoint[1];
                        if (y != null) {
                            let label = y.toFixed(precision);
                            if (series.yaxis.tickFormatter) {
                                label = series.yaxis.tickFormatter(label, series.yaxis);
                            }
                            legendValueNumbers.eq(i).text(`(${label})`);
                        }
                        else {
                            legendValueNumbers.eq(i).empty();
                        }
                    }
                }
                function clearLegendNumbers() {
                    if (legendCaption) {
                        legendCaption.html(emptyCaption);
                    }
                    lodash_1.default.each(legendValueNumbers, function (num) {
                        jquery_1.default(num).empty();
                    });
                }
                let legendScope = $scope.$new();
                function drawPlot(plotConfig) {
                    if (!jquery_1.default('.chart-canvas', $elem).length)
                        $elem.html(template);
                    const canvasElem = jquery_1.default('.chart-canvas', $elem);
                    // we can't use `$.plot` to draw the chart when the height or width is 0
                    // so, we'll need another event to trigger drawPlot to actually draw it
                    if (canvasElem.height() === 0 || canvasElem.width() === 0) {
                        return;
                    }
                    const title = lodash_1.default(plotConfig)
                        .map('_title')
                        .compact()
                        .last();
                    jquery_1.default('.chart-top-title', $elem).text(title == null ? '' : title);
                    const options = lodash_1.default.cloneDeep(defaultOptions);
                    // Get the X-axis tick format
                    const time = timefilter_1.timefilter.getBounds();
                    const interval = lib_1.calculateInterval(time.min.valueOf(), time.max.valueOf(), uiSettings.get('timelion:target_buckets') || 200, $scope.interval, uiSettings.get('timelion:min_interval') || '1ms');
                    const format = getxAxisFormatter(interval);
                    // Use moment to format ticks so we get timezone correction
                    options.xaxis.tickFormatter = function (val) {
                        return moment_timezone_1.default(val).format(format);
                    };
                    // Calculate how many ticks can fit on the axis
                    const tickLetterWidth = 7;
                    const tickPadding = 45;
                    options.xaxis.ticks = Math.floor($elem.width() / (format.length * tickLetterWidth + tickPadding));
                    const series = lodash_1.default.map(plotConfig, function (serie, index) {
                        serie = lodash_1.default.cloneDeep(lodash_1.default.defaults(serie, {
                            shadowSize: 0,
                            lines: {
                                lineWidth: 3,
                            },
                        }));
                        serie._id = index;
                        if (serie.color) {
                            const span = document.createElement('span');
                            span.style.color = serie.color;
                            serie.color = span.style.color;
                        }
                        if (serie._hide) {
                            serie.data = [];
                            serie.stack = false;
                            // serie.color = "#ddd";
                            serie.label = '(hidden) ' + serie.label;
                        }
                        if (serie._global) {
                            lodash_1.default.merge(options, serie._global, function (objVal, srcVal) {
                                // This is kind of gross, it means that you can't replace a global value with a null
                                // best you can do is an empty string. Deal with it.
                                if (objVal == null)
                                    return srcVal;
                                if (srcVal == null)
                                    return objVal;
                            });
                        }
                        return serie;
                    });
                    if (options.yaxes) {
                        options.yaxes.forEach((yaxis) => {
                            if (yaxis && yaxis.units) {
                                yaxis.tickFormatter = formatters[yaxis.units.type];
                                const byteModes = ['bytes', 'bytes/s'];
                                if (byteModes.includes(yaxis.units.type)) {
                                    yaxis.tickGenerator = generateTicks;
                                }
                            }
                        });
                    }
                    // @ts-ignore
                    $scope.plot = jquery_1.default.plot(canvasElem, lodash_1.default.compact(series), options);
                    if ($scope.plot) {
                        $scope.$emit('timelionChartRendered');
                    }
                    legendScope.$destroy();
                    legendScope = $scope.$new();
                    // Used to toggle the series, and for displaying values on hover
                    legendValueNumbers = canvasElem.find('.ngLegendValueNumber');
                    lodash_1.default.each(canvasElem.find('.ngLegendValue'), function (elem) {
                        $compile(elem)(legendScope);
                    });
                    if (lodash_1.default.get($scope.plot.getData(), '[0]._global.legend.showTime', true)) {
                        legendCaption = jquery_1.default('<caption class="timChart__legendCaption"></caption>');
                        legendCaption.html(emptyCaption);
                        canvasElem.find('div.legend table').append(legendCaption);
                        // legend has been re-created. Apply focus on legend element when previously set
                        if (focusedSeries || focusedSeries === 0) {
                            const $legendLabels = canvasElem.find('div.legend table .legendLabel>span');
                            $legendLabels.get(focusedSeries).focus();
                        }
                    }
                }
                $scope.$watch('chart', drawPlot);
            },
        };
    };
}
exports.timechartFn = timechartFn;
