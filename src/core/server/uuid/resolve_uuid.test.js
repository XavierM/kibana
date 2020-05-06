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
const path_1 = require("path");
const fs_1 = require("./fs");
const resolve_uuid_1 = require("./resolve_uuid");
const config_service_mock_1 = require("../config/config_service.mock");
const logging_service_mock_1 = require("../logging/logging_service.mock");
const rxjs_1 = require("rxjs");
jest.mock('uuid', () => ({
    v4: () => 'NEW_UUID',
}));
jest.mock('./fs', () => ({
    readFile: jest.fn(() => Promise.resolve('')),
    writeFile: jest.fn(() => Promise.resolve('')),
}));
const DEFAULT_FILE_UUID = 'FILE_UUID';
const DEFAULT_CONFIG_UUID = 'CONFIG_UUID';
const fileNotFoundError = { code: 'ENOENT' };
const permissionError = { code: 'EACCES' };
const isDirectoryError = { code: 'EISDIR' };
const mockReadFile = ({ uuid = DEFAULT_FILE_UUID, error = null, }) => {
    fs_1.readFile.mockImplementation(() => {
        if (error) {
            return Promise.reject(error);
        }
        else {
            return Promise.resolve(uuid);
        }
    });
};
const mockWriteFile = (error) => {
    fs_1.writeFile.mockImplementation(() => {
        if (error) {
            return Promise.reject(error);
        }
        else {
            return Promise.resolve();
        }
    });
};
const getConfigService = (serverUuid) => {
    const configService = config_service_mock_1.configServiceMock.create();
    configService.atPath.mockImplementation(path => {
        if (path === 'path') {
            return new rxjs_1.BehaviorSubject({
                data: 'data-folder',
            });
        }
        if (path === 'server') {
            return new rxjs_1.BehaviorSubject({
                uuid: serverUuid,
            });
        }
        return new rxjs_1.BehaviorSubject({});
    });
    return configService;
};
describe('resolveInstanceUuid', () => {
    let configService;
    let logger;
    beforeEach(() => {
        jest.clearAllMocks();
        mockReadFile({ uuid: DEFAULT_FILE_UUID });
        mockWriteFile();
        configService = getConfigService(DEFAULT_CONFIG_UUID);
        logger = logging_service_mock_1.loggingServiceMock.create().get();
    });
    describe('when file is present and config property is set', () => {
        describe('when they mismatch', () => {
            describe('when syncToFile is true', () => {
                it('writes to file and returns the config uuid', async () => {
                    const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true });
                    expect(uuid).toEqual(DEFAULT_CONFIG_UUID);
                    expect(fs_1.writeFile).toHaveBeenCalledWith(path_1.join('data-folder', 'uuid'), DEFAULT_CONFIG_UUID, expect.any(Object));
                    expect(logger.debug).toHaveBeenCalledTimes(1);
                    expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
            Array [
              "Updating Kibana instance UUID to: CONFIG_UUID (was: FILE_UUID)",
            ]
          `);
                });
            });
            describe('when syncTofile is false', () => {
                it('does not write to file and returns the config uuid', async () => {
                    const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: false });
                    expect(uuid).toEqual(DEFAULT_CONFIG_UUID);
                    expect(fs_1.writeFile).not.toHaveBeenCalled();
                    expect(logger.debug).toHaveBeenCalledTimes(1);
                    expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
                      Array [
                        "Updating Kibana instance UUID to: CONFIG_UUID (was: FILE_UUID)",
                      ]
                  `);
                });
            });
        });
        describe('when they match', () => {
            it('does not write to file', async () => {
                mockReadFile({ uuid: DEFAULT_CONFIG_UUID });
                const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true });
                expect(uuid).toEqual(DEFAULT_CONFIG_UUID);
                expect(fs_1.writeFile).not.toHaveBeenCalled();
                expect(logger.debug).toHaveBeenCalledTimes(1);
                expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            "Kibana instance UUID: CONFIG_UUID",
          ]
        `);
            });
        });
    });
    describe('when file is not present and config property is set', () => {
        describe('when syncToFile is true', () => {
            it('writes the uuid to file and returns the config uuid', async () => {
                mockReadFile({ error: fileNotFoundError });
                const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true });
                expect(uuid).toEqual(DEFAULT_CONFIG_UUID);
                expect(fs_1.writeFile).toHaveBeenCalledWith(path_1.join('data-folder', 'uuid'), DEFAULT_CONFIG_UUID, expect.any(Object));
                expect(logger.debug).toHaveBeenCalledTimes(1);
                expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            "Setting new Kibana instance UUID: CONFIG_UUID",
          ]
        `);
            });
        });
        describe('when syncToFile is false', () => {
            it('does not write the uuid to file and returns the config uuid', async () => {
                mockReadFile({ error: fileNotFoundError });
                const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: false });
                expect(uuid).toEqual(DEFAULT_CONFIG_UUID);
                expect(fs_1.writeFile).not.toHaveBeenCalled();
                expect(logger.debug).toHaveBeenCalledTimes(1);
                expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            "Setting new Kibana instance UUID: CONFIG_UUID",
          ]
        `);
            });
        });
    });
    describe('when file is present and config property is not set', () => {
        it('does not write to file and returns the file uuid', async () => {
            configService = getConfigService(undefined);
            const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true });
            expect(uuid).toEqual(DEFAULT_FILE_UUID);
            expect(fs_1.writeFile).not.toHaveBeenCalled();
            expect(logger.debug).toHaveBeenCalledTimes(1);
            expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
        Array [
          "Resuming persistent Kibana instance UUID: FILE_UUID",
        ]
      `);
        });
    });
    describe('when file is present with 7.6.0 UUID', () => {
        describe('when config property is not set', () => {
            it('writes new uuid to file and returns new uuid', async () => {
                mockReadFile({ uuid: resolve_uuid_1.UUID_7_6_0_BUG });
                configService = getConfigService(undefined);
                const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true });
                expect(uuid).not.toEqual(resolve_uuid_1.UUID_7_6_0_BUG);
                expect(uuid).toEqual('NEW_UUID');
                expect(fs_1.writeFile).toHaveBeenCalledWith(path_1.join('data-folder', 'uuid'), 'NEW_UUID', expect.any(Object));
                expect(logger.debug).toHaveBeenCalledTimes(2);
                expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "UUID from 7.6.0 bug detected, ignoring file UUID",
            ],
            Array [
              "Setting new Kibana instance UUID: NEW_UUID",
            ],
          ]
        `);
            });
        });
        describe('when config property is set', () => {
            it('writes config uuid to file and returns config uuid', async () => {
                mockReadFile({ uuid: resolve_uuid_1.UUID_7_6_0_BUG });
                configService = getConfigService(DEFAULT_CONFIG_UUID);
                const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true });
                expect(uuid).not.toEqual(resolve_uuid_1.UUID_7_6_0_BUG);
                expect(uuid).toEqual(DEFAULT_CONFIG_UUID);
                expect(fs_1.writeFile).toHaveBeenCalledWith(path_1.join('data-folder', 'uuid'), DEFAULT_CONFIG_UUID, expect.any(Object));
                expect(logger.debug).toHaveBeenCalledTimes(2);
                expect(logger.debug.mock.calls).toMatchInlineSnapshot(`
          Array [
            Array [
              "UUID from 7.6.0 bug detected, ignoring file UUID",
            ],
            Array [
              "Setting new Kibana instance UUID: CONFIG_UUID",
            ],
          ]
        `);
            });
        });
    });
    describe('when file is not present and config property is not set', () => {
        describe('when syncToFile is true', () => {
            it('generates a new uuid and write it to file', async () => {
                configService = getConfigService(undefined);
                mockReadFile({ error: fileNotFoundError });
                const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true });
                expect(uuid).toEqual('NEW_UUID');
                expect(fs_1.writeFile).toHaveBeenCalledWith(path_1.join('data-folder', 'uuid'), 'NEW_UUID', expect.any(Object));
                expect(logger.debug).toHaveBeenCalledTimes(1);
                expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            "Setting new Kibana instance UUID: NEW_UUID",
          ]
        `);
            });
        });
        describe('when syncToFile is false', () => {
            it('generates a new uuid and does not write it to file', async () => {
                configService = getConfigService(undefined);
                mockReadFile({ error: fileNotFoundError });
                const uuid = await resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: false });
                expect(uuid).toEqual('NEW_UUID');
                expect(fs_1.writeFile).not.toHaveBeenCalled();
                expect(logger.debug).toHaveBeenCalledTimes(1);
                expect(logger.debug.mock.calls[0]).toMatchInlineSnapshot(`
          Array [
            "Setting new Kibana instance UUID: NEW_UUID",
          ]
        `);
            });
        });
    });
    describe('when file access error occurs', () => {
        it('throws an explicit error for file read errors', async () => {
            mockReadFile({ error: permissionError });
            await expect(resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true })).rejects.toThrowErrorMatchingInlineSnapshot(`"Unable to read Kibana UUID file, please check the uuid.server configuration value in kibana.yml and ensure Kibana has sufficient permissions to read / write to this file. Error was: EACCES"`);
        });
        it('throws an explicit error for file write errors', async () => {
            mockWriteFile(isDirectoryError);
            await expect(resolve_uuid_1.resolveInstanceUuid({ configService, logger, syncToFile: true })).rejects.toThrowErrorMatchingInlineSnapshot(`"Unable to write Kibana UUID file, please check the uuid.server configuration value in kibana.yml and ensure Kibana has sufficient permissions to read / write to this file. Error was: EISDIR"`);
        });
    });
});
