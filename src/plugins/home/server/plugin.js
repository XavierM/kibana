"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("./services");
const capabilities_provider_1 = require("./capabilities_provider");
const saved_objects_1 = require("./saved_objects");
class HomeServerPlugin {
    constructor(initContext) {
        this.initContext = initContext;
        this.tutorialsRegistry = new services_1.TutorialsRegistry();
        this.sampleDataRegistry = new services_1.SampleDataRegistry(this.initContext);
    }
    setup(core, plugins) {
        core.capabilities.registerProvider(capabilities_provider_1.capabilitiesProvider);
        core.savedObjects.registerType(saved_objects_1.sampleDataTelemetry);
        return {
            tutorials: { ...this.tutorialsRegistry.setup(core) },
            sampleData: { ...this.sampleDataRegistry.setup(core, plugins.usageCollection) },
        };
    }
    start() {
        return {
            tutorials: { ...this.tutorialsRegistry.start() },
            sampleData: { ...this.sampleDataRegistry.start() },
        };
    }
}
exports.HomeServerPlugin = HomeServerPlugin;
