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
jest.mock('../../export', () => ({
    exportSavedObjectsToStream: jest.fn(),
}));
const exportMock = tslib_1.__importStar(require("../../export"));
const streams_1 = require("../../../../../legacy/utils/streams");
const supertest_1 = tslib_1.__importDefault(require("supertest"));
const export_1 = require("../export");
const test_utils_1 = require("./test_utils");
const exportSavedObjectsToStream = exportMock.exportSavedObjectsToStream;
const allowedTypes = ['index-pattern', 'search'];
const config = {
    maxImportPayloadBytes: 10485760,
    maxImportExportSize: 10000,
};
describe('POST /api/saved_objects/_export', () => {
    let server;
    let httpSetup;
    let handlerContext;
    beforeEach(async () => {
        ({ server, httpSetup, handlerContext } = await test_utils_1.setupServer());
        handlerContext.savedObjects.typeRegistry.getImportableAndExportableTypes.mockReturnValue(allowedTypes.map(test_utils_1.createExportableType));
        const router = httpSetup.createRouter('/api/saved_objects/');
        export_1.registerExportRoute(router, config);
        await server.start();
    });
    afterEach(async () => {
        jest.clearAllMocks();
        await server.stop();
    });
    it('formats successful response', async () => {
        const sortedObjects = [
            {
                id: '1',
                type: 'index-pattern',
                attributes: {},
                references: [],
            },
            {
                id: '2',
                type: 'search',
                attributes: {},
                references: [
                    {
                        name: 'ref_0',
                        type: 'index-pattern',
                        id: '1',
                    },
                ],
            },
        ];
        exportSavedObjectsToStream.mockResolvedValueOnce(streams_1.createListStream(sortedObjects));
        const result = await supertest_1.default(httpSetup.server.listener)
            .post('/api/saved_objects/_export')
            .send({
            type: 'search',
            search: 'my search string',
            includeReferencesDeep: true,
        });
        expect(result.status).toBe(200);
        expect(result.header).toEqual(expect.objectContaining({
            'content-disposition': 'attachment; filename="export.ndjson"',
            'content-type': 'application/ndjson',
        }));
        const objects = result.text.split('\n').map(row => JSON.parse(row));
        expect(objects).toEqual(sortedObjects);
        expect(exportSavedObjectsToStream.mock.calls[0][0]).toEqual(expect.objectContaining({
            excludeExportDetails: false,
            exportSizeLimit: 10000,
            includeReferencesDeep: true,
            objects: undefined,
            search: 'my search string',
            types: ['search'],
        }));
    });
});
