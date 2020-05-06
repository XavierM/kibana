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
const jquery_1 = tslib_1.__importDefault(require("jquery"));
const react_1 = tslib_1.__importDefault(require("react"));
// @ts-ignore
const vis_1 = require("./vislib/vis");
const utils_1 = require("../../../core/public/utils");
const legend_1 = require("./vislib/components/legend");
const legendClassName = {
    top: 'visLib--legend-top',
    bottom: 'visLib--legend-bottom',
    left: 'visLib--legend-left',
    right: 'visLib--legend-right',
};
exports.createVislibVisController = (deps) => {
    return class VislibVisController {
        constructor(el, vis) {
            this.el = el;
            this.vis = vis;
            this.unmount = null;
            this.el = el;
            this.vis = vis;
            this.unmount = null;
            this.legendRef = react_1.default.createRef();
            // vis mount point
            this.container = document.createElement('div');
            this.container.className = 'visLib';
            this.el.appendChild(this.container);
            // chart mount point
            this.chartEl = document.createElement('div');
            this.chartEl.className = 'visLib__chart';
            this.container.appendChild(this.chartEl);
            // legend mount point
            this.legendEl = document.createElement('div');
            this.legendEl.className = 'visLib__legend';
            this.container.appendChild(this.legendEl);
        }
        render(esResponse, visParams) {
            if (this.vislibVis) {
                this.destroy();
            }
            return new Promise(async (resolve) => {
                if (this.el.clientWidth === 0 || this.el.clientHeight === 0) {
                    return resolve();
                }
                this.vislibVis = new vis_1.Vis(this.chartEl, visParams, deps);
                this.vislibVis.on('brush', this.vis.API.events.brush);
                this.vislibVis.on('click', this.vis.API.events.filter);
                this.vislibVis.on('renderComplete', resolve);
                this.vislibVis.initVisConfig(esResponse, this.vis.getUiState());
                if (visParams.addLegend) {
                    jquery_1.default(this.container)
                        .attr('class', (i, cls) => {
                        return cls.replace(/visLib--legend-\S+/g, '');
                    })
                        .addClass(legendClassName[visParams.legendPosition]);
                    this.mountLegend(esResponse, visParams.legendPosition);
                }
                this.vislibVis.render(esResponse, this.vis.getUiState());
                // refreshing the legend after the chart is rendered.
                // this is necessary because some visualizations
                // provide data necessary for the legend only after a render cycle.
                if (visParams.addLegend &&
                    legend_1.CUSTOM_LEGEND_VIS_TYPES.includes(this.vislibVis.visConfigArgs.type)) {
                    this.unmountLegend();
                    this.mountLegend(esResponse, visParams.legendPosition);
                    this.vislibVis.render(esResponse, this.vis.getUiState());
                }
            });
        }
        mountLegend(visData, position) {
            this.unmount = utils_1.mountReactNode(react_1.default.createElement(legend_1.VisLegend, { ref: this.legendRef, vis: this.vis, vislibVis: this.vislibVis, visData: visData, position: position, uiState: this.vis.getUiState() }))(this.legendEl);
        }
        unmountLegend() {
            if (this.unmount) {
                this.unmount();
            }
        }
        destroy() {
            if (this.unmount) {
                this.unmount();
            }
            if (this.vislibVis) {
                this.vislibVis.off('brush', this.vis.API.events.brush);
                this.vislibVis.off('click', this.vis.API.events.filter);
                this.vislibVis.destroy();
                delete this.vislibVis;
            }
        }
    };
};
