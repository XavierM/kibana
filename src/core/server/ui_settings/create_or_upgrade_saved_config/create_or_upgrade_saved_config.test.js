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
const chance_1 = tslib_1.__importDefault(require("chance"));
const saved_objects_1 = require("../../saved_objects");
const saved_objects_client_mock_1 = require("../../saved_objects/service/saved_objects_client.mock");
const logging_service_mock_1 = require("../../logging/logging_service.mock");
const get_upgradeable_config_test_mock_1 = require("./get_upgradeable_config.test.mock");
const create_or_upgrade_saved_config_1 = require("./create_or_upgrade_saved_config");
const chance = new chance_1.default();
describe('uiSettings/createOrUpgradeSavedConfig', function () {
    afterEach(() => jest.resetAllMocks());
    const version = '4.0.1';
    const prevVersion = '4.0.0';
    const buildNum = chance.integer({ min: 1000, max: 5000 });
    function setup() {
        const logger = logging_service_mock_1.loggingServiceMock.create();
        const getUpgradeableConfig = get_upgradeable_config_test_mock_1.getUpgradeableConfigMock;
        const savedObjectsClient = saved_objects_client_mock_1.savedObjectsClientMock.create();
        savedObjectsClient.create.mockImplementation(async (type, attributes, options = {}) => ({
            type,
            id: options.id,
            version: 'foo',
        }));
        async function run(options = {}) {
            const resp = await create_or_upgrade_saved_config_1.createOrUpgradeSavedConfig({
                savedObjectsClient,
                version,
                buildNum,
                log: logger.get(),
                handleWriteErrors: false,
                ...options,
            });
            expect(get_upgradeable_config_test_mock_1.getUpgradeableConfigMock).toHaveBeenCalledTimes(1);
            expect(getUpgradeableConfig).toHaveBeenCalledWith({ savedObjectsClient, version });
            return resp;
        }
        return {
            buildNum,
            logger,
            run,
            version,
            savedObjectsClient,
            getUpgradeableConfig,
        };
    }
    describe('nothing is upgradeable', function () {
        it('should create config with current version and buildNum', async () => {
            const { run, savedObjectsClient } = setup();
            await run();
            expect(savedObjectsClient.create).toHaveBeenCalledTimes(1);
            expect(savedObjectsClient.create).toHaveBeenCalledWith('config', {
                buildNum,
            }, {
                id: version,
            });
        });
    });
    describe('something is upgradeable', () => {
        it('should merge upgraded attributes with current build number in new config', async () => {
            const { run, getUpgradeableConfig, savedObjectsClient } = setup();
            const savedAttributes = {
                buildNum: buildNum - 100,
                [chance.word()]: chance.sentence(),
                [chance.word()]: chance.sentence(),
                [chance.word()]: chance.sentence(),
            };
            getUpgradeableConfig.mockResolvedValue({
                id: prevVersion,
                attributes: savedAttributes,
                type: '',
                references: [],
            });
            await run();
            expect(getUpgradeableConfig).toHaveBeenCalledTimes(1);
            expect(savedObjectsClient.create).toHaveBeenCalledTimes(1);
            expect(savedObjectsClient.create).toHaveBeenCalledWith('config', {
                ...savedAttributes,
                buildNum,
            }, {
                id: version,
            });
        });
        it('should log a message for upgrades', async () => {
            const { getUpgradeableConfig, logger, run } = setup();
            getUpgradeableConfig.mockResolvedValue({
                id: prevVersion,
                attributes: { buildNum: buildNum - 100 },
                type: '',
                references: [],
            });
            await run();
            expect(logging_service_mock_1.loggingServiceMock.collect(logger).debug).toMatchInlineSnapshot(`
        Array [
          Array [
            "Upgrade config from 4.0.0 to 4.0.1",
            Object {
              "newVersion": "4.0.1",
              "prevVersion": "4.0.0",
            },
          ],
        ]
      `);
        });
        it('does not log when upgrade fails', async () => {
            const { getUpgradeableConfig, logger, run, savedObjectsClient } = setup();
            getUpgradeableConfig.mockResolvedValue({
                id: prevVersion,
                attributes: { buildNum: buildNum - 100 },
                type: '',
                references: [],
            });
            savedObjectsClient.create.mockRejectedValue(new Error('foo'));
            try {
                await run();
                throw new Error('Expected run() to throw an error');
            }
            catch (error) {
                expect(error.message).toBe('foo');
            }
            expect(logging_service_mock_1.loggingServiceMock.collect(logger).debug).toHaveLength(0);
        });
    });
    describe('handleWriteErrors', () => {
        describe('handleWriteErrors: false', () => {
            it('throws write errors', async () => {
                const { run, savedObjectsClient } = setup();
                const error = new Error('foo');
                savedObjectsClient.create.mockRejectedValue(error);
                await expect(run({ handleWriteErrors: false })).rejects.toThrowError(error);
            });
        });
        describe('handleWriteErrors:true', () => {
            it('returns undefined for ConflictError', async () => {
                const { run, savedObjectsClient } = setup();
                const error = new Error('foo');
                savedObjectsClient.create.mockRejectedValue(saved_objects_1.SavedObjectsErrorHelpers.decorateConflictError(error));
                expect(await run({ handleWriteErrors: true })).toBe(undefined);
            });
            it('returns config attributes for NotAuthorizedError', async () => {
                const { run, savedObjectsClient } = setup();
                const error = new Error('foo');
                savedObjectsClient.create.mockRejectedValue(saved_objects_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(error));
                expect(await run({ handleWriteErrors: true })).toEqual({
                    buildNum,
                });
            });
            it('returns config attributes for ForbiddenError', async () => {
                const { run, savedObjectsClient } = setup();
                const error = new Error('foo');
                savedObjectsClient.create.mockRejectedValue(saved_objects_1.SavedObjectsErrorHelpers.decorateForbiddenError(error));
                expect(await run({ handleWriteErrors: true })).toEqual({
                    buildNum,
                });
            });
            it('throws error for other SavedObjects exceptions', async () => {
                const { run, savedObjectsClient } = setup();
                const error = new Error('foo');
                savedObjectsClient.create.mockRejectedValue(saved_objects_1.SavedObjectsErrorHelpers.decorateGeneralError(error));
                await expect(run({ handleWriteErrors: true })).rejects.toThrowError(error);
            });
            it('throws error for all other exceptions', async () => {
                const { run, savedObjectsClient } = setup();
                const error = new Error('foo');
                savedObjectsClient.create.mockRejectedValue(error);
                await expect(run({ handleWriteErrors: true })).rejects.toThrowError(error);
            });
        });
    });
});
