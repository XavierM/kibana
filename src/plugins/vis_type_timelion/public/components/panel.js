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
const react_1 = tslib_1.__importStar(require("react"));
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const moment_timezone_1 = tslib_1.__importDefault(require("moment-timezone"));
const lodash_1 = require("lodash");
const public_1 = require("../../../kibana_react/public");
require("../flot");
const lib_1 = require("../../common/lib");
const panel_utils_1 = require("../helpers/panel_utils");
const tick_formatters_1 = require("../helpers/tick_formatters");
const tick_generator_1 = require("../helpers/tick_generator");
const DEBOUNCE_DELAY = 50;
// ensure legend is the same height with or without a caption so legend items do not move around
const emptyCaption = '<br>';
function Panel({ interval, seriesList, renderComplete }) {
    const kibana = public_1.useKibana();
    const [chart, setChart] = react_1.useState(() => lodash_1.cloneDeep(seriesList.list));
    const [canvasElem, setCanvasElem] = react_1.useState();
    const [chartElem, setChartElem] = react_1.useState();
    const [originalColorMap, setOriginalColorMap] = react_1.useState(() => new Map());
    const [highlightedSeries, setHighlightedSeries] = react_1.useState(null);
    const [focusedSeries, setFocusedSeries] = react_1.useState();
    const [plot, setPlot] = react_1.useState();
    // Used to toggle the series, and for displaying values on hover
    const [legendValueNumbers, setLegendValueNumbers] = react_1.useState();
    const [legendCaption, setLegendCaption] = react_1.useState();
    const canvasRef = react_1.useCallback(node => {
        if (node !== null) {
            setCanvasElem(node);
        }
    }, []);
    const elementRef = react_1.useCallback(node => {
        if (node !== null) {
            setChartElem(node);
        }
    }, []);
    react_1.useEffect(() => () => {
        jquery_1.default(chartElem)
            .off('plotselected')
            .off('plothover')
            .off('mouseleave');
    }, [chartElem]);
    const highlightSeries = react_1.useCallback(lodash_1.debounce(({ currentTarget }) => {
        const id = Number(currentTarget.getAttribute(panel_utils_1.SERIES_ID_ATTR));
        if (highlightedSeries === id) {
            return;
        }
        setHighlightedSeries(id);
        setChart(chartState => chartState.map((series, seriesIndex) => {
            series.color =
                seriesIndex === id
                    ? originalColorMap.get(series) // color it like it was
                    : 'rgba(128,128,128,0.1)'; // mark as grey
            return series;
        }));
    }, DEBOUNCE_DELAY), [originalColorMap, highlightedSeries]);
    const focusSeries = react_1.useCallback((event) => {
        const id = Number(event.currentTarget.getAttribute(panel_utils_1.SERIES_ID_ATTR));
        setFocusedSeries(id);
        highlightSeries(event);
    }, [highlightSeries]);
    const toggleSeries = react_1.useCallback(({ currentTarget }) => {
        const id = Number(currentTarget.getAttribute(panel_utils_1.SERIES_ID_ATTR));
        setChart(chartState => chartState.map((series, seriesIndex) => {
            if (seriesIndex === id) {
                series._hide = !series._hide;
            }
            return series;
        }));
    }, []);
    const updateCaption = react_1.useCallback((plotData) => {
        if (lodash_1.get(plotData, '[0]._global.legend.showTime', true)) {
            const caption = jquery_1.default('<caption class="timChart__legendCaption"></caption>');
            caption.html(emptyCaption);
            setLegendCaption(caption);
            const canvasNode = jquery_1.default(canvasElem);
            canvasNode.find('div.legend table').append(caption);
            setLegendValueNumbers(canvasNode.find('.ngLegendValueNumber'));
            const legend = jquery_1.default(canvasElem).find('.ngLegendValue');
            if (legend) {
                legend.click(toggleSeries);
                legend.focus(focusSeries);
                legend.mouseover(highlightSeries);
            }
            // legend has been re-created. Apply focus on legend element when previously set
            if (focusedSeries || focusedSeries === 0) {
                canvasNode
                    .find('div.legend table .legendLabel>span')
                    .get(focusedSeries)
                    .focus();
            }
        }
    }, [focusedSeries, canvasElem, toggleSeries, focusSeries, highlightSeries]);
    const updatePlot = react_1.useCallback((chartValue, grid) => {
        if (canvasElem && canvasElem.clientWidth > 0 && canvasElem.clientHeight > 0) {
            const options = panel_utils_1.buildOptions(interval, kibana.services.timefilter, kibana.services.uiSettings, chartElem && chartElem.clientWidth, grid);
            const updatedSeries = panel_utils_1.buildSeriesData(chartValue, options);
            if (options.yaxes) {
                options.yaxes.forEach((yaxis) => {
                    if (yaxis && yaxis.units) {
                        const formatters = tick_formatters_1.tickFormatters();
                        yaxis.tickFormatter = formatters[yaxis.units.type];
                        const byteModes = ['bytes', 'bytes/s'];
                        if (byteModes.includes(yaxis.units.type)) {
                            yaxis.tickGenerator = tick_generator_1.generateTicksProvider();
                        }
                    }
                });
            }
            const newPlot = jquery_1.default.plot(canvasElem, updatedSeries, options);
            setPlot(newPlot);
            renderComplete();
            updateCaption(newPlot.getData());
        }
    }, [canvasElem, chartElem, renderComplete, kibana.services, interval, updateCaption]);
    react_1.useEffect(() => {
        updatePlot(chart, seriesList.render && seriesList.render.grid);
    }, [chart, updatePlot, seriesList.render]);
    react_1.useEffect(() => {
        const colorsSet = [];
        const newChart = seriesList.list.map((series, seriesIndex) => {
            const newSeries = { ...series };
            if (!newSeries.color) {
                const colorIndex = seriesIndex % panel_utils_1.colors.length;
                newSeries.color = panel_utils_1.colors[colorIndex];
            }
            colorsSet.push([newSeries, newSeries.color]);
            return newSeries;
        });
        setChart(newChart);
        setOriginalColorMap(new Map(colorsSet));
    }, [seriesList.list]);
    const unhighlightSeries = react_1.useCallback(() => {
        if (highlightedSeries === null) {
            return;
        }
        setHighlightedSeries(null);
        setFocusedSeries(null);
        setChart(chartState => chartState.map((series) => {
            series.color = originalColorMap.get(series); // reset the colors
            return series;
        }));
    }, [originalColorMap, highlightedSeries]);
    // Shamelessly borrowed from the flotCrosshairs example
    const setLegendNumbers = react_1.useCallback((pos) => {
        unhighlightSeries();
        const axes = plot.getAxes();
        if (pos.x < axes.xaxis.min || pos.x > axes.xaxis.max) {
            return;
        }
        const dataset = plot.getData();
        if (legendCaption) {
            legendCaption.text(moment_timezone_1.default(pos.x).format(lodash_1.get(dataset, '[0]._global.legend.timeFormat', lib_1.DEFAULT_TIME_FORMAT)));
        }
        for (let i = 0; i < dataset.length; ++i) {
            const series = dataset[i];
            const useNearestPoint = series.lines.show && !series.lines.steps;
            const precision = lodash_1.get(series, '_meta.precision', 2);
            if (series._hide) {
                continue;
            }
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
            if (y != null && legendValueNumbers) {
                let label = y.toFixed(precision);
                if (series.yaxis.tickFormatter) {
                    label = series.yaxis.tickFormatter(Number(label), series.yaxis);
                }
                legendValueNumbers.eq(i).text(`(${label})`);
            }
            else {
                legendValueNumbers.eq(i).empty();
            }
        }
    }, [plot, legendValueNumbers, unhighlightSeries, legendCaption]);
    const debouncedSetLegendNumbers = react_1.useCallback(lodash_1.debounce(setLegendNumbers, DEBOUNCE_DELAY, {
        maxWait: DEBOUNCE_DELAY,
        leading: true,
        trailing: false,
    }), [setLegendNumbers]);
    const clearLegendNumbers = react_1.useCallback(() => {
        if (legendCaption) {
            legendCaption.html(emptyCaption);
        }
        lodash_1.each(legendValueNumbers, (num) => {
            jquery_1.default(num).empty();
        });
    }, [legendCaption, legendValueNumbers]);
    const plotHoverHandler = react_1.useCallback((event, pos) => {
        if (!plot) {
            return;
        }
        plot.setCrosshair(pos);
        debouncedSetLegendNumbers(pos);
    }, [plot, debouncedSetLegendNumbers]);
    const mouseLeaveHandler = react_1.useCallback(() => {
        if (!plot) {
            return;
        }
        plot.clearCrosshair();
        clearLegendNumbers();
    }, [plot, clearLegendNumbers]);
    const plotSelectedHandler = react_1.useCallback((event, ranges) => {
        kibana.services.timefilter.setTime({
            from: moment_timezone_1.default(ranges.xaxis.from),
            to: moment_timezone_1.default(ranges.xaxis.to),
        });
    }, [kibana.services.timefilter]);
    react_1.useEffect(() => {
        if (chartElem) {
            jquery_1.default(chartElem)
                .off('plotselected')
                .on('plotselected', plotSelectedHandler);
        }
    }, [chartElem, plotSelectedHandler]);
    react_1.useEffect(() => {
        if (chartElem) {
            jquery_1.default(chartElem)
                .off('mouseleave')
                .on('mouseleave', mouseLeaveHandler);
        }
    }, [chartElem, mouseLeaveHandler]);
    react_1.useEffect(() => {
        if (chartElem) {
            jquery_1.default(chartElem)
                .off('plothover')
                .on('plothover', plotHoverHandler);
        }
    }, [chartElem, plotHoverHandler]);
    const title = react_1.useMemo(() => lodash_1.last(lodash_1.compact(lodash_1.map(seriesList.list, '_title'))) || '', [
        seriesList.list,
    ]);
    return (react_1.default.createElement("div", { ref: elementRef, className: "timChart" },
        react_1.default.createElement("div", { className: "chart-top-title" }, title),
        react_1.default.createElement("div", { ref: canvasRef, className: "chart-canvas" })));
}
exports.Panel = Panel;
