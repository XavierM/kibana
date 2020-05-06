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
const fs_1 = require("fs");
const path_1 = require("path");
const os_1 = require("os");
const telemetry_usage_collector_1 = require("./telemetry_usage_collector");
const mockUsageCollector = () => ({
    makeUsageCollector: jest.fn().mockImplementationOnce((arg) => arg),
});
describe('telemetry_usage_collector', () => {
    const tempDir = os_1.tmpdir();
    const tempFiles = {
        blank: path_1.resolve(tempDir, 'tests-telemetry_usage_collector-blank.yml'),
        empty: path_1.resolve(tempDir, 'tests-telemetry_usage_collector-empty.yml'),
        too_big: path_1.resolve(tempDir, 'tests-telemetry_usage_collector-too_big.yml'),
        unreadable: path_1.resolve(tempDir, 'tests-telemetry_usage_collector-unreadable.yml'),
        valid: path_1.resolve(tempDir, 'telemetry.yml'),
    };
    const invalidFiles = [tempFiles.too_big, tempFiles.unreadable];
    const validFiles = [tempFiles.blank, tempFiles.empty, tempFiles.valid];
    const allFiles = Object.values(tempFiles);
    const expectedObject = {
        expected: 'value',
        more: {
            nested: {
                one: 1,
                two: 2,
            },
        },
    };
    // create temp files
    beforeAll(() => {
        // blank
        fs_1.writeFileSync(tempFiles.blank, '\n');
        // empty
        fs_1.writeFileSync(tempFiles.empty, '');
        // 1 byte too big
        fs_1.writeFileSync(tempFiles.too_big, Buffer.alloc(telemetry_usage_collector_1.MAX_FILE_SIZE + 1));
        // write-only file
        fs_1.writeFileSync(tempFiles.unreadable, 'valid: true', { mode: 0o222 });
        // valid
        fs_1.writeFileSync(tempFiles.valid, 'expected: value\nmore.nested.one: 1\nmore.nested.two: 2');
    });
    // delete temp files
    afterAll(() => {
        allFiles.forEach(path => {
            try {
                fs_1.unlinkSync(path);
            }
            catch (err) {
                // ignored
            }
        });
    });
    describe('isFileReadable', () => {
        test('returns `undefined` no file is readable', async () => {
            expect(telemetry_usage_collector_1.isFileReadable('')).toBe(false);
            invalidFiles.forEach(path => {
                expect(telemetry_usage_collector_1.isFileReadable(path)).toBe(false);
            });
        });
        test('returns `true` file that has valid data', async () => {
            expect(allFiles.filter(telemetry_usage_collector_1.isFileReadable)).toEqual(validFiles);
        });
    });
    describe('readTelemetryFile', () => {
        test('returns `undefined` if no path was found', async () => {
            expect(await telemetry_usage_collector_1.readTelemetryFile('')).toBeUndefined();
            for (const invalidFile of invalidFiles) {
                expect(await telemetry_usage_collector_1.readTelemetryFile(invalidFile)).toBeUndefined();
            }
        });
        test('returns `undefined` if the file is blank or empty', async () => {
            expect(await telemetry_usage_collector_1.readTelemetryFile(tempFiles.blank)).toBeUndefined();
            expect(await telemetry_usage_collector_1.readTelemetryFile(tempFiles.empty)).toBeUndefined();
        });
        test('returns the object parsed from the YAML file', async () => {
            expect(await telemetry_usage_collector_1.readTelemetryFile(tempFiles.valid)).toEqual(expectedObject);
        });
    });
    describe('createTelemetryUsageCollector', () => {
        test('calls `makeUsageCollector`', async () => {
            // note: it uses the file's path to get the directory, then looks for 'telemetry.yml'
            // exclusively, which is indirectly tested by passing it the wrong "file" in the same
            // dir
            // the `makeUsageCollector` is mocked above to return the argument passed to it
            const usageCollector = mockUsageCollector();
            const collectorOptions = telemetry_usage_collector_1.createTelemetryUsageCollector(usageCollector, async () => tempFiles.unreadable);
            expect(collectorOptions.type).toBe('static_telemetry');
            expect(await collectorOptions.fetch({})).toEqual(expectedObject); // Sending any as the callCluster client because it's not needed in this collector but TS requires it when calling it.
        });
    });
});
