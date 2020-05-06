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
const integrate_locale_files_test_mocks_1 = require("./integrate_locale_files.test.mocks");
const path_1 = tslib_1.__importDefault(require("path"));
const integrate_locale_files_1 = require("./integrate_locale_files");
// @ts-ignore
const utils_1 = require("./utils");
const localePath = path_1.default.resolve(__dirname, '__fixtures__', 'integrate_locale_files', 'fr.json');
const mockDefaultMessagesMap = new Map([
    ['plugin-1.message-id-1', { message: 'Message text 1' }],
    ['plugin-1.message-id-2', { message: 'Message text 2' }],
    ['plugin-2.message-id', { message: 'Message text' }],
]);
const defaultIntegrateOptions = {
    sourceFileName: localePath,
    dryRun: false,
    ignoreIncompatible: false,
    ignoreMissing: false,
    ignoreUnused: false,
    config: {
        paths: {
            'plugin-1': ['src/dev/i18n/__fixtures__/integrate_locale_files/test_plugin_1'],
            'plugin-2': ['src/dev/i18n/__fixtures__/integrate_locale_files/test_plugin_2'],
        },
        exclude: [],
        translations: [],
    },
    log: { success: jest.fn(), warning: jest.fn() },
};
describe('dev/i18n/integrate_locale_files', () => {
    describe('verifyMessages', () => {
        test('validates localized messages', () => {
            const localizedMessagesMap = new Map([
                ['plugin-1.message-id-1', 'Translated text 1'],
                ['plugin-1.message-id-2', 'Translated text 2'],
                ['plugin-2.message-id', 'Translated text'],
            ]);
            expect(() => integrate_locale_files_1.verifyMessages(localizedMessagesMap, mockDefaultMessagesMap, defaultIntegrateOptions)).not.toThrow();
        });
        test('throws an error for unused id, missing id or the incompatible ones', () => {
            const localizedMessagesMapWithMissingMessage = new Map([
                ['plugin-1.message-id-1', 'Translated text 1'],
                ['plugin-2.message-id', 'Translated text'],
            ]);
            const localizedMessagesMapWithUnusedMessage = new Map([
                ['plugin-1.message-id-1', 'Translated text 1'],
                ['plugin-1.message-id-2', 'Translated text 2'],
                ['plugin-1.message-id-3', 'Translated text 3'],
                ['plugin-2.message-id', 'Translated text'],
            ]);
            const localizedMessagesMapWithIdTypo = new Map([
                ['plugin-1.message-id-1', 'Message text 1'],
                ['plugin-1.message-id-2', 'Message text 2'],
                ['plugin-2.message', 'Message text'],
            ]);
            const localizedMessagesMapWithUnknownValues = new Map([
                ['plugin-1.message-id-1', 'Translated text 1'],
                ['plugin-1.message-id-2', 'Translated text 2 with some unknown {value}'],
                ['plugin-2.message-id', 'Translated text'],
            ]);
            expect(() => integrate_locale_files_1.verifyMessages(localizedMessagesMapWithMissingMessage, mockDefaultMessagesMap, defaultIntegrateOptions)).toThrowErrorMatchingSnapshot();
            expect(() => integrate_locale_files_1.verifyMessages(localizedMessagesMapWithUnusedMessage, mockDefaultMessagesMap, defaultIntegrateOptions)).toThrowErrorMatchingSnapshot();
            expect(() => integrate_locale_files_1.verifyMessages(localizedMessagesMapWithIdTypo, mockDefaultMessagesMap, defaultIntegrateOptions)).toThrowErrorMatchingSnapshot();
            expect(() => integrate_locale_files_1.verifyMessages(localizedMessagesMapWithUnknownValues, mockDefaultMessagesMap, defaultIntegrateOptions)).toThrowErrorMatchingSnapshot();
        });
        test('removes unused ids if `ignoreUnused` is set', () => {
            const localizedMessagesMapWithUnusedMessage = new Map([
                ['plugin-1.message-id-1', 'Translated text 1'],
                ['plugin-1.message-id-2', 'Translated text 2'],
                ['plugin-1.message-id-3', 'Some old translated text 3'],
                ['plugin-2.message-id', 'Translated text'],
                ['plugin-2.message', 'Some old translated text'],
            ]);
            integrate_locale_files_1.verifyMessages(localizedMessagesMapWithUnusedMessage, mockDefaultMessagesMap, {
                ...defaultIntegrateOptions,
                ignoreUnused: true,
            });
            expect(localizedMessagesMapWithUnusedMessage).toMatchInlineSnapshot(`
Map {
  "plugin-1.message-id-1" => "Translated text 1",
  "plugin-1.message-id-2" => "Translated text 2",
  "plugin-2.message-id" => "Translated text",
}
`);
        });
        test('removes ids with incompatible ICU structure if `ignoreIncompatible` is set', () => {
            const localizedMessagesMapWithIncompatibleMessage = new Map([
                ['plugin-1.message-id-1', 'Translated text 1'],
                ['plugin-1.message-id-2', 'Translated text 2 with some unknown {value}'],
                ['plugin-2.message-id', 'Translated text'],
            ]);
            integrate_locale_files_1.verifyMessages(localizedMessagesMapWithIncompatibleMessage, mockDefaultMessagesMap, {
                ...defaultIntegrateOptions,
                ignoreIncompatible: true,
            });
            expect(localizedMessagesMapWithIncompatibleMessage).toMatchInlineSnapshot(`
Map {
  "plugin-1.message-id-1" => "Translated text 1",
  "plugin-2.message-id" => "Translated text",
}
`);
        });
    });
    describe('integrateLocaleFiles', () => {
        test('splits locale file by plugins and writes them into the right folders', async () => {
            await integrate_locale_files_1.integrateLocaleFiles(mockDefaultMessagesMap, defaultIntegrateOptions);
            const [[path1, json1], [path2, json2]] = integrate_locale_files_test_mocks_1.mockWriteFileAsync.mock.calls;
            const [[dirPath1], [dirPath2]] = integrate_locale_files_test_mocks_1.mockMakeDirAsync.mock.calls;
            expect([utils_1.normalizePath(path1), json1]).toMatchSnapshot();
            expect([utils_1.normalizePath(path2), json2]).toMatchSnapshot();
            expect([utils_1.normalizePath(dirPath1), utils_1.normalizePath(dirPath2)]).toMatchSnapshot();
        });
    });
});
