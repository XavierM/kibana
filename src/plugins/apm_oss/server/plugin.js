"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class APMOSSPlugin {
    constructor(initContext) {
        this.initContext = initContext;
        this.initContext = initContext;
    }
    setup(core) {
        const config$ = this.initContext.config.create();
        return {
            config$,
        };
    }
    start() { }
    stop() { }
}
exports.APMOSSPlugin = APMOSSPlugin;
