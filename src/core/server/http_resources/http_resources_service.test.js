"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mocks_1 = require("../mocks");
const core_context_mock_1 = require("../core_context.mock");
const http_service_mock_1 = require("../http/http_service.mock");
const http_server_mocks_1 = require("../http/http_server.mocks");
const rendering_service_mock_1 = require("../rendering/rendering_service.mock");
const http_resources_service_1 = require("./http_resources_service");
const http_resources_service_mock_1 = require("./http_resources_service.mock");
const coreContext = core_context_mock_1.mockCoreContext.create();
describe('HttpResources service', () => {
    let service;
    let setupDeps;
    let router;
    const kibanaRequest = http_server_mocks_1.httpServerMock.createKibanaRequest();
    const context = { core: mocks_1.coreMock.createRequestHandlerContext() };
    describe('#createRegistrar', () => {
        beforeEach(() => {
            setupDeps = {
                http: http_service_mock_1.httpServiceMock.createSetupContract(),
                rendering: rendering_service_mock_1.renderingMock.createSetupContract(),
            };
            service = new http_resources_service_1.HttpResourcesService(coreContext);
            router = http_service_mock_1.httpServiceMock.createRouter();
        });
        describe('register', () => {
            describe('renderCoreApp', () => {
                it('formats successful response', async () => {
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderCoreApp();
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(setupDeps.rendering.render).toHaveBeenCalledWith(kibanaRequest, context.core.uiSettings.client, {
                        includeUserSettings: true,
                    });
                });
                it('can attach headers, except the CSP header', async () => {
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderCoreApp({
                            headers: {
                                'content-security-policy': "script-src 'unsafe-eval'",
                                'x-kibana': '42',
                            },
                        });
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(responseFactory.ok).toHaveBeenCalledWith({
                        body: '<body />',
                        headers: {
                            'x-kibana': '42',
                            'content-security-policy': "script-src 'unsafe-eval' 'self'; worker-src blob: 'self'; style-src 'unsafe-inline' 'self'",
                        },
                    });
                });
            });
            describe('renderAnonymousCoreApp', () => {
                it('formats successful response', async () => {
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderAnonymousCoreApp();
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(setupDeps.rendering.render).toHaveBeenCalledWith(kibanaRequest, context.core.uiSettings.client, {
                        includeUserSettings: false,
                    });
                });
                it('can attach headers, except the CSP header', async () => {
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderAnonymousCoreApp({
                            headers: {
                                'content-security-policy': "script-src 'unsafe-eval'",
                                'x-kibana': '42',
                            },
                        });
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(responseFactory.ok).toHaveBeenCalledWith({
                        body: '<body />',
                        headers: {
                            'x-kibana': '42',
                            'content-security-policy': "script-src 'unsafe-eval' 'self'; worker-src blob: 'self'; style-src 'unsafe-inline' 'self'",
                        },
                    });
                });
            });
            describe('renderHtml', () => {
                it('formats successful response', async () => {
                    const htmlBody = '<html><body /></html>';
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderHtml({ body: htmlBody });
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(responseFactory.ok).toHaveBeenCalledWith({
                        body: htmlBody,
                        headers: {
                            'content-type': 'text/html',
                            'content-security-policy': "script-src 'unsafe-eval' 'self'; worker-src blob: 'self'; style-src 'unsafe-inline' 'self'",
                        },
                    });
                });
                it('can attach headers, except the CSP & "content-type" headers', async () => {
                    const htmlBody = '<html><body /></html>';
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderHtml({
                            body: htmlBody,
                            headers: {
                                'content-type': 'text/html5',
                                'content-security-policy': "script-src 'unsafe-eval'",
                                'x-kibana': '42',
                            },
                        });
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(responseFactory.ok).toHaveBeenCalledWith({
                        body: htmlBody,
                        headers: {
                            'content-type': 'text/html',
                            'x-kibana': '42',
                            'content-security-policy': "script-src 'unsafe-eval' 'self'; worker-src blob: 'self'; style-src 'unsafe-inline' 'self'",
                        },
                    });
                });
            });
            describe('renderJs', () => {
                it('formats successful response', async () => {
                    const jsBody = 'alert(1);';
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderJs({ body: jsBody });
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(responseFactory.ok).toHaveBeenCalledWith({
                        body: jsBody,
                        headers: {
                            'content-type': 'text/javascript',
                            'content-security-policy': "script-src 'unsafe-eval' 'self'; worker-src blob: 'self'; style-src 'unsafe-inline' 'self'",
                        },
                    });
                });
                it('can attach headers, except the CSP & "content-type" headers', async () => {
                    const jsBody = 'alert(1);';
                    const routeConfig = { path: '/', validate: false };
                    const { createRegistrar } = await service.setup(setupDeps);
                    const { register } = createRegistrar(router);
                    register(routeConfig, async (ctx, req, res) => {
                        return res.renderJs({
                            body: jsBody,
                            headers: {
                                'content-type': 'text/html',
                                'content-security-policy': "script-src 'unsafe-eval'",
                                'x-kibana': '42',
                            },
                        });
                    });
                    const [[, routeHandler]] = router.get.mock.calls;
                    const responseFactory = http_resources_service_mock_1.httpResourcesMock.createResponseFactory();
                    await routeHandler(context, kibanaRequest, responseFactory);
                    expect(responseFactory.ok).toHaveBeenCalledWith({
                        body: jsBody,
                        headers: {
                            'content-type': 'text/javascript',
                            'x-kibana': '42',
                            'content-security-policy': "script-src 'unsafe-eval' 'self'; worker-src blob: 'self'; style-src 'unsafe-inline' 'self'",
                        },
                    });
                });
            });
        });
    });
});
