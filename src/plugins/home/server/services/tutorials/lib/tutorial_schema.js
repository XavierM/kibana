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
const joi_1 = tslib_1.__importDefault(require("joi"));
const PARAM_TYPES = {
    NUMBER: 'number',
    STRING: 'string',
};
const TUTORIAL_CATEGORY = {
    LOGGING: 'logging',
    SIEM: 'siem',
    METRICS: 'metrics',
    OTHER: 'other',
};
const dashboardSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    linkLabel: joi_1.default.string().when('isOverview', {
        is: true,
        then: joi_1.default.required(),
    }),
    // Is this an Overview / Entry Point dashboard?
    isOverview: joi_1.default.boolean().required(),
});
const artifactsSchema = joi_1.default.object({
    // Fields present in Elasticsearch documents created by this product.
    exportedFields: joi_1.default.object({
        documentationUrl: joi_1.default.string().required(),
    }),
    // Kibana dashboards created by this product.
    dashboards: joi_1.default.array()
        .items(dashboardSchema)
        .required(),
    application: joi_1.default.object({
        path: joi_1.default.string().required(),
        label: joi_1.default.string().required(),
    }),
});
const statusCheckSchema = joi_1.default.object({
    title: joi_1.default.string(),
    text: joi_1.default.string(),
    btnLabel: joi_1.default.string(),
    success: joi_1.default.string(),
    error: joi_1.default.string(),
    esHitsCheck: joi_1.default.object({
        index: joi_1.default.alternatives()
            .try(joi_1.default.string(), joi_1.default.array().items(joi_1.default.string()))
            .required(),
        query: joi_1.default.object().required(),
    }).required(),
});
const instructionSchema = joi_1.default.object({
    title: joi_1.default.string(),
    textPre: joi_1.default.string(),
    commands: joi_1.default.array().items(joi_1.default.string().allow('')),
    textPost: joi_1.default.string(),
});
const instructionVariantSchema = joi_1.default.object({
    id: joi_1.default.string().required(),
    instructions: joi_1.default.array()
        .items(instructionSchema)
        .required(),
});
const instructionSetSchema = joi_1.default.object({
    title: joi_1.default.string(),
    callOut: joi_1.default.object({
        title: joi_1.default.string().required(),
        message: joi_1.default.string(),
        iconType: joi_1.default.string(),
    }),
    // Variants (OSes, languages, etc.) for which tutorial instructions are specified.
    instructionVariants: joi_1.default.array()
        .items(instructionVariantSchema)
        .required(),
    statusCheck: statusCheckSchema,
});
const paramSchema = joi_1.default.object({
    defaultValue: joi_1.default.required(),
    id: joi_1.default.string()
        .regex(/^[a-zA-Z_]+$/)
        .required(),
    label: joi_1.default.string().required(),
    type: joi_1.default.string()
        .valid(Object.values(PARAM_TYPES))
        .required(),
});
const instructionsSchema = joi_1.default.object({
    instructionSets: joi_1.default.array()
        .items(instructionSetSchema)
        .required(),
    params: joi_1.default.array().items(paramSchema),
});
exports.tutorialSchema = {
    id: joi_1.default.string()
        .regex(/^[a-zA-Z0-9-]+$/)
        .required(),
    category: joi_1.default.string()
        .valid(Object.values(TUTORIAL_CATEGORY))
        .required(),
    name: joi_1.default.string().required(),
    isBeta: joi_1.default.boolean().default(false),
    shortDescription: joi_1.default.string().required(),
    euiIconType: joi_1.default.string(),
    longDescription: joi_1.default.string().required(),
    completionTimeMinutes: joi_1.default.number().integer(),
    previewImagePath: joi_1.default.string(),
    // kibana and elastic cluster running on prem
    onPrem: instructionsSchema.required(),
    // kibana and elastic cluster running in elastic's cloud
    elasticCloud: instructionsSchema,
    // kibana running on prem and elastic cluster running in elastic's cloud
    onPremElasticCloud: instructionsSchema,
    // Elastic stack artifacts produced by product when it is setup and run.
    artifacts: artifactsSchema,
    // saved objects used by data module.
    savedObjects: joi_1.default.array().items(),
    savedObjectsInstallMsg: joi_1.default.string(),
};
