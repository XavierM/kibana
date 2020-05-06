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
require("react-grid-layout/css/styles.css");
require("react-resizable/css/styles.css");
// @ts-ignore
const react_sizeme_1 = tslib_1.__importDefault(require("react-sizeme"));
const react_1 = require("@kbn/i18n/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const react_2 = tslib_1.__importDefault(require("react"));
const react_grid_layout_1 = tslib_1.__importDefault(require("react-grid-layout"));
const embeddable_plugin_1 = require("../../../embeddable_plugin");
const dashboard_constants_1 = require("../dashboard_constants");
const public_1 = require("../../../../../kibana_react/public");
let lastValidGridSize = 0;
/**
 * This is a fix for a bug that stopped the browser window from automatically scrolling down when panels were made
 * taller than the current grid.
 * see https://github.com/elastic/kibana/issues/14710.
 */
function ensureWindowScrollsToBottom(event) {
    // The buffer is to handle the case where the browser is maximized and it's impossible for the mouse to move below
    // the screen, out of the window.  see https://github.com/elastic/kibana/issues/14737
    const WINDOW_BUFFER = 10;
    if (event.clientY > window.innerHeight - WINDOW_BUFFER) {
        window.scrollTo(0, event.pageY + WINDOW_BUFFER - window.innerHeight);
    }
}
function ResponsiveGrid({ size, isViewMode, layout, onLayoutChange, children, maximizedPanelId, useMargins, }) {
    // This is to prevent a bug where view mode changes when the panel is expanded.  View mode changes will trigger
    // the grid to re-render, but when a panel is expanded, the size will be 0. Minimizing the panel won't cause the
    // grid to re-render so it'll show a grid with a width of 0.
    lastValidGridSize = size.width > 0 ? size.width : lastValidGridSize;
    const classes = classnames_1.default({
        'dshLayout--viewing': isViewMode,
        'dshLayout--editing': !isViewMode,
        'dshLayout-isMaximizedPanel': maximizedPanelId !== undefined,
        'dshLayout-withoutMargins': !useMargins,
    });
    const MARGINS = useMargins ? 8 : 0;
    // We can't take advantage of isDraggable or isResizable due to performance concerns:
    // https://github.com/STRML/react-grid-layout/issues/240
    return (react_2.default.createElement(react_grid_layout_1.default, { width: lastValidGridSize, className: classes, isDraggable: true, isResizable: true, 
        // There is a bug with d3 + firefox + elements using transforms.
        // See https://github.com/elastic/kibana/issues/16870 for more context.
        useCSSTransforms: false, margin: [MARGINS, MARGINS], cols: dashboard_constants_1.DASHBOARD_GRID_COLUMN_COUNT, rowHeight: dashboard_constants_1.DASHBOARD_GRID_HEIGHT, 
        // Pass the named classes of what should get the dragging handle
        // (.doesnt-exist literally doesnt exist)
        draggableHandle: isViewMode ? '.doesnt-exist' : '.embPanel__dragger', layout: layout, onLayoutChange: onLayoutChange, onResize: ({}, {}, {}, {}, event) => ensureWindowScrollsToBottom(event) }, children));
}
// Using sizeMe sets up the grid to be re-rendered automatically not only when the window size changes, but also
// when the container size changes, so it works for Full Screen mode switches.
const config = { monitorWidth: true };
const ResponsiveSizedGrid = react_sizeme_1.default(config)(ResponsiveGrid);
class DashboardGridUi extends react_2.default.Component {
    constructor(props) {
        super(props);
        this.mounted = false;
        // A mapping of panelIndexes to grid items so we can set the zIndex appropriately on the last focused
        // item.
        this.gridItems = {};
        this.buildLayoutFromPanels = () => {
            return lodash_1.default.map(this.state.panels, panel => {
                return panel.gridData;
            });
        };
        this.onLayoutChange = (layout) => {
            const panels = this.state.panels;
            const updatedPanels = layout.reduce((updatedPanelsAcc, panelLayout) => {
                updatedPanelsAcc[panelLayout.i] = {
                    ...panels[panelLayout.i],
                    gridData: lodash_1.default.pick(panelLayout, ['x', 'y', 'w', 'h', 'i']),
                };
                return updatedPanelsAcc;
            }, {});
            this.onPanelsUpdated(updatedPanels);
        };
        this.onPanelsUpdated = (panels) => {
            this.props.container.updateInput({
                panels,
            });
        };
        this.onPanelFocused = (focusedPanelIndex) => {
            this.setState({ focusedPanelIndex });
        };
        this.onPanelBlurred = (blurredPanelIndex) => {
            if (this.state.focusedPanelIndex === blurredPanelIndex) {
                this.setState({ focusedPanelIndex: undefined });
            }
        };
        this.state = {
            layout: [],
            isLayoutInvalid: false,
            focusedPanelIndex: undefined,
            panels: this.props.container.getInput().panels,
            viewMode: this.props.container.getInput().viewMode,
            useMargins: this.props.container.getInput().useMargins,
            expandedPanelId: this.props.container.getInput().expandedPanelId,
        };
    }
    componentDidMount() {
        this.mounted = true;
        let isLayoutInvalid = false;
        let layout;
        try {
            layout = this.buildLayoutFromPanels();
        }
        catch (error) {
            console.error(error); // eslint-disable-line no-console
            isLayoutInvalid = true;
            this.props.kibana.notifications.toasts.danger({
                title: this.props.intl.formatMessage({
                    id: 'dashboard.dashboardGrid.toast.unableToLoadDashboardDangerMessage',
                    defaultMessage: 'Unable to load dashboard.',
                }),
                body: error.message,
                toastLifeTimeMs: 5000,
            });
        }
        this.setState({
            layout,
            isLayoutInvalid,
        });
        this.subscription = this.props.container
            .getInput$()
            .subscribe((input) => {
            if (this.mounted) {
                this.setState({
                    panels: input.panels,
                    viewMode: input.viewMode,
                    useMargins: input.useMargins,
                    expandedPanelId: input.expandedPanelId,
                });
            }
        });
    }
    componentWillUnmount() {
        this.mounted = false;
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
    renderPanels() {
        const { focusedPanelIndex, panels, expandedPanelId } = this.state;
        // Part of our unofficial API - need to render in a consistent order for plugins.
        const panelsInOrder = Object.keys(panels).map((key) => panels[key]);
        panelsInOrder.sort((panelA, panelB) => {
            if (panelA.gridData.y === panelB.gridData.y) {
                return panelA.gridData.x - panelB.gridData.x;
            }
            else {
                return panelA.gridData.y - panelB.gridData.y;
            }
        });
        return lodash_1.default.map(panelsInOrder, panel => {
            const expandPanel = expandedPanelId !== undefined && expandedPanelId === panel.explicitInput.id;
            const hidePanel = expandedPanelId !== undefined && expandedPanelId !== panel.explicitInput.id;
            const classes = classnames_1.default({
                'dshDashboardGrid__item--expanded': expandPanel,
                'dshDashboardGrid__item--hidden': hidePanel,
            });
            return (react_2.default.createElement("div", { style: { zIndex: focusedPanelIndex === panel.explicitInput.id ? 2 : 'auto' }, className: classes, key: panel.explicitInput.id, "data-test-subj": "dashboardPanel", ref: reactGridItem => {
                    this.gridItems[panel.explicitInput.id] = reactGridItem;
                } },
                react_2.default.createElement(embeddable_plugin_1.EmbeddableChildPanel, { embeddableId: panel.explicitInput.id, container: this.props.container, getActions: this.props.kibana.services.uiActions.getTriggerCompatibleActions, getEmbeddableFactory: this.props.kibana.services.embeddable.getEmbeddableFactory, getAllEmbeddableFactories: this.props.kibana.services.embeddable.getEmbeddableFactories, overlays: this.props.kibana.services.overlays, application: this.props.kibana.services.application, notifications: this.props.kibana.services.notifications, inspector: this.props.kibana.services.inspector, SavedObjectFinder: this.props.kibana.services.SavedObjectFinder })));
        });
    }
    render() {
        if (this.state.isLayoutInvalid) {
            return null;
        }
        const { viewMode } = this.state;
        const isViewMode = viewMode === embeddable_plugin_1.ViewMode.VIEW;
        return (react_2.default.createElement(ResponsiveSizedGrid, { isViewMode: isViewMode, layout: this.buildLayoutFromPanels(), onLayoutChange: this.onLayoutChange, maximizedPanelId: this.state.expandedPanelId, useMargins: this.state.useMargins }, this.renderPanels()));
    }
}
exports.DashboardGrid = react_1.injectI18n(public_1.withKibana(DashboardGridUi));
