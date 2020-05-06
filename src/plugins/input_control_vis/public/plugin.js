"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const input_control_fn_1 = require("./input_control_fn");
const input_control_vis_type_1 = require("./input_control_vis_type");
/** @internal */
class InputControlVisPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { expressions, visualizations, data }) {
        const visualizationDependencies = {
            core,
            data,
        };
        expressions.registerFunction(input_control_fn_1.createInputControlVisFn);
        visualizations.createBaseVisualization(input_control_vis_type_1.createInputControlVisTypeDefinition(visualizationDependencies));
    }
    start(core, deps) {
        // nothing to do here
    }
}
exports.InputControlVisPlugin = InputControlVisPlugin;
