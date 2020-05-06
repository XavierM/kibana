"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/camelcase */
exports.aliases = (specService) => {
    const aliasRules = {
        filter: {},
        routing: '1',
        search_routing: '1,2',
        index_routing: '1',
    };
    specService.addGlobalAutocompleteRules('aliases', {
        '*': aliasRules,
    });
};
