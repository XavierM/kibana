"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importStar(require("react"));
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const lodash_1 = require("lodash");
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const services_1 = require("../../../services");
const models_1 = require("./models");
const legend_item_1 = require("./legend_item");
const pie_utils_1 = require("./pie_utils");
class VisLegend extends react_1.PureComponent {
    constructor(props) {
        super(props);
        this.legendId = eui_1.htmlIdGenerator()('legend');
        this.getColor = () => '';
        this.toggleLegend = () => {
            const bwcAddLegend = this.props.vis.params.addLegend;
            const bwcLegendStateDefault = bwcAddLegend == null ? true : bwcAddLegend;
            const newOpen = !this.props.uiState.get('vis.legendOpen', bwcLegendStateDefault);
            this.setState({ open: newOpen });
            // open should be applied on template before we update uiState
            setTimeout(() => {
                this.props.uiState.set('vis.legendOpen', newOpen);
            });
        };
        this.setColor = (label, color) => (event) => {
            if (event.keyCode && event.keyCode !== eui_1.keyCodes.ENTER) {
                return;
            }
            const colors = this.props.uiState.get('vis.colors') || {};
            if (colors[label] === color)
                delete colors[label];
            else
                colors[label] = color;
            this.props.uiState.setSilent('vis.colors', null);
            this.props.uiState.set('vis.colors', colors);
            this.props.uiState.emit('colorChanged');
            this.refresh();
        };
        this.filter = ({ values: data }, negate) => {
            this.props.vis.API.events.filter({ data, negate });
        };
        this.canFilter = async (item) => {
            if (models_1.CUSTOM_LEGEND_VIS_TYPES.includes(this.props.vislibVis.visConfigArgs.type)) {
                return false;
            }
            if (item.values && lodash_1.every(item.values, lodash_1.isUndefined)) {
                return false;
            }
            const filters = await services_1.getDataActions().createFiltersFromValueClickAction({ data: item.values });
            return Boolean(filters.length);
        };
        this.toggleDetails = (label) => (event) => {
            if (event &&
                event.keyCode &&
                event.keyCode !== eui_1.keyCodes.ENTER) {
                return;
            }
            this.setState({ selectedLabel: this.state.selectedLabel === label ? null : label });
        };
        this.getSeriesLabels = (data) => {
            const values = data.map(chart => chart.series).reduce((a, b) => a.concat(b), []);
            return lodash_1.compact(lodash_1.uniq(values, 'label')).map((label) => ({
                ...label,
                values: [label.values[0].seriesRaw],
            }));
        };
        this.setFilterableLabels = (items) => new Promise(async (resolve) => {
            const filterableLabels = new Set();
            items.forEach(async (item) => {
                const canFilter = await this.canFilter(item);
                if (canFilter) {
                    filterableLabels.add(item.label);
                }
            });
            this.setState({ filterableLabels }, resolve);
        });
        this.setLabels = (data, type) => {
            let labels = [];
            if (models_1.CUSTOM_LEGEND_VIS_TYPES.includes(type)) {
                const legendLabels = this.props.vislibVis.getLegendLabels();
                if (legendLabels) {
                    labels = lodash_1.map(legendLabels, label => {
                        return { label };
                    });
                }
            }
            else {
                if (!data)
                    return [];
                data = data.columns || data.rows || [data];
                labels = type === 'pie' ? pie_utils_1.getPieNames(data) : this.getSeriesLabels(data);
            }
            this.setFilterableLabels(labels);
            this.setState({
                labels,
            });
        };
        this.refresh = () => {
            const vislibVis = this.props.vislibVis;
            if (!vislibVis || !vislibVis.visConfig) {
                this.setState({
                    labels: [
                        {
                            label: i18n_1.i18n.translate('visTypeVislib.vislib.legend.loadingLabel', {
                                defaultMessage: 'loading…',
                            }),
                        },
                    ],
                });
                return;
            } // make sure vislib is defined at this point
            if (this.props.uiState.get('vis.legendOpen') == null &&
                this.props.vis.params.addLegend != null) {
                this.setState({ open: this.props.vis.params.addLegend });
            }
            if (vislibVis.visConfig) {
                this.getColor = this.props.vislibVis.visConfig.data.getColorFunc();
            }
            this.setLabels(this.props.visData, vislibVis.visConfigArgs.type);
        };
        this.highlight = (event) => {
            const el = event.currentTarget;
            const handler = this.props.vislibVis && this.props.vislibVis.handler;
            // there is no guarantee that a Chart will set the highlight-function on its handler
            if (!handler || typeof handler.highlight !== 'function') {
                return;
            }
            handler.highlight.call(el, handler.el);
        };
        this.unhighlight = (event) => {
            const el = event.currentTarget;
            const handler = this.props.vislibVis && this.props.vislibVis.handler;
            // there is no guarantee that a Chart will set the unhighlight-function on its handler
            if (!handler || typeof handler.unHighlight !== 'function') {
                return;
            }
            handler.unHighlight.call(el, handler.el);
        };
        this.getAnchorPosition = () => {
            const { position } = this.props;
            switch (position) {
                case 'bottom':
                    return 'upCenter';
                case 'left':
                    return 'rightUp';
                case 'right':
                    return 'leftUp';
                default:
                    return 'downCenter';
            }
        };
        this.renderLegend = (anchorPosition) => (react_1.default.createElement("ul", { className: "visLegend__list", id: this.legendId }, this.state.labels.map(item => (react_1.default.createElement(legend_item_1.VisLegendItem, { item: item, key: item.label, anchorPosition: anchorPosition, selected: this.state.selectedLabel === item.label, canFilter: this.state.filterableLabels.has(item.label), onFilter: this.filter, onSelect: this.toggleDetails, legendId: this.legendId, setColor: this.setColor, getColor: this.getColor, onHighlight: this.highlight, onUnhighlight: this.unhighlight })))));
        const open = props.uiState.get('vis.legendOpen', true);
        this.state = {
            open,
            labels: [],
            filterableLabels: new Set(),
            selectedLabel: null,
        };
    }
    componentDidMount() {
        this.refresh();
    }
    render() {
        const { open } = this.state;
        const anchorPosition = this.getAnchorPosition();
        return (react_1.default.createElement("div", { className: "visLegend" },
            react_1.default.createElement("button", { type: "button", onClick: this.toggleLegend, className: classnames_1.default('visLegend__toggle kbn-resetFocusState', {
                    'visLegend__toggle--isOpen': open,
                }), "aria-label": i18n_1.i18n.translate('visTypeVislib.vislib.legend.toggleLegendButtonAriaLabel', {
                    defaultMessage: 'Toggle legend',
                }), "aria-expanded": Boolean(open), "aria-controls": this.legendId, "data-test-subj": "vislibToggleLegend", title: i18n_1.i18n.translate('visTypeVislib.vislib.legend.toggleLegendButtonTitle', {
                    defaultMessage: 'Toggle legend',
                }) },
                react_1.default.createElement(eui_1.EuiIcon, { color: "text", type: "list" })),
            open && this.renderLegend(anchorPosition)));
    }
}
exports.VisLegend = VisLegend;
