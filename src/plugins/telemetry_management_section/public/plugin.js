"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const telemetry_management_section_wrapper_1 = require("./components/telemetry_management_section_wrapper");
class TelemetryManagementSectionPlugin {
    setup(core, { advancedSettings, telemetry: { telemetryService } }) {
        advancedSettings.component.register(advancedSettings.component.componentType.PAGE_FOOTER_COMPONENT, telemetry_management_section_wrapper_1.telemetryManagementSectionWrapper(telemetryService), true);
    }
    start(core) { }
}
exports.TelemetryManagementSectionPlugin = TelemetryManagementSectionPlugin;
