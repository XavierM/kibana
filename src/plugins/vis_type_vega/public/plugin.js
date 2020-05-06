"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const vega_fn_1 = require("./vega_fn");
const vega_type_1 = require("./vega_type");
const public_1 = require("../../maps_legacy/public");
require("./index.scss");
/** @internal */
class VegaPlugin {
    constructor(initializerContext) {
        this.initializerContext = initializerContext;
    }
    async setup(core, { data, expressions, visualizations, mapsLegacy }) {
        services_1.setInjectedVars({
            enableExternalUrls: this.initializerContext.config.get().enableExternalUrls,
            esShardTimeout: core.injectedMetadata.getInjectedVar('esShardTimeout'),
            emsTileLayerId: core.injectedMetadata.getInjectedVar('emsTileLayerId', true),
        });
        services_1.setUISettings(core.uiSettings);
        services_1.setKibanaMapFactory(public_1.getKibanaMapFactoryProvider(core));
        const visualizationDependencies = {
            core,
            plugins: {
                data,
            },
            serviceSettings: mapsLegacy.serviceSettings,
        };
        expressions.registerFunction(() => vega_fn_1.createVegaFn(visualizationDependencies));
        visualizations.createBaseVisualization(vega_type_1.createVegaTypeDefinition(visualizationDependencies));
    }
    start(core, { data }) {
        services_1.setNotifications(core.notifications);
        services_1.setSavedObjects(core.savedObjects);
        services_1.setData(data);
    }
}
exports.VegaPlugin = VegaPlugin;
