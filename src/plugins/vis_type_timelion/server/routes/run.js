"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const config_schema_1 = require("@kbn/config-schema");
const bluebird_1 = tslib_1.__importDefault(require("bluebird"));
const lodash_1 = tslib_1.__importDefault(require("lodash"));
// @ts-ignore
const chain_runner_js_1 = tslib_1.__importDefault(require("../handlers/chain_runner.js"));
// @ts-ignore
const get_namespaced_settings_1 = tslib_1.__importDefault(require("../lib/get_namespaced_settings"));
// @ts-ignore
const tl_config_1 = tslib_1.__importDefault(require("../handlers/lib/tl_config"));
const timelionDefaults = get_namespaced_settings_1.default();
function runRoute(router, { logger, getFunction, configManager, }) {
    router.post({
        path: '/api/timelion/run',
        validate: {
            body: config_schema_1.schema.object({
                sheet: config_schema_1.schema.arrayOf(config_schema_1.schema.string()),
                extended: config_schema_1.schema.maybe(config_schema_1.schema.object({
                    es: config_schema_1.schema.object({
                        filter: config_schema_1.schema.object({
                            bool: config_schema_1.schema.object({
                                filter: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.object({}, { unknowns: 'allow' }))),
                                must: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.object({}, { unknowns: 'allow' }))),
                                should: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.object({}, { unknowns: 'allow' }))),
                                must_not: config_schema_1.schema.maybe(config_schema_1.schema.arrayOf(config_schema_1.schema.object({}, { unknowns: 'allow' }))),
                            }),
                        }),
                    }),
                })),
                time: config_schema_1.schema.maybe(config_schema_1.schema.object({
                    from: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                    interval: config_schema_1.schema.string(),
                    timezone: config_schema_1.schema.string(),
                    to: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                })),
            }),
        },
    }, router.handleLegacyErrors(async (context, request, response) => {
        try {
            const uiSettings = await context.core.uiSettings.client.getAll();
            const tlConfig = tl_config_1.default({
                request,
                settings: lodash_1.default.defaults(uiSettings, timelionDefaults),
                getFunction,
                allowedGraphiteUrls: configManager.getGraphiteUrls(),
                esShardTimeout: configManager.getEsShardTimeout(),
                savedObjectsClient: context.core.savedObjects.client,
                esDataClient: () => context.core.elasticsearch.dataClient,
            });
            const chainRunner = chain_runner_js_1.default(tlConfig);
            const sheet = await bluebird_1.default.all(chainRunner.processRequest(request.body));
            return response.ok({
                body: {
                    sheet,
                    stats: chainRunner.getStats(),
                },
            });
        }
        catch (err) {
            logger.error(`${err.toString()}: ${err.stack}`);
            // TODO Maybe we should just replace everywhere we throw with Boom? Probably.
            if (err.isBoom) {
                throw err;
            }
            else {
                return response.internalError({
                    body: {
                        message: err.toString(),
                    },
                });
            }
        }
    }));
}
exports.runRoute = runRoute;
