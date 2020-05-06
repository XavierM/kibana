"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_1 = require("../../plugins/data/public");
const deserialize_1 = require("../../plugins/data/public/field_formats/utils/deserialize");
const public_2 = require("../../plugins/data/public");
exports.getFieldFormatsRegistry = (core) => {
    const fieldFormatsRegistry = new public_1.fieldFormats.FieldFormatsRegistry();
    const getConfig = core.uiSettings.get.bind(core.uiSettings);
    fieldFormatsRegistry.init(getConfig, {}, public_2.baseFormattersPublic);
    fieldFormatsRegistry.deserialize = deserialize_1.deserializeFieldFormat.bind(fieldFormatsRegistry);
    return fieldFormatsRegistry;
};
