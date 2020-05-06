"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const service_1 = require("./service");
class IndexPatternManagementPlugin {
    constructor(initializerContext) {
        this.indexPattern = new service_1.IndexPatternManagementService();
    }
    setup(core) {
        return this.indexPattern.setup({ httpClient: core.http });
    }
    start(core, plugins) {
        return this.indexPattern.start();
    }
    stop() {
        this.indexPattern.stop();
    }
}
exports.IndexPatternManagementPlugin = IndexPatternManagementPlugin;
