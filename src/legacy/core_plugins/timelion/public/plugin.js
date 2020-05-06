"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const timechart_1 = require("./panels/timechart/timechart");
/** @internal */
class TimelionPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { __LEGACY }) {
        const timelionPanels = new Map();
        const dependencies = {
            uiSettings: core.uiSettings,
            timelionPanels,
            ...(await __LEGACY.setup(core, timelionPanels)),
        };
        this.registerPanels(dependencies);
    }
    registerPanels(dependencies) {
        const timeChartPanel = timechart_1.getTimeChart(dependencies);
        dependencies.timelionPanels.set(timeChartPanel.name, timeChartPanel);
    }
    start() { }
    stop() { }
}
exports.TimelionPlugin = TimelionPlugin;
