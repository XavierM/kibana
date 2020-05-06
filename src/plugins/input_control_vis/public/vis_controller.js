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
const react_dom_1 = require("react-dom");
const input_control_vis_1 = require("./components/vis/input_control_vis");
const control_factory_1 = require("./control/control_factory");
const lineage_1 = require("./lineage");
exports.createInputControlVisController = (deps) => {
    return class InputControlVisController {
        constructor(el, vis) {
            this.el = el;
            this.vis = vis;
            this.drawVis = () => {
                if (!this.I18nContext) {
                    throw new Error('no i18n context found');
                }
                react_dom_1.render(react_1.default.createElement(this.I18nContext, null,
                    react_1.default.createElement(input_control_vis_1.InputControlVis, { updateFiltersOnChange: this.visParams?.updateFiltersOnChange, controls: this.controls, stageFilter: this.stageFilter, submitFilters: this.submitFilters, resetControls: this.updateControlsFromKbn, clearControls: this.clearControls, hasChanges: this.hasChanges, hasValues: this.hasValues, refreshControl: this.refreshControl })), this.el);
            };
            this.stageFilter = async (controlIndex, newValue) => {
                this.controls[controlIndex].set(newValue);
                if (this.visParams?.updateFiltersOnChange) {
                    // submit filters on each control change
                    this.submitFilters();
                }
                else {
                    // Do not submit filters, just update vis so controls are updated with latest value
                    await this.updateNestedControls();
                    this.drawVis();
                }
            };
            this.submitFilters = () => {
                const stagedControls = this.controls.filter(control => {
                    return control.hasChanged();
                });
                const newFilters = stagedControls
                    .map(control => control.getKbnFilter())
                    .filter((filter) => {
                    return filter !== null;
                });
                stagedControls.forEach(control => {
                    // to avoid duplicate filters, remove any old filters for control
                    control.filterManager.findFilters().forEach(existingFilter => {
                        this.filterManager.removeFilter(existingFilter);
                    });
                });
                // Clean up filter pills for nested controls that are now disabled because ancestors are not set.
                // This has to be done after looking up the staged controls because otherwise removing a filter
                // will re-sync the controls of all other filters.
                this.controls.map(control => {
                    if (control.hasAncestors() && control.hasUnsetAncestor()) {
                        control.filterManager.findFilters().forEach(existingFilter => {
                            this.filterManager.removeFilter(existingFilter);
                        });
                    }
                });
                this.filterManager.addFilters(newFilters, this.visParams?.pinFilters);
            };
            this.clearControls = async () => {
                this.controls.forEach(control => {
                    control.clear();
                });
                await this.updateNestedControls();
                this.drawVis();
            };
            this.updateControlsFromKbn = async () => {
                this.controls.forEach(control => {
                    control.reset();
                });
                await this.updateNestedControls();
                this.drawVis();
            };
            this.hasChanges = () => {
                return this.controls.map(control => control.hasChanged()).some(control => control);
            };
            this.hasValues = () => {
                return this.controls
                    .map(control => {
                    return control.hasValue();
                })
                    .reduce((a, b) => {
                    return a || b;
                });
            };
            this.refreshControl = async (controlIndex, query) => {
                await this.controls[controlIndex].fetch(query);
                this.drawVis();
            };
            this.controls = [];
            this.queryBarUpdateHandler = this.updateControlsFromKbn.bind(this);
            this.filterManager = deps.data.query.filterManager;
            this.updateSubsciption = this.filterManager
                .getUpdates$()
                .subscribe(this.queryBarUpdateHandler);
        }
        async render(visData, visParams) {
            this.visParams = visParams;
            this.controls = [];
            this.controls = await this.initControls();
            const [{ i18n }] = await deps.core.getStartServices();
            this.I18nContext = i18n.Context;
            this.drawVis();
        }
        destroy() {
            this.updateSubsciption.unsubscribe();
            react_dom_1.unmountComponentAtNode(this.el);
            this.controls.forEach(control => control.destroy());
        }
        async initControls() {
            const controlParamsList = this.visParams?.controls?.filter(controlParams => {
                // ignore controls that do not have indexPattern or field
                return controlParams.indexPattern && controlParams.fieldName;
            });
            const controlFactoryPromises = controlParamsList.map(controlParams => {
                const factory = control_factory_1.getControlFactory(controlParams);
                return factory(controlParams, this.visParams?.useTimeFilter, deps);
            });
            const controls = await Promise.all(controlFactoryPromises);
            const getControl = (controlId) => {
                return controls.find(({ id }) => id === controlId);
            };
            const controlInitPromises = [];
            lineage_1.getLineageMap(controlParamsList).forEach((lineage, controlId) => {
                // first lineage item is the control. remove it
                lineage.shift();
                const ancestors = [];
                lineage.forEach(ancestorId => {
                    const control = getControl(ancestorId);
                    if (control) {
                        ancestors.push(control);
                    }
                });
                const control = getControl(controlId);
                if (control) {
                    control.setAncestors(ancestors);
                    controlInitPromises.push(control.fetch());
                }
            });
            await Promise.all(controlInitPromises);
            return controls;
        }
        async updateNestedControls() {
            const fetchPromises = this.controls.map(async (control) => {
                if (control.hasAncestors()) {
                    await control.fetch();
                }
            });
            return await Promise.all(fetchPromises);
        }
    };
};
