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
jest.mock('../../layouts/layouts', () => {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { schema } = require('@kbn/config-schema');
    return {
        Layouts: {
            configSchema: schema.object({
                kind: schema.literal('mock'),
            }),
        },
    };
});
const log_level_1 = require("../../log_level");
const console_appender_1 = require("./console_appender");
test('`configSchema` creates correct schema.', () => {
    const appenderSchema = console_appender_1.ConsoleAppender.configSchema;
    const validConfig = { kind: 'console', layout: { kind: 'mock' } };
    expect(appenderSchema.validate(validConfig)).toEqual({
        kind: 'console',
        layout: { kind: 'mock' },
    });
    const wrongConfig1 = { kind: 'not-console', layout: { kind: 'mock' } };
    expect(() => appenderSchema.validate(wrongConfig1)).toThrow();
    const wrongConfig2 = { kind: 'file', layout: { kind: 'mock' }, path: 'path' };
    expect(() => appenderSchema.validate(wrongConfig2)).toThrow();
});
test('`append()` correctly formats records and pushes them to console.', () => {
    jest.spyOn(global.console, 'log').mockImplementation(() => {
        // noop
    });
    const records = [
        {
            context: 'context-1',
            level: log_level_1.LogLevel.All,
            message: 'message-1',
            timestamp: new Date(),
            pid: 5355,
        },
        {
            context: 'context-2',
            level: log_level_1.LogLevel.Trace,
            message: 'message-2',
            timestamp: new Date(),
            pid: 5355,
        },
        {
            context: 'context-3',
            error: new Error('Error'),
            level: log_level_1.LogLevel.Fatal,
            message: 'message-3',
            timestamp: new Date(),
            pid: 5355,
        },
    ];
    const appender = new console_appender_1.ConsoleAppender({
        format(record) {
            return `mock-${JSON.stringify(record)}`;
        },
    });
    for (const record of records) {
        appender.append(record);
        // eslint-disable-next-line no-console
        expect(console.log).toHaveBeenCalledWith(`mock-${JSON.stringify(record)}`);
    }
    // eslint-disable-next-line no-console
    expect(console.log).toHaveBeenCalledTimes(records.length);
});
