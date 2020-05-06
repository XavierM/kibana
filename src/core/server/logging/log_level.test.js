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
const log_level_1 = require("./log_level");
const allLogLevels = [
    log_level_1.LogLevel.Off,
    log_level_1.LogLevel.Fatal,
    log_level_1.LogLevel.Error,
    log_level_1.LogLevel.Warn,
    log_level_1.LogLevel.Info,
    log_level_1.LogLevel.Debug,
    log_level_1.LogLevel.Trace,
    log_level_1.LogLevel.All,
];
test('`LogLevel.All` supports all log levels.', () => {
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.All.supports(level)).toBe(true);
    }
});
test('`LogLevel.Trace` supports `Trace, Debug, Info, Warn, Error, Fatal, Off`.', () => {
    const supportedLevels = [
        log_level_1.LogLevel.Off,
        log_level_1.LogLevel.Fatal,
        log_level_1.LogLevel.Error,
        log_level_1.LogLevel.Warn,
        log_level_1.LogLevel.Info,
        log_level_1.LogLevel.Debug,
        log_level_1.LogLevel.Trace,
    ];
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.Trace.supports(level)).toBe(supportedLevels.includes(level));
    }
});
test('`LogLevel.Debug` supports `Debug, Info, Warn, Error, Fatal, Off`.', () => {
    const supportedLevels = [
        log_level_1.LogLevel.Off,
        log_level_1.LogLevel.Fatal,
        log_level_1.LogLevel.Error,
        log_level_1.LogLevel.Warn,
        log_level_1.LogLevel.Info,
        log_level_1.LogLevel.Debug,
    ];
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.Debug.supports(level)).toBe(supportedLevels.includes(level));
    }
});
test('`LogLevel.Info` supports `Info, Warn, Error, Fatal, Off`.', () => {
    const supportedLevels = [
        log_level_1.LogLevel.Off,
        log_level_1.LogLevel.Fatal,
        log_level_1.LogLevel.Error,
        log_level_1.LogLevel.Warn,
        log_level_1.LogLevel.Info,
    ];
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.Info.supports(level)).toBe(supportedLevels.includes(level));
    }
});
test('`LogLevel.Warn` supports `Warn, Error, Fatal, Off`.', () => {
    const supportedLevels = [log_level_1.LogLevel.Off, log_level_1.LogLevel.Fatal, log_level_1.LogLevel.Error, log_level_1.LogLevel.Warn];
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.Warn.supports(level)).toBe(supportedLevels.includes(level));
    }
});
test('`LogLevel.Error` supports `Error, Fatal, Off`.', () => {
    const supportedLevels = [log_level_1.LogLevel.Off, log_level_1.LogLevel.Fatal, log_level_1.LogLevel.Error];
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.Error.supports(level)).toBe(supportedLevels.includes(level));
    }
});
test('`LogLevel.Fatal` supports `Fatal, Off`.', () => {
    const supportedLevels = [log_level_1.LogLevel.Off, log_level_1.LogLevel.Fatal];
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.Fatal.supports(level)).toBe(supportedLevels.includes(level));
    }
});
test('`LogLevel.Off` supports only itself.', () => {
    for (const level of allLogLevels) {
        expect(log_level_1.LogLevel.Off.supports(level)).toBe(level === log_level_1.LogLevel.Off);
    }
});
test('`fromId()` correctly converts string log level value to `LogLevel` instance.', () => {
    expect(log_level_1.LogLevel.fromId('all')).toBe(log_level_1.LogLevel.All);
    expect(log_level_1.LogLevel.fromId('trace')).toBe(log_level_1.LogLevel.Trace);
    expect(log_level_1.LogLevel.fromId('debug')).toBe(log_level_1.LogLevel.Debug);
    expect(log_level_1.LogLevel.fromId('info')).toBe(log_level_1.LogLevel.Info);
    expect(log_level_1.LogLevel.fromId('warn')).toBe(log_level_1.LogLevel.Warn);
    expect(log_level_1.LogLevel.fromId('error')).toBe(log_level_1.LogLevel.Error);
    expect(log_level_1.LogLevel.fromId('fatal')).toBe(log_level_1.LogLevel.Fatal);
    expect(log_level_1.LogLevel.fromId('off')).toBe(log_level_1.LogLevel.Off);
});
