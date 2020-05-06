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
const chokidar = tslib_1.__importStar(require("chokidar"));
const cluster_1 = require("cluster");
const fs_1 = tslib_1.__importDefault(require("fs"));
const lodash_1 = require("lodash");
const os_1 = require("os");
const path_1 = require("path");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const util_1 = require("util");
const mkdirAsync = util_1.promisify(fs_1.default.mkdir);
const readdirAsync = util_1.promisify(fs_1.default.readdir);
const renameAsync = util_1.promisify(fs_1.default.rename);
const statAsync = util_1.promisify(fs_1.default.stat);
const unlinkAsync = util_1.promisify(fs_1.default.unlink);
const writeFileAsync = util_1.promisify(fs_1.default.writeFile);
class LogRotator {
    constructor(config, server) {
        this.stop = () => {
            if (!this.running) {
                return;
            }
            // cleanup exit listener
            this._deleteExitListener();
            // stop log file size monitor
            this._stopLogFileSizeMonitor();
            this.running = false;
        };
        this._logFileSizeMonitorHandler = async (filename, stats) => {
            if (!filename || !stats) {
                return;
            }
            this.logFileSize = stats.size || 0;
            await this.throttledRotate();
        };
        this.config = config;
        this.log = server.log.bind(server);
        this.logFilePath = config.get('logging.dest');
        this.everyBytes = config.get('logging.rotate.everyBytes');
        this.keepFiles = config.get('logging.rotate.keepFiles');
        this.running = false;
        this.logFileSize = 0;
        this.isRotating = false;
        this.throttledRotate = lodash_1.throttle(async () => await this._rotate(), 5000);
        this.stalker = null;
        this.usePolling = config.get('logging.rotate.usePolling');
        this.pollingInterval = config.get('logging.rotate.pollingInterval');
        this.shouldUsePolling = false;
        this.stalkerUsePollingPolicyTestTimeout = null;
    }
    async start() {
        if (this.running) {
            return;
        }
        this.running = true;
        // create exit listener for cleanup purposes
        this._createExitListener();
        // call rotate on startup
        await this._callRotateOnStartup();
        // init log file size monitor
        await this._startLogFileSizeMonitor();
    }
    async _shouldUsePolling() {
        try {
            // Setup a test file in order to try the fs env
            // and understand if we need to usePolling or not
            const tempFileDir = os_1.tmpdir();
            const tempFile = path_1.join(tempFileDir, 'kbn_log_rotation_use_polling_test_file.log');
            await mkdirAsync(tempFileDir, { recursive: true });
            await writeFileAsync(tempFile, '');
            // setup fs.watch for the temp test file
            const testWatcher = fs_1.default.watch(tempFile, { persistent: false });
            // await writeFileAsync(tempFile, 'test');
            const usePollingTest$ = new rxjs_1.Observable(observer => {
                // observable complete function
                const completeFn = (completeStatus) => {
                    if (this.stalkerUsePollingPolicyTestTimeout) {
                        clearTimeout(this.stalkerUsePollingPolicyTestTimeout);
                    }
                    testWatcher.close();
                    observer.next(completeStatus);
                    observer.complete();
                };
                // setup conditions that would fire the observable
                this.stalkerUsePollingPolicyTestTimeout = setTimeout(() => completeFn(true), 15000);
                testWatcher.on('change', () => completeFn(false));
                testWatcher.on('error', () => completeFn(true));
                // fire test watcher events
                setTimeout(() => {
                    fs_1.default.writeFileSync(tempFile, 'test');
                }, 0);
            });
            // wait for the first observable result and consider it as the result
            // for our use polling test
            const usePollingTestResult = await usePollingTest$.pipe(operators_1.first()).toPromise();
            // delete the temp file used for the test
            await unlinkAsync(tempFile);
            return usePollingTestResult;
        }
        catch {
            return true;
        }
    }
    async _startLogFileSizeMonitor() {
        this.usePolling = this.config.get('logging.rotate.usePolling');
        this.shouldUsePolling = await this._shouldUsePolling();
        if (this.usePolling && !this.shouldUsePolling) {
            this.log(['warning', 'logging:rotate'], 'Looks like your current environment support a faster algorithm then polling. You can try to disable `usePolling`');
        }
        if (!this.usePolling && this.shouldUsePolling) {
            this.log(['error', 'logging:rotate'], 'Looks like within your current environment you need to use polling in order to enable log rotator. Please enable `usePolling`');
        }
        this.stalker = chokidar.watch(this.logFilePath, {
            ignoreInitial: true,
            awaitWriteFinish: false,
            useFsEvents: false,
            usePolling: this.usePolling,
            interval: this.pollingInterval,
            binaryInterval: this.pollingInterval,
            alwaysStat: true,
            atomic: false,
        });
        this.stalker.on('change', this._logFileSizeMonitorHandler);
    }
    _stopLogFileSizeMonitor() {
        if (!this.stalker) {
            return;
        }
        this.stalker.close();
        if (this.stalkerUsePollingPolicyTestTimeout) {
            clearTimeout(this.stalkerUsePollingPolicyTestTimeout);
        }
    }
    _createExitListener() {
        process.on('exit', this.stop);
    }
    _deleteExitListener() {
        process.removeListener('exit', this.stop);
    }
    async _getLogFileSizeAndCreateIfNeeded() {
        try {
            const logFileStats = await statAsync(this.logFilePath);
            return logFileStats.size;
        }
        catch {
            // touch the file to make the watcher being able to register
            // change events
            await writeFileAsync(this.logFilePath, '');
            return 0;
        }
    }
    async _callRotateOnStartup() {
        this.logFileSize = await this._getLogFileSizeAndCreateIfNeeded();
        await this._rotate();
    }
    _shouldRotate() {
        // should rotate evaluation
        // 1. should rotate if current log size exceeds
        //    the defined one on everyBytes
        // 2. should not rotate if is already rotating or if any
        //    of the conditions on 1. do not apply
        if (this.isRotating) {
            return false;
        }
        return this.logFileSize >= this.everyBytes;
    }
    async _rotate() {
        if (!this._shouldRotate()) {
            return;
        }
        await this._rotateNow();
    }
    async _rotateNow() {
        // rotate process
        // 1. get rotated files metadata (list of log rotated files present on the log folder, numerical sorted)
        // 2. delete last file
        // 3. rename all files to the correct index +1
        // 4. rename + compress current log into 1
        // 5. send SIGHUP to reload log config
        // rotate process is starting
        this.isRotating = true;
        // get rotated files metadata
        const foundRotatedFiles = await this._readRotatedFilesMetadata();
        // delete number of rotated files exceeding the keepFiles limit setting
        const rotatedFiles = await this._deleteFoundRotatedFilesAboveKeepFilesLimit(foundRotatedFiles);
        // delete last file
        await this._deleteLastRotatedFile(rotatedFiles);
        // rename all files to correct index + 1
        // and normalize numbering if by some reason
        // (for example log file deletion) that numbering
        // was interrupted
        await this._renameRotatedFilesByOne(rotatedFiles);
        // rename current log into 0
        await this._rotateCurrentLogFile();
        // send SIGHUP to reload log configuration
        this._sendReloadLogConfigSignal();
        // Reset log file size
        this.logFileSize = 0;
        // rotate process is finished
        this.isRotating = false;
    }
    async _readRotatedFilesMetadata() {
        const logFileBaseName = path_1.basename(this.logFilePath);
        const logFilesFolder = path_1.dirname(this.logFilePath);
        const foundLogFiles = await readdirAsync(logFilesFolder);
        return (foundLogFiles
            .filter(file => new RegExp(`${logFileBaseName}\\.\\d`).test(file))
            // we use .slice(-1) here in order to retrieve the last number match in the read filenames
            .sort((a, b) => Number(a.match(/(\d+)/g).slice(-1)) - Number(b.match(/(\d+)/g).slice(-1)))
            .map(filename => `${logFilesFolder}${path_1.sep}${filename}`));
    }
    async _deleteFoundRotatedFilesAboveKeepFilesLimit(foundRotatedFiles) {
        if (foundRotatedFiles.length <= this.keepFiles) {
            return foundRotatedFiles;
        }
        const finalRotatedFiles = foundRotatedFiles.slice(0, this.keepFiles);
        const rotatedFilesToDelete = foundRotatedFiles.slice(finalRotatedFiles.length, foundRotatedFiles.length);
        await Promise.all(rotatedFilesToDelete.map((rotatedFilePath) => unlinkAsync(rotatedFilePath)));
        return finalRotatedFiles;
    }
    async _deleteLastRotatedFile(rotatedFiles) {
        if (rotatedFiles.length < this.keepFiles) {
            return;
        }
        const lastFilePath = rotatedFiles.pop();
        await unlinkAsync(lastFilePath);
    }
    async _renameRotatedFilesByOne(rotatedFiles) {
        const logFileBaseName = path_1.basename(this.logFilePath);
        const logFilesFolder = path_1.dirname(this.logFilePath);
        for (let i = rotatedFiles.length - 1; i >= 0; i--) {
            const oldFilePath = rotatedFiles[i];
            const newFilePath = `${logFilesFolder}${path_1.sep}${logFileBaseName}.${i + 1}`;
            await renameAsync(oldFilePath, newFilePath);
        }
    }
    async _rotateCurrentLogFile() {
        const newFilePath = `${this.logFilePath}.0`;
        await renameAsync(this.logFilePath, newFilePath);
    }
    _sendReloadLogConfigSignal() {
        if (cluster_1.isMaster) {
            process.emit('SIGHUP');
            return;
        }
        // Send a special message to the cluster manager
        // so it can forward it correctly
        // It will only run when we are under cluster mode (not under a production environment)
        if (!process.send) {
            this.log(['error', 'logging:rotate'], 'For some unknown reason process.send is not defined, the rotation was not successful');
            return;
        }
        process.send(['RELOAD_LOGGING_CONFIG_FROM_SERVER_WORKER']);
    }
}
exports.LogRotator = LogRotator;
