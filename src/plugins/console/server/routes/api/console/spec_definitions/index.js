"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerSpecDefinitionsRoute = ({ router, services, }) => {
    const handler = async (ctx, request, response) => {
        const specResponse = {
            es: services.specDefinitions.asJson(),
        };
        return response.ok({
            body: specResponse,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    };
    router.get({ path: '/api/console/api_server', validate: false }, handler);
    router.post({ path: '/api/console/api_server', validate: false }, handler);
};
