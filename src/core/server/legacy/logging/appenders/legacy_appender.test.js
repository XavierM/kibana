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
jest.mock('../legacy_logging_server');
const log_level_1 = require("../../../logging/log_level");
const legacy_logging_server_1 = require("../legacy_logging_server");
const legacy_appender_1 = require("./legacy_appender");
afterEach(() => legacy_logging_server_1.LegacyLoggingServer.mockClear());
test('`configSchema` creates correct schema.', () => {
    const appenderSchema = legacy_appender_1.LegacyAppender.configSchema;
    const validConfig = { kind: 'legacy-appender', legacyLoggingConfig: { verbose: true } };
    expect(appenderSchema.validate(validConfig)).toEqual({
        kind: 'legacy-appender',
        legacyLoggingConfig: { verbose: true },
    });
    const wrongConfig = { kind: 'not-legacy-appender' };
    expect(() => appenderSchema.validate(wrongConfig)).toThrow();
});
test('`append()` correctly pushes records to legacy platform.', () => {
    const timestamp = new Date(Date.UTC(2012, 1, 1, 11, 22, 33, 44));
    const records = [
        {
            context: 'context-1',
            level: log_level_1.LogLevel.Trace,
            message: 'message-1',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-2',
            level: log_level_1.LogLevel.Debug,
            message: 'message-2',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-3.sub-context-3',
            level: log_level_1.LogLevel.Info,
            message: 'message-3',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-4.sub-context-4',
            level: log_level_1.LogLevel.Warn,
            message: 'message-4',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-5',
            error: new Error('Some Error'),
            level: log_level_1.LogLevel.Error,
            message: 'message-5-with-error',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-6',
            level: log_level_1.LogLevel.Error,
            message: 'message-6-with-message',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-7.sub-context-7.sub-sub-context-7',
            error: new Error('Some Fatal Error'),
            level: log_level_1.LogLevel.Fatal,
            message: 'message-7-with-error',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-8.sub-context-8.sub-sub-context-8',
            level: log_level_1.LogLevel.Fatal,
            message: 'message-8-with-message',
            timestamp,
            pid: 5355,
        },
        {
            context: 'context-9.sub-context-9',
            level: log_level_1.LogLevel.Info,
            message: 'message-9-with-message',
            timestamp,
            pid: 5355,
            meta: { someValue: 3 },
        },
        {
            context: 'context-10.sub-context-10',
            level: log_level_1.LogLevel.Info,
            message: 'message-10-with-message',
            timestamp,
            pid: 5355,
            meta: { tags: ['tag1', 'tag2'] },
        },
    ];
    const appender = new legacy_appender_1.LegacyAppender({ verbose: true });
    for (const record of records) {
        appender.append(record);
    }
    const [mockLegacyLoggingServerInstance] = legacy_logging_server_1.LegacyLoggingServer.mock.instances;
    expect(mockLegacyLoggingServerInstance.log.mock.calls).toHaveLength(records.length);
    records.forEach((r, idx) => {
        expect(mockLegacyLoggingServerInstance.log.mock.calls[idx][0]).toMatchSnapshot({
            pid: expect.any(Number),
        });
    });
});
test('legacy logging server is correctly created and disposed.', async () => {
    const mockRawLegacyLoggingConfig = { verbose: true };
    const appender = new legacy_appender_1.LegacyAppender(mockRawLegacyLoggingConfig);
    expect(legacy_logging_server_1.LegacyLoggingServer).toHaveBeenCalledTimes(1);
    expect(legacy_logging_server_1.LegacyLoggingServer).toHaveBeenCalledWith(mockRawLegacyLoggingConfig);
    const [mockLegacyLoggingServerInstance] = legacy_logging_server_1.LegacyLoggingServer.mock.instances;
    expect(mockLegacyLoggingServerInstance.stop).not.toHaveBeenCalled();
    await appender.dispose();
    expect(mockLegacyLoggingServerInstance.stop).toHaveBeenCalledTimes(1);
});
