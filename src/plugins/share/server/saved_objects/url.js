"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.url = {
    name: 'url',
    namespaceType: 'single',
    hidden: false,
    management: {
        icon: 'link',
        defaultSearchField: 'url',
        importableAndExportable: true,
        getTitle(obj) {
            return `/goto/${encodeURIComponent(obj.id)}`;
        },
    },
    mappings: {
        properties: {
            accessCount: {
                type: 'long',
            },
            accessDate: {
                type: 'date',
            },
            createDate: {
                type: 'date',
            },
            url: {
                type: 'text',
                fields: {
                    keyword: {
                        type: 'keyword',
                    },
                },
            },
        },
    },
};
