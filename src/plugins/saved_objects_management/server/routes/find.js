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
const config_schema_1 = require("@kbn/config-schema");
const lib_1 = require("../lib");
exports.registerFindRoute = (router, managementServicePromise) => {
    router.get({
        path: '/api/kibana/management/saved_objects/_find',
        validate: {
            query: config_schema_1.schema.object({
                perPage: config_schema_1.schema.number({ min: 0, defaultValue: 20 }),
                page: config_schema_1.schema.number({ min: 0, defaultValue: 1 }),
                type: config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())]),
                search: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                defaultSearchOperator: config_schema_1.schema.oneOf([config_schema_1.schema.literal('OR'), config_schema_1.schema.literal('AND')], {
                    defaultValue: 'OR',
                }),
                sortField: config_schema_1.schema.maybe(config_schema_1.schema.string()),
                hasReference: config_schema_1.schema.maybe(config_schema_1.schema.object({
                    type: config_schema_1.schema.string(),
                    id: config_schema_1.schema.string(),
                })),
                fields: config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())], {
                    defaultValue: [],
                }),
            }),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const managementService = await managementServicePromise;
        const { client } = context.core.savedObjects;
        const searchTypes = Array.isArray(req.query.type) ? req.query.type : [req.query.type];
        const includedFields = Array.isArray(req.query.fields)
            ? req.query.fields
            : [req.query.fields];
        const importAndExportableTypes = searchTypes.filter(type => managementService.isImportAndExportable(type));
        const searchFields = new Set();
        importAndExportableTypes.forEach(type => {
            const searchField = managementService.getDefaultSearchField(type);
            if (searchField) {
                searchFields.add(searchField);
            }
        });
        const findResponse = await client.find({
            ...req.query,
            fields: undefined,
            searchFields: [...searchFields],
        });
        const enhancedSavedObjects = findResponse.saved_objects
            .map(so => lib_1.injectMetaAttributes(so, managementService))
            .map(obj => {
            const result = { ...obj, attributes: {} };
            for (const field of includedFields) {
                result.attributes[field] = obj.attributes[field];
            }
            return result;
        });
        return res.ok({
            body: {
                ...findResponse,
                saved_objects: enhancedSavedObjects,
            },
        });
    }));
};
