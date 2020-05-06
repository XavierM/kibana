"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaConversion = {
    pattern: /%meta/g,
    convert(record) {
        return record.meta ? `${JSON.stringify(record.meta)}` : '';
    },
};
