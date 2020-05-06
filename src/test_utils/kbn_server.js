"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const dev_utils_1 = require("@kbn/dev-utils");
const test_1 = require("@kbn/test");
const lodash_1 = require("lodash");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const config_1 = require("../core/server/config");
const root_1 = require("../core/server/root");
const DEFAULTS_SETTINGS = {
    server: {
        autoListen: true,
        // Use the ephemeral port to make sure that tests use the first available
        // port and aren't affected by the timing issues in test environment.
        port: 0,
        xsrf: { disableProtection: true },
    },
    logging: { silent: true },
    plugins: {},
    optimize: { enabled: false },
    migrations: { skip: true },
};
const DEFAULT_SETTINGS_WITH_CORE_PLUGINS = {
    plugins: { scanDirs: [path_1.resolve(__dirname, '../legacy/core_plugins')] },
    elasticsearch: {
        hosts: [test_1.esTestConfig.getUrl()],
        username: test_1.kibanaServerTestUser.username,
        password: test_1.kibanaServerTestUser.password,
    },
};
function createRootWithSettings(settings, cliArgs = {}) {
    const env = config_1.Env.createDefault({
        configs: [],
        cliArgs: {
            dev: false,
            open: false,
            quiet: false,
            silent: false,
            watch: false,
            repl: false,
            basePath: false,
            optimize: false,
            runExamples: false,
            oss: true,
            ...cliArgs,
        },
        isDevClusterMaster: false,
    });
    return new root_1.Root({
        getConfig$: () => new rxjs_1.BehaviorSubject(lodash_1.defaultsDeep({}, settings, DEFAULTS_SETTINGS)),
    }, env);
}
exports.createRootWithSettings = createRootWithSettings;
/**
 * Returns supertest request attached to the core's internal native Node server.
 * @param root
 * @param method
 * @param path
 */
function getSupertest(root, method, path) {
    const testUserCredentials = Buffer.from(`${test_1.kibanaTestUser.username}:${test_1.kibanaTestUser.password}`);
    return supertest_1.default(root.server.http.httpServer.server.listener)[method](path)
        .set('Authorization', `Basic ${testUserCredentials.toString('base64')}`);
}
exports.getSupertest = getSupertest;
/**
 * Creates an instance of Root with default configuration
 * tailored for unit tests.
 *
 * @param {Object} [settings={}] Any config overrides for this instance.
 * @returns {Root}
 */
function createRoot(settings = {}, cliArgs = {}) {
    return createRootWithSettings(settings, cliArgs);
}
exports.createRoot = createRoot;
/**
 *  Creates an instance of Root, including all of the core plugins,
 *  with default configuration tailored for unit tests.
 *
 *  @param {Object} [settings={}] Any config overrides for this instance.
 *  @returns {Root}
 */
function createRootWithCorePlugins(settings = {}, cliArgs = {}) {
    return createRootWithSettings(lodash_1.defaultsDeep({}, settings, DEFAULT_SETTINGS_WITH_CORE_PLUGINS), cliArgs);
}
exports.createRootWithCorePlugins = createRootWithCorePlugins;
/**
 * Returns `kbnServer` instance used in the "legacy" Kibana.
 * @param root
 */
function getKbnServer(root) {
    return root.server.legacy.kbnServer;
}
exports.getKbnServer = getKbnServer;
exports.request = {
    delete: (root, path) => getSupertest(root, 'delete', path),
    get: (root, path) => getSupertest(root, 'get', path),
    head: (root, path) => getSupertest(root, 'head', path),
    post: (root, path) => getSupertest(root, 'post', path),
    put: (root, path) => getSupertest(root, 'put', path),
};
/**
 * Creates an instance of the Root, including all of the core "legacy" plugins,
 * with default configuration tailored for unit tests, and starts es.
 *
 * @param options
 * @prop settings Any config overrides for this instance.
 * @prop adjustTimeout A function(t) => this.timeout(t) that adjust the timeout of a
 * test, ensuring the test properly waits for the server to boot without timing out.
 */
function createTestServers({ adjustTimeout, settings = {}, }) {
    if (!adjustTimeout) {
        throw new Error('adjustTimeout is required in order to avoid flaky tests');
    }
    const license = lodash_1.get(settings, 'es.license', 'oss');
    const usersToBeAdded = lodash_1.get(settings, 'users', []);
    if (usersToBeAdded.length > 0) {
        if (license !== 'trial') {
            throw new Error('Adding users is only supported by createTestServers when using a trial license');
        }
    }
    const log = new dev_utils_1.ToolingLog({
        level: 'debug',
        writeTo: process.stdout,
    });
    log.indent(6);
    log.info('starting elasticsearch');
    log.indent(4);
    const es = test_1.createLegacyEsTestCluster(lodash_1.defaultsDeep({}, lodash_1.get(settings, 'es', {}), {
        log,
        license,
        password: license === 'trial' ? test_1.DEFAULT_SUPERUSER_PASS : undefined,
    }));
    log.indent(-4);
    // Add time for KBN and adding users
    adjustTimeout(es.getStartTimeout() + 100000);
    const kbnSettings = lodash_1.get(settings, 'kbn', {});
    return {
        startES: async () => {
            await es.start(lodash_1.get(settings, 'es.esArgs', []));
            if (['gold', 'trial'].includes(license)) {
                await test_1.setupUsers({
                    log,
                    esPort: test_1.esTestConfig.getUrlParts().port,
                    updates: [
                        ...usersToBeAdded,
                        // user elastic
                        test_1.esTestConfig.getUrlParts(),
                        // user kibana
                        test_1.kbnTestConfig.getUrlParts(),
                    ],
                });
                // Override provided configs, we know what the elastic user is now
                kbnSettings.elasticsearch = {
                    hosts: [test_1.esTestConfig.getUrl()],
                    username: test_1.kibanaServerTestUser.username,
                    password: test_1.kibanaServerTestUser.password,
                };
            }
            return {
                stop: async () => await es.cleanup(),
                es,
                hosts: [test_1.esTestConfig.getUrl()],
                username: test_1.kibanaServerTestUser.username,
                password: test_1.kibanaServerTestUser.password,
            };
        },
        startKibana: async () => {
            const root = createRootWithCorePlugins(kbnSettings);
            await root.setup();
            await root.start();
            const kbnServer = getKbnServer(root);
            await kbnServer.server.plugins.elasticsearch.waitUntilReady();
            return {
                root,
                kbnServer,
                stop: async () => await root.shutdown(),
            };
        },
    };
}
exports.createTestServers = createTestServers;
