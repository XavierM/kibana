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
const file_appender_test_mocks_1 = require("./file_appender.test.mocks");
const log_level_1 = require("../../log_level");
const file_appender_1 = require("./file_appender");
const tickMs = (ms) => new Promise(resolve => setTimeout(resolve, ms));
beforeEach(() => {
    file_appender_test_mocks_1.mockCreateWriteStream.mockReset();
});
test('`createConfigSchema()` creates correct schema.', () => {
    const appenderSchema = file_appender_1.FileAppender.configSchema;
    const validConfig = { kind: 'file', layout: { kind: 'mock' }, path: 'path' };
    expect(appenderSchema.validate(validConfig)).toEqual({
        kind: 'file',
        layout: { kind: 'mock' },
        path: 'path',
    });
    const wrongConfig1 = {
        kind: 'not-file',
        layout: { kind: 'mock' },
        path: 'path',
    };
    expect(() => appenderSchema.validate(wrongConfig1)).toThrow();
    const wrongConfig2 = { kind: 'file', layout: { kind: 'mock' } };
    expect(() => appenderSchema.validate(wrongConfig2)).toThrow();
    const wrongConfig3 = { kind: 'console', layout: { kind: 'mock' } };
    expect(() => appenderSchema.validate(wrongConfig3)).toThrow();
});
test('file stream is created only once and only after first `append()` is called.', () => {
    file_appender_test_mocks_1.mockCreateWriteStream.mockReturnValue({
        write() {
            // noop
        },
    });
    const mockPath = 'mock://path/file.log';
    const appender = new file_appender_1.FileAppender({ format: () => '' }, mockPath);
    expect(file_appender_test_mocks_1.mockCreateWriteStream).not.toHaveBeenCalled();
    appender.append({
        context: 'context-1',
        level: log_level_1.LogLevel.All,
        message: 'message-1',
        timestamp: new Date(),
        pid: 5355,
    });
    expect(file_appender_test_mocks_1.mockCreateWriteStream).toHaveBeenCalledTimes(1);
    expect(file_appender_test_mocks_1.mockCreateWriteStream).toHaveBeenCalledWith(mockPath, {
        encoding: 'utf8',
        flags: 'a',
    });
    file_appender_test_mocks_1.mockCreateWriteStream.mockClear();
    appender.append({
        context: 'context-2',
        level: log_level_1.LogLevel.All,
        message: 'message-2',
        timestamp: new Date(),
        pid: 5355,
    });
    expect(file_appender_test_mocks_1.mockCreateWriteStream).not.toHaveBeenCalled();
});
test('`append()` correctly formats records and pushes them to the file.', () => {
    const mockStreamWrite = jest.fn();
    file_appender_test_mocks_1.mockCreateWriteStream.mockReturnValue({ write: mockStreamWrite });
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
    const appender = new file_appender_1.FileAppender({
        format(record) {
            return `mock-${JSON.stringify(record)}`;
        },
    }, 'mock://path/file.log');
    for (const record of records) {
        appender.append(record);
        expect(mockStreamWrite).toHaveBeenCalledWith(`mock-${JSON.stringify(record)}\n`);
    }
    expect(mockStreamWrite).toHaveBeenCalledTimes(records.length);
});
test('`dispose()` succeeds even if stream is not created.', async () => {
    const appender = new file_appender_1.FileAppender({ format: () => '' }, 'mock://path/file.log');
    await appender.dispose();
});
test('`dispose()` closes stream.', async () => {
    const mockStreamEndFinished = jest.fn();
    const mockStreamEnd = jest.fn(async (chunk, encoding, callback) => {
        // It's required to make sure `dispose` waits for `end` to complete.
        await tickMs(100);
        mockStreamEndFinished();
        callback();
    });
    file_appender_test_mocks_1.mockCreateWriteStream.mockReturnValue({
        end: mockStreamEnd,
        write: () => {
            // noop
        },
    });
    const appender = new file_appender_1.FileAppender({ format: () => '' }, 'mock://path/file.log');
    appender.append({
        context: 'context-1',
        level: log_level_1.LogLevel.All,
        message: 'message-1',
        timestamp: new Date(),
        pid: 5355,
    });
    await appender.dispose();
    expect(mockStreamEnd).toHaveBeenCalledTimes(1);
    expect(mockStreamEnd).toHaveBeenCalledWith(undefined, undefined, expect.any(Function));
    expect(mockStreamEndFinished).toHaveBeenCalled();
    // Consequent `dispose` calls should not fail even if stream has been disposed.
    await appender.dispose();
});
