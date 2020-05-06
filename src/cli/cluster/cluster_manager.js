"use strict";
/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const path_1 = require("path");
const url_1 = require("url");
const opn_1 = tslib_1.__importDefault(require("opn"));
const dev_utils_1 = require("@kbn/dev-utils");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const run_kbn_optimizer_1 = require("./run_kbn_optimizer");
const log_1 = require("./log");
const worker_1 = require("./worker");
process.env.kbnWorkerType = 'managr';
const firstAllTrue = (...sources) => Rx.combineLatest(...sources).pipe(operators_1.filter(values => values.every(v => v === true)), operators_1.take(1), operators_1.mapTo(undefined));
class ClusterManager {
    constructor(opts, config, basePathProxy) {
        this.watcher = null;
        this.addedCount = 0;
        // exposed for testing
        this.serverReady$ = new Rx.ReplaySubject(1);
        // exposed for testing
        this.optimizerReady$ = new Rx.ReplaySubject(1);
        // exposed for testing
        this.kbnOptimizerReady$ = new Rx.ReplaySubject(1);
        this.onWatcherAdd = () => {
            this.addedCount += 1;
        };
        this.onWatcherChange = (e, path) => {
            for (const worker of this.workers) {
                worker.onChange(path);
            }
        };
        this.onWatcherError = (err) => {
            this.log.bad('failed to watch files!\n', err.stack);
            process.exit(1); // eslint-disable-line no-process-exit
        };
        this.log = new log_1.Log(opts.quiet, opts.silent);
        this.inReplMode = !!opts.repl;
        this.basePathProxy = basePathProxy;
        if (config.get('optimize.enabled') !== false) {
            // run @kbn/optimizer and write it's state to kbnOptimizerReady$
            run_kbn_optimizer_1.runKbnOptimizer(opts, config)
                .pipe(operators_1.map(({ state }) => state.phase === 'success' || state.phase === 'issue'), operators_1.tap({
                error: error => {
                    this.log.bad('New platform optimizer error', error.stack);
                    process.exit(1);
                },
            }))
                .subscribe(this.kbnOptimizerReady$);
        }
        else {
            this.kbnOptimizerReady$.next(true);
        }
        const serverArgv = [];
        const optimizerArgv = ['--plugins.initialize=false', '--server.autoListen=false'];
        if (this.basePathProxy) {
            optimizerArgv.push(`--server.basePath=${this.basePathProxy.basePath}`, '--server.rewriteBasePath=true');
            serverArgv.push(`--server.port=${this.basePathProxy.targetPort}`, `--server.basePath=${this.basePathProxy.basePath}`, '--server.rewriteBasePath=true');
        }
        this.workers = [
            (this.optimizer = new worker_1.Worker({
                type: 'optmzr',
                title: 'optimizer',
                log: this.log,
                argv: optimizerArgv,
                watch: false,
            })),
            (this.server = new worker_1.Worker({
                type: 'server',
                log: this.log,
                argv: serverArgv,
            })),
        ];
        // write server status to the serverReady$ subject
        Rx.merge(Rx.fromEvent(this.server, 'starting').pipe(operators_1.mapTo(false)), Rx.fromEvent(this.server, 'listening').pipe(operators_1.mapTo(true)), Rx.fromEvent(this.server, 'crashed').pipe(operators_1.mapTo(true)))
            .pipe(operators_1.startWith(this.server.listening || this.server.crashed))
            .subscribe(this.serverReady$);
        // write optimizer status to the optimizerReady$ subject
        Rx.merge(Rx.fromEvent(this.optimizer, 'optimizeStatus'), Rx.defer(() => {
            if (this.optimizer.fork) {
                this.optimizer.fork.send({ optimizeReady: '?' });
            }
        }))
            .pipe(operators_1.map((msg) => msg && !!msg.success))
            .subscribe(this.optimizerReady$);
        // broker messages between workers
        this.workers.forEach(worker => {
            worker.on('broadcast', msg => {
                this.workers.forEach(to => {
                    if (to !== worker && to.online) {
                        to.fork.send(msg);
                    }
                });
            });
        });
        // When receive that event from server worker
        // forward a reloadLoggingConfig message to master
        // and all workers. This is only used by LogRotator service
        // when the cluster mode is enabled
        this.server.on('reloadLoggingConfigFromServerWorker', () => {
            process.emit('message', { reloadLoggingConfig: true });
            this.workers.forEach(worker => {
                worker.fork.send({ reloadLoggingConfig: true });
            });
        });
        if (opts.open) {
            this.setupOpen(url_1.format({
                protocol: config.get('server.ssl.enabled') ? 'https' : 'http',
                hostname: config.get('server.host'),
                port: config.get('server.port'),
                pathname: this.basePathProxy ? this.basePathProxy.basePath : '',
            }));
        }
        if (opts.watch) {
            const pluginPaths = config.get('plugins.paths');
            const scanDirs = [
                ...config.get('plugins.scanDirs'),
                path_1.resolve(dev_utils_1.REPO_ROOT, 'src/plugins'),
                path_1.resolve(dev_utils_1.REPO_ROOT, 'x-pack/plugins'),
            ];
            const extraPaths = [...pluginPaths, ...scanDirs];
            const pluginInternalDirsIgnore = scanDirs
                .map(scanDir => path_1.resolve(scanDir, '*'))
                .concat(pluginPaths)
                .reduce((acc, path) => acc.concat(path_1.resolve(path, 'test/**'), path_1.resolve(path, 'build/**'), path_1.resolve(path, 'target/**'), path_1.resolve(path, 'scripts/**'), path_1.resolve(path, 'docs/**')), []);
            this.setupWatching(extraPaths, pluginInternalDirsIgnore);
        }
        else
            this.startCluster();
    }
    startCluster() {
        this.setupManualRestart();
        for (const worker of this.workers) {
            worker.start();
        }
        if (this.basePathProxy) {
            this.basePathProxy.start({
                delayUntil: () => firstAllTrue(this.serverReady$, this.kbnOptimizerReady$),
                shouldRedirectFromOldBasePath: (path) => {
                    // strip `s/{id}` prefix when checking for need to redirect
                    if (path.startsWith('s/')) {
                        path = path
                            .split('/')
                            .slice(2)
                            .join('/');
                    }
                    const isApp = path.startsWith('app/');
                    const isKnownShortPath = ['login', 'logout', 'status'].includes(path);
                    return isApp || isKnownShortPath;
                },
            });
        }
    }
    setupOpen(openUrl) {
        firstAllTrue(this.serverReady$, this.kbnOptimizerReady$, this.optimizerReady$)
            .toPromise()
            .then(() => {
            opn_1.default(openUrl);
        });
    }
    setupWatching(extraPaths, pluginInternalDirsIgnore) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const chokidar = require('chokidar');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { fromRoot } = require('../../core/server/utils');
        const watchPaths = Array.from(new Set([
            fromRoot('src/core'),
            fromRoot('src/legacy/core_plugins'),
            fromRoot('src/legacy/server'),
            fromRoot('src/legacy/ui'),
            fromRoot('src/legacy/utils'),
            fromRoot('x-pack/legacy/common'),
            fromRoot('x-pack/legacy/plugins'),
            fromRoot('x-pack/legacy/server'),
            fromRoot('config'),
            ...extraPaths,
        ].map(path => path_1.resolve(path))));
        const ignorePaths = [
            /[\\\/](\..*|node_modules|bower_components|target|public|__[a-z0-9_]+__|coverage)([\\\/]|$)/,
            /\.test\.(js|ts)$/,
            ...pluginInternalDirsIgnore,
            fromRoot('src/legacy/server/sass/__tmp__'),
            fromRoot('x-pack/legacy/plugins/reporting/.chromium'),
            fromRoot('x-pack/plugins/siem/cypress'),
            fromRoot('x-pack/legacy/plugins/apm/e2e'),
            fromRoot('x-pack/legacy/plugins/apm/scripts'),
            fromRoot('x-pack/legacy/plugins/canvas/canvas_plugin_src'),
            'plugins/java_languageserver',
        ];
        this.watcher = chokidar.watch(watchPaths, {
            cwd: fromRoot('.'),
            ignored: ignorePaths,
        });
        this.watcher.on('add', this.onWatcherAdd);
        this.watcher.on('error', this.onWatcherError);
        this.watcher.once('ready', () => {
            // start sending changes to workers
            this.watcher.removeListener('add', this.onWatcherAdd);
            this.watcher.on('all', this.onWatcherChange);
            this.log.good('watching for changes', `(${this.addedCount} files)`);
            this.startCluster();
        });
    }
    setupManualRestart() {
        // If we're in REPL mode, the user can use the REPL to manually restart.
        // The setupManualRestart method interferes with stdin/stdout, in a way
        // that negatively affects the REPL.
        if (this.inReplMode) {
            return;
        }
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const readline = require('readline');
        const rl = readline.createInterface(process.stdin, process.stdout);
        let nls = 0;
        const clear = () => (nls = 0);
        let clearTimer;
        const clearSoon = () => {
            clearSoon.cancel();
            clearTimer = setTimeout(() => {
                clearTimer = undefined;
                clear();
            });
        };
        clearSoon.cancel = () => {
            clearTimeout(clearTimer);
            clearTimer = undefined;
        };
        rl.setPrompt('');
        rl.prompt();
        rl.on('line', () => {
            nls = nls + 1;
            if (nls >= 2) {
                clearSoon.cancel();
                clear();
                this.server.start();
            }
            else {
                clearSoon();
            }
            rl.prompt();
        });
        rl.on('SIGINT', () => {
            rl.pause();
            process.kill(process.pid, 'SIGINT');
        });
    }
}
exports.ClusterManager = ClusterManager;
