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
const podium_1 = tslib_1.__importDefault(require("podium"));
// @ts-ignore: implicit any for JS file
const config_1 = require("../../../../legacy/server/config");
// @ts-ignore: implicit any for JS file
const logging_1 = require("../../../../legacy/server/logging");
exports.metadataSymbol = Symbol('log message with metadata');
function attachMetaData(message, metadata = {}) {
    return {
        [exports.metadataSymbol]: {
            message,
            metadata,
        },
    };
}
exports.attachMetaData = attachMetaData;
const isEmptyObject = (obj) => Object.keys(obj).length === 0;
function getDataToLog(error, metadata, message) {
    if (error)
        return error;
    if (!isEmptyObject(metadata))
        return attachMetaData(message, metadata);
    return message;
}
/**
 * Converts core log level to a one that's known to the legacy platform.
 * @param level Log level from the core.
 */
function getLegacyLogLevel(level) {
    const logLevel = level.id.toLowerCase();
    if (logLevel === 'warn') {
        return 'warning';
    }
    if (logLevel === 'trace') {
        return 'debug';
    }
    return logLevel;
}
/**
 *  The "legacy" Kibana uses Hapi server + even-better plugin to log, so we should
 *  use the same approach here to make log records generated by the core to look the
 *  same as the rest of the records generated by the "legacy" Kibana. But to reduce
 *  overhead of having full blown Hapi server instance we create our own "light" version.
 *  @internal
 */
class LegacyLoggingServer {
    constructor(legacyLoggingConfig) {
        this.connections = [];
        // Emulates Hapi's usage of the podium event bus.
        this.events = new podium_1.default(['log', 'request', 'response']);
        // We set `ops.interval` to max allowed number and `ops` filter to value
        // that doesn't exist to avoid logging of ops at all, if turned on it will be
        // logged by the "legacy" Kibana.
        const config = {
            logging: {
                ...legacyLoggingConfig,
                events: {
                    ...legacyLoggingConfig.events,
                    ops: '__no-ops__',
                },
            },
            ops: { interval: 2147483647 },
        };
        logging_1.setupLogging(this, config_1.Config.withDefaultSchema(config));
    }
    register({ plugin: { register }, options }) {
        return register(this, options);
    }
    log({ level, context, message, error, timestamp, meta = {} }) {
        const { tags = [], ...metadata } = meta;
        this.events.emit('log', {
            data: getDataToLog(error, metadata, message),
            tags: [getLegacyLogLevel(level), ...context.split('.'), ...tags],
            timestamp: timestamp.getTime(),
        });
    }
    stop() {
        // Tell the plugin we're stopping.
        if (this.onPostStopCallback !== undefined) {
            this.onPostStopCallback();
        }
    }
    ext(eventName, callback) {
        // method is called by plugin that's being registered.
        if (eventName === 'onPostStop') {
            this.onPostStopCallback = callback;
        }
        // We don't care about any others the plugin registers
    }
    expose() {
        // method is called by plugin that's being registered.
    }
}
exports.LegacyLoggingServer = LegacyLoggingServer;
