"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request_1 = require("./request");
const http_server_mocks_1 = require("../http_server.mocks");
const config_schema_1 = require("@kbn/config-schema");
describe('KibanaRequest', () => {
    describe('get all headers', () => {
        it('returns all headers', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one', authorization: 'token' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.headers).toEqual({ custom: 'one', authorization: 'token' });
        });
    });
    describe('headers property', () => {
        it('provides a frozen copy of request headers', () => {
            const rawRequestHeaders = { custom: 'one' };
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: rawRequestHeaders,
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.headers).toEqual({ custom: 'one' });
            expect(kibanaRequest.headers).not.toBe(rawRequestHeaders);
            expect(Object.isFrozen(kibanaRequest.headers)).toBe(true);
        });
        it.skip("doesn't expose authorization header by default", () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one', authorization: 'token' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.headers).toEqual({
                custom: 'one',
            });
        });
        it('exposes authorization header if secured = false', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one', authorization: 'token' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request, undefined, false);
            expect(kibanaRequest.headers).toEqual({
                custom: 'one',
                authorization: 'token',
            });
        });
    });
    describe('isSytemApi property', () => {
        it('is false when no kbn-system-request header is set', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.isSystemRequest).toBe(false);
        });
        it('is true when kbn-system-request header is set to true', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one', 'kbn-system-request': 'true' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.isSystemRequest).toBe(true);
        });
        it('is false when kbn-system-request header is set to false', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one', 'kbn-system-request': 'false' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.isSystemRequest).toBe(false);
        });
        // Remove support for kbn-system-api header in 8.x. Only used by legacy platform.
        it('is false when no kbn-system-api header is set', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.isSystemRequest).toBe(false);
        });
        it('is true when kbn-system-api header is set to true', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one', 'kbn-system-api': 'true' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.isSystemRequest).toBe(true);
        });
        it('is false when kbn-system-api header is set to false', () => {
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                headers: { custom: 'one', 'kbn-system-api': 'false' },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.isSystemRequest).toBe(false);
        });
    });
    describe('route.options.authRequired property', () => {
        it('handles required auth: undefined', () => {
            const auth = undefined;
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                route: {
                    settings: {
                        auth,
                    },
                },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.route.options.authRequired).toBe(true);
        });
        it('handles required auth: false', () => {
            const auth = false;
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                route: {
                    settings: {
                        auth,
                    },
                },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.route.options.authRequired).toBe(false);
        });
        it('handles required auth: { mode: "required" }', () => {
            const auth = { mode: 'required' };
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                route: {
                    settings: {
                        auth,
                    },
                },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.route.options.authRequired).toBe(true);
        });
        it('handles required auth: { mode: "optional" }', () => {
            const auth = { mode: 'optional' };
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                route: {
                    settings: {
                        auth,
                    },
                },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.route.options.authRequired).toBe('optional');
        });
        it('handles required auth: { mode: "try" } as "optional"', () => {
            const auth = { mode: 'try' };
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                route: {
                    settings: {
                        auth,
                    },
                },
            });
            const kibanaRequest = request_1.KibanaRequest.from(request);
            expect(kibanaRequest.route.options.authRequired).toBe('optional');
        });
        it('throws on auth: strategy name', () => {
            const auth = 'session';
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                route: {
                    settings: {
                        auth,
                    },
                },
            });
            expect(() => request_1.KibanaRequest.from(request)).toThrowErrorMatchingInlineSnapshot(`"unexpected authentication options: \\"session\\" for route: /"`);
        });
        it('throws on auth: { mode: unexpected mode }', () => {
            const auth = { mode: undefined };
            const request = http_server_mocks_1.httpServerMock.createRawRequest({
                route: {
                    settings: {
                        auth,
                    },
                },
            });
            expect(() => request_1.KibanaRequest.from(request)).toThrowErrorMatchingInlineSnapshot(`"unexpected authentication options: {} for route: /"`);
        });
    });
    describe('RouteSchema type inferring', () => {
        it('should work with config-schema', () => {
            const body = Buffer.from('body!');
            const request = {
                ...http_server_mocks_1.httpServerMock.createRawRequest({
                    params: { id: 'params' },
                    query: { search: 'query' },
                }),
                payload: body,
            };
            const kibanaRequest = request_1.KibanaRequest.from(request, {
                params: config_schema_1.schema.object({ id: config_schema_1.schema.string() }),
                query: config_schema_1.schema.object({ search: config_schema_1.schema.string() }),
                body: config_schema_1.schema.buffer(),
            });
            expect(kibanaRequest.params).toStrictEqual({ id: 'params' });
            expect(kibanaRequest.params.id.toUpperCase()).toEqual('PARAMS'); // infers it's a string
            expect(kibanaRequest.query).toStrictEqual({ search: 'query' });
            expect(kibanaRequest.query.search.toUpperCase()).toEqual('QUERY'); // infers it's a string
            expect(kibanaRequest.body).toEqual(body);
            expect(kibanaRequest.body.byteLength).toBeGreaterThan(0); // infers it's a buffer
        });
        it('should work with ValidationFunction', () => {
            const body = Buffer.from('body!');
            const request = {
                ...http_server_mocks_1.httpServerMock.createRawRequest({
                    params: { id: 'params' },
                    query: { search: 'query' },
                }),
                payload: body,
            };
            const kibanaRequest = request_1.KibanaRequest.from(request, {
                params: config_schema_1.schema.object({ id: config_schema_1.schema.string() }),
                query: config_schema_1.schema.object({ search: config_schema_1.schema.string() }),
                body: (data, { ok, badRequest }) => {
                    if (Buffer.isBuffer(data)) {
                        return ok(data);
                    }
                    else {
                        return badRequest('It should be a Buffer', []);
                    }
                },
            });
            expect(kibanaRequest.params).toStrictEqual({ id: 'params' });
            expect(kibanaRequest.params.id.toUpperCase()).toEqual('PARAMS'); // infers it's a string
            expect(kibanaRequest.query).toStrictEqual({ search: 'query' });
            expect(kibanaRequest.query.search.toUpperCase()).toEqual('QUERY'); // infers it's a string
            expect(kibanaRequest.body).toEqual(body);
            expect(kibanaRequest.body.byteLength).toBeGreaterThan(0); // infers it's a buffer
        });
    });
});
