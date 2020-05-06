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
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const metric_vis_value_1 = require("./metric_vis_value");
const public_1 = require("../../../charts/public");
const services_1 = require("../services");
class MetricVisComponent extends react_1.Component {
    constructor() {
        super(...arguments);
        this.getFormattedValue = (fieldFormatter, value, format = 'text') => {
            if (lodash_1.isNaN(value))
                return '-';
            return fieldFormatter.convert(value, format);
        };
        this.filterBucket = (metric) => {
            const dimensions = this.props.visParams.dimensions;
            if (!dimensions.bucket) {
                return;
            }
            const table = this.props.visData;
            this.props.vis.API.events.filter({
                table,
                column: dimensions.bucket.accessor,
                row: metric.rowIndex,
            });
        };
        this.renderMetric = (metric, index) => {
            return (react_1.default.createElement(metric_vis_value_1.MetricVisValue, { key: index, metric: metric, fontSize: this.props.visParams.metric.style.fontSize, onFilter: this.props.visParams.dimensions.bucket ? this.filterBucket : undefined, showLabel: this.props.visParams.metric.labels.show }));
        };
    }
    getLabels() {
        const config = this.props.visParams.metric;
        const isPercentageMode = config.percentageMode;
        const colorsRange = config.colorsRange;
        const max = lodash_1.last(colorsRange).to;
        const labels = [];
        colorsRange.forEach((range) => {
            const from = isPercentageMode ? Math.round((100 * range.from) / max) : range.from;
            const to = isPercentageMode ? Math.round((100 * range.to) / max) : range.to;
            labels.push(`${from} - ${to}`);
        });
        return labels;
    }
    getColors() {
        const config = this.props.visParams.metric;
        const invertColors = config.invertColors;
        const colorSchema = config.colorSchema;
        const colorsRange = config.colorsRange;
        const labels = this.getLabels();
        const colors = {};
        for (let i = 0; i < labels.length; i += 1) {
            const divider = Math.max(colorsRange.length - 1, 1);
            const val = invertColors ? 1 - i / divider : i / divider;
            colors[labels[i]] = public_1.getHeatmapColors(val, colorSchema);
        }
        return colors;
    }
    getBucket(val) {
        const config = this.props.visParams.metric;
        let bucket = lodash_1.findIndex(config.colorsRange, (range) => {
            return range.from <= val && range.to > val;
        });
        if (bucket === -1) {
            if (val < config.colorsRange[0].from)
                bucket = 0;
            else
                bucket = config.colorsRange.length - 1;
        }
        return bucket;
    }
    getColor(val, labels, colors) {
        const bucket = this.getBucket(val);
        const label = labels[bucket];
        return colors[label];
    }
    needsLightText(bgColor) {
        const colors = /rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/.exec(bgColor);
        if (!colors) {
            return false;
        }
        const [red, green, blue] = colors.slice(1).map(parseInt);
        return eui_1.isColorDark(red, green, blue);
    }
    processTableGroups(table) {
        const config = this.props.visParams.metric;
        const dimensions = this.props.visParams.dimensions;
        const isPercentageMode = config.percentageMode;
        const min = config.colorsRange[0].from;
        const max = lodash_1.last(config.colorsRange).to;
        const colors = this.getColors();
        const labels = this.getLabels();
        const metrics = [];
        let bucketColumnId;
        let bucketFormatter;
        if (dimensions.bucket) {
            bucketColumnId = table.columns[dimensions.bucket.accessor].id;
            bucketFormatter = services_1.getFormatService().deserialize(dimensions.bucket.format);
        }
        dimensions.metrics.forEach((metric) => {
            const columnIndex = metric.accessor;
            const column = table?.columns[columnIndex];
            const formatter = services_1.getFormatService().deserialize(metric.format);
            table.rows.forEach((row, rowIndex) => {
                let title = column.name;
                let value = row[column.id];
                const color = this.getColor(value, labels, colors);
                if (isPercentageMode) {
                    value = (value - min) / (max - min);
                }
                value = this.getFormattedValue(formatter, value, 'html');
                if (bucketColumnId) {
                    const bucketValue = this.getFormattedValue(bucketFormatter, row[bucketColumnId]);
                    title = `${bucketValue} - ${title}`;
                }
                const shouldColor = config.colorsRange.length > 1;
                metrics.push({
                    label: title,
                    value,
                    color: shouldColor && config.style.labelColor ? color : undefined,
                    bgColor: shouldColor && config.style.bgColor ? color : undefined,
                    lightText: shouldColor && config.style.bgColor && this.needsLightText(color),
                    rowIndex,
                });
            });
        });
        return metrics;
    }
    componentDidMount() {
        this.props.renderComplete();
    }
    componentDidUpdate() {
        this.props.renderComplete();
    }
    render() {
        let metricsHtml;
        if (this.props.visData) {
            const metrics = this.processTableGroups(this.props.visData);
            metricsHtml = metrics.map(this.renderMetric);
        }
        return react_1.default.createElement("div", { className: "mtrVis" }, metricsHtml);
    }
}
exports.MetricVisComponent = MetricVisComponent;
