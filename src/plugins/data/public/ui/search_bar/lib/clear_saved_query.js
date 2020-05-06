"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearStateFromSavedQuery = (queryService, setQueryStringState, defaultLanguage) => {
    queryService.filterManager.removeAll();
    setQueryStringState({
        query: '',
        language: defaultLanguage,
    });
};
