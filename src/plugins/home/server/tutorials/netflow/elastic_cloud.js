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
const i18n_1 = require("@kbn/i18n");
const instruction_variant_1 = require("../../../common/instruction_variant");
const logstash_instructions_1 = require("../instructions/logstash_instructions");
const common_instructions_1 = require("./common_instructions");
// TODO: compare with onPremElasticCloud and onPrem scenarios and extract out common bits
function createElasticCloudInstructions() {
    const COMMON_NETFLOW_INSTRUCTIONS = common_instructions_1.createCommonNetflowInstructions();
    const LOGSTASH_INSTRUCTIONS = logstash_instructions_1.createLogstashInstructions();
    return {
        instructionSets: [
            {
                title: i18n_1.i18n.translate('home.tutorials.netflow.elasticCloudInstructions.title', {
                    defaultMessage: 'Getting Started',
                }),
                instructionVariants: [
                    {
                        id: instruction_variant_1.INSTRUCTION_VARIANT.OSX,
                        instructions: [
                            ...LOGSTASH_INSTRUCTIONS.INSTALL.OSX,
                            ...COMMON_NETFLOW_INSTRUCTIONS.CONFIG.ELASTIC_CLOUD.OSX,
                            ...COMMON_NETFLOW_INSTRUCTIONS.SETUP.OSX,
                        ],
                    },
                    {
                        id: instruction_variant_1.INSTRUCTION_VARIANT.WINDOWS,
                        instructions: [
                            ...LOGSTASH_INSTRUCTIONS.INSTALL.WINDOWS,
                            ...COMMON_NETFLOW_INSTRUCTIONS.CONFIG.ELASTIC_CLOUD.WINDOWS,
                            ...COMMON_NETFLOW_INSTRUCTIONS.SETUP.WINDOWS,
                        ],
                    },
                ],
            },
        ],
    };
}
exports.createElasticCloudInstructions = createElasticCloudInstructions;
