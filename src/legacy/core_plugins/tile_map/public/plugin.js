"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// TODO: Determine why visualizations don't populate without this
require("angular-sanitize");
// @ts-ignore
const tile_map_fn_1 = require("./tile_map_fn");
// @ts-ignore
const tile_map_type_1 = require("./tile_map_type");
const public_1 = require("../../../../plugins/maps_legacy/public");
/** @internal */
class TileMapPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { expressions, visualizations, mapsLegacy }) {
        const { getZoomPrecision, getPrecision } = mapsLegacy;
        const visualizationDependencies = {
            getZoomPrecision,
            getPrecision,
            BaseMapsVisualization: public_1.getBaseMapsVis(core, mapsLegacy.serviceSettings),
            uiSettings: core.uiSettings,
        };
        expressions.registerFunction(() => tile_map_fn_1.createTileMapFn(visualizationDependencies));
        visualizations.createBaseVisualization(tile_map_type_1.createTileMapTypeDefinition(visualizationDependencies));
    }
    start(core) {
        // nothing to do here yet
    }
}
exports.TileMapPlugin = TileMapPlugin;
