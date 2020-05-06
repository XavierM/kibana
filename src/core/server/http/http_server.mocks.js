"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = require("lodash");
const net_1 = require("net");
const query_string_1 = require("query-string");
const config_schema_1 = require("@kbn/config-schema");
const router_1 = require("./router");
function createKibanaRequestMock({ path = '/path', headers = { accept: 'something/html' }, params = {}, body = {}, query = {}, method = 'get', socket = new net_1.Socket(), routeTags, routeAuthRequired, validation = {}, kibanaRouteState = { xsrfRequired: true }, auth = { isAuthenticated: true }, } = {}) {
    const queryString = query_string_1.stringify(query, { sort: false });
    return router_1.KibanaRequest.from(createRawRequestMock({
        auth,
        headers,
        params,
        query,
        payload: body,
        path,
        method,
        url: {
            path,
            pathname: path,
            query: queryString,
            search: queryString ? `?${queryString}` : queryString,
        },
        route: {
            settings: { tags: routeTags, auth: routeAuthRequired, app: kibanaRouteState },
        },
        raw: {
            req: { socket },
        },
    }), {
        params: validation.params || config_schema_1.schema.any(),
        body: validation.body || config_schema_1.schema.any(),
        query: validation.query || config_schema_1.schema.any(),
    });
}
function createRawRequestMock(customization = {}) {
    return lodash_1.merge({}, {
        app: { xsrfRequired: true },
        auth: {
            isAuthenticated: true,
        },
        headers: {},
        path: '/',
        route: { settings: {} },
        url: {
            href: '/',
        },
        raw: {
            req: {
                url: '/',
            },
        },
    }, customization);
}
const createResponseFactoryMock = () => ({
    ok: jest.fn(),
    accepted: jest.fn(),
    noContent: jest.fn(),
    custom: jest.fn(),
    redirected: jest.fn(),
    badRequest: jest.fn(),
    unauthorized: jest.fn(),
    forbidden: jest.fn(),
    notFound: jest.fn(),
    conflict: jest.fn(),
    internalError: jest.fn(),
    customError: jest.fn(),
});
const createLifecycleResponseFactoryMock = () => ({
    redirected: jest.fn(),
    badRequest: jest.fn(),
    unauthorized: jest.fn(),
    forbidden: jest.fn(),
    notFound: jest.fn(),
    conflict: jest.fn(),
    internalError: jest.fn(),
    customError: jest.fn(),
});
const createToolkitMock = () => {
    return {
        next: jest.fn(),
        rewriteUrl: jest.fn(),
    };
};
exports.httpServerMock = {
    createKibanaRequest: createKibanaRequestMock,
    createRawRequest: createRawRequestMock,
    createResponseFactory: createResponseFactoryMock,
    createLifecycleResponseFactory: createLifecycleResponseFactoryMock,
    createToolkit: createToolkitMock,
};
