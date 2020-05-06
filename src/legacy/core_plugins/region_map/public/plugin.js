"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
const region_map_fn_1 = require("./region_map_fn");
// @ts-ignore
const region_map_type_1 = require("./region_map_type");
const public_1 = require("../../../../plugins/maps_legacy/public");
/** @internal */
class RegionMapPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { expressions, visualizations, mapsLegacy }) {
        const visualizationDependencies = {
            uiSettings: core.uiSettings,
            regionmapsConfig: core.injectedMetadata.getInjectedVar('regionmap'),
            serviceSettings: mapsLegacy.serviceSettings,
            BaseMapsVisualization: public_1.getBaseMapsVis(core, mapsLegacy.serviceSettings),
        };
        expressions.registerFunction(region_map_fn_1.createRegionMapFn);
        visualizations.createBaseVisualization(region_map_type_1.createRegionMapTypeDefinition(visualizationDependencies));
    }
    start(core) {
        // nothing to do here yet
    }
}
exports.RegionMapPlugin = RegionMapPlugin;
