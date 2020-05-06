"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isDefaultValue(setting) {
    return (setting.isCustom ||
        setting.value === undefined ||
        setting.value === '' ||
        String(setting.value) === String(setting.defVal));
}
exports.isDefaultValue = isDefaultValue;
