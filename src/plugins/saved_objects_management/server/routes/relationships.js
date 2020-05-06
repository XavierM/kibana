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
exports.registerRelationshipsRoute = (router, managementServicePromise) => {
    router.get({
        path: '/api/kibana/management/saved_objects/relationships/{type}/{id}',
        validate: {
            params: config_schema_1.schema.object({
                type: config_schema_1.schema.string(),
                id: config_schema_1.schema.string(),
            }),
            query: config_schema_1.schema.object({
                size: config_schema_1.schema.number({ defaultValue: 10000 }),
                savedObjectTypes: config_schema_1.schema.oneOf([config_schema_1.schema.string(), config_schema_1.schema.arrayOf(config_schema_1.schema.string())]),
            }),
        },
    }, router.handleLegacyErrors(async (context, req, res) => {
        const managementService = await managementServicePromise;
        const { client } = context.core.savedObjects;
        const { type, id } = req.params;
        const { size } = req.query;
        const savedObjectTypes = Array.isArray(req.query.savedObjectTypes)
            ? req.query.savedObjectTypes
            : [req.query.savedObjectTypes];
        const relations = await lib_1.findRelationships({
            type,
            id,
            client,
            size,
            referenceTypes: savedObjectTypes,
            savedObjectsManagement: managementService,
        });
        return res.ok({
            body: relations,
        });
    }));
};
