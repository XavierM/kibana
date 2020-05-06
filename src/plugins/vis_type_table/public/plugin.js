"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const table_vis_fn_1 = require("./table_vis_fn");
const table_vis_type_1 = require("./table_vis_type");
const services_1 = require("./services");
/** @internal */
class TableVisPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { expressions, visualizations }) {
        expressions.registerFunction(table_vis_fn_1.createTableVisFn);
        visualizations.createBaseVisualization(table_vis_type_1.getTableVisTypeDefinition(core, this.initializerContext));
    }
    start(core, { data }) {
        services_1.setFormatService(data.fieldFormats);
    }
}
exports.TableVisPlugin = TableVisPlugin;
