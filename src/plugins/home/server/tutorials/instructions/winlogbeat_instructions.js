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
const onprem_cloud_instructions_1 = require("./onprem_cloud_instructions");
const get_space_id_for_beats_tutorial_1 = require("./get_space_id_for_beats_tutorial");
const cloud_instructions_1 = require("./cloud_instructions");
exports.createWinlogbeatInstructions = (context) => ({
    INSTALL: {
        WINDOWS: {
            title: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.install.windowsTitle', {
                defaultMessage: 'Download and install Winlogbeat',
            }),
            textPre: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.install.windowsTextPre', {
                defaultMessage: 'First time using Winlogbeat? See the [Getting Started Guide]({winlogbeatLink}).\n\
 1. Download the Winlogbeat Windows zip file from the [Download]({elasticLink}) page.\n\
 2. Extract the contents of the zip file into {folderPath}.\n\
 3. Rename the {directoryName} directory to `Winlogbeat`.\n\
 4. Open a PowerShell prompt as an Administrator (right-click the PowerShell icon and select \
**Run As Administrator**). If you are running Windows XP, you might need to download and install PowerShell.\n\
 5. From the PowerShell prompt, run the following commands to install Winlogbeat as a Windows service.',
                values: {
                    directoryName: '`winlogbeat-{config.kibana.version}-windows`',
                    folderPath: '`C:\\Program Files`',
                    winlogbeatLink: '{config.docs.beats.winlogbeat}/winlogbeat-getting-started.html',
                    elasticLink: 'https://www.elastic.co/downloads/beats/winlogbeat',
                },
            }),
            commands: ['cd "C:\\Program Files\\Winlogbeat"', '.\\install-service-winlogbeat.ps1'],
            textPost: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.install.windowsTextPost', {
                defaultMessage: 'Modify the settings under `output.elasticsearch` in the {path} file to point to your Elasticsearch installation.',
                values: { path: '`C:\\Program Files\\Winlogbeat\\winlogbeat.yml`' },
            }),
        },
    },
    START: {
        WINDOWS: {
            title: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.start.windowsTitle', {
                defaultMessage: 'Start Winlogbeat',
            }),
            textPre: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.start.windowsTextPre', {
                defaultMessage: 'The `setup` command loads the Kibana dashboards. If the dashboards are already set up, omit this command.',
            }),
            commands: ['.\\winlogbeat.exe setup', 'Start-Service winlogbeat'],
        },
    },
    CONFIG: {
        WINDOWS: {
            title: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.config.windowsTitle', {
                defaultMessage: 'Edit the configuration',
            }),
            textPre: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.config.windowsTextPre', {
                defaultMessage: 'Modify {path} to set the connection information:',
                values: {
                    path: '`C:\\Program Files\\Winlogbeat\\winlogbeat.yml`',
                },
            }),
            commands: [
                'output.elasticsearch:',
                '  hosts: ["<es_url>"]',
                '  username: "elastic"',
                '  password: "<password>"',
                'setup.kibana:',
                '  host: "<kibana_url>"',
                get_space_id_for_beats_tutorial_1.getSpaceIdForBeatsTutorial(context),
            ],
            textPost: i18n_1.i18n.translate('home.tutorials.common.winlogbeatInstructions.config.windowsTextPost', {
                defaultMessage: 'Where {passwordTemplate} is the password of the `elastic` user, {esUrlTemplate} is the URL of Elasticsearch, \
and {kibanaUrlTemplate} is the URL of Kibana.',
                values: {
                    passwordTemplate: '`<password>`',
                    esUrlTemplate: '`<es_url>`',
                    kibanaUrlTemplate: '`<kibana_url>`',
                },
            }),
        },
    },
});
exports.createWinlogbeatCloudInstructions = () => ({
    CONFIG: {
        WINDOWS: {
            title: i18n_1.i18n.translate('home.tutorials.common.winlogbeatCloudInstructions.config.windowsTitle', {
                defaultMessage: 'Edit the configuration',
            }),
            textPre: i18n_1.i18n.translate('home.tutorials.common.winlogbeatCloudInstructions.config.windowsTextPre', {
                defaultMessage: 'Modify {path} to set the connection information for Elastic Cloud:',
                values: {
                    path: '`C:\\Program Files\\Winlogbeat\\winlogbeat.yml`',
                },
            }),
            commands: ['cloud.id: "{config.cloud.id}"', 'cloud.auth: "elastic:<password>"'],
            textPost: cloud_instructions_1.cloudPasswordAndResetLink,
        },
    },
});
function winlogbeatStatusCheck() {
    return {
        title: i18n_1.i18n.translate('home.tutorials.common.winlogbeatStatusCheck.title', {
            defaultMessage: 'Module status',
        }),
        text: i18n_1.i18n.translate('home.tutorials.common.winlogbeatStatusCheck.text', {
            defaultMessage: 'Check that data is received from Winlogbeat',
        }),
        btnLabel: i18n_1.i18n.translate('home.tutorials.common.winlogbeatStatusCheck.buttonLabel', {
            defaultMessage: 'Check data',
        }),
        success: i18n_1.i18n.translate('home.tutorials.common.winlogbeatStatusCheck.successText', {
            defaultMessage: 'Data successfully received',
        }),
        error: i18n_1.i18n.translate('home.tutorials.common.winlogbeatStatusCheck.errorText', {
            defaultMessage: 'No data has been received yet',
        }),
        esHitsCheck: {
            index: 'winlogbeat-*',
            query: {
                bool: {
                    filter: {
                        term: {
                            'agent.type': 'winlogbeat',
                        },
                    },
                },
            },
        },
    };
}
exports.winlogbeatStatusCheck = winlogbeatStatusCheck;
function onPremInstructions(context) {
    const WINLOGBEAT_INSTRUCTIONS = exports.createWinlogbeatInstructions(context);
    return {
        instructionSets: [
            {
                title: i18n_1.i18n.translate('home.tutorials.common.winlogbeat.premInstructions.gettingStarted.title', {
                    defaultMessage: 'Getting Started',
                }),
                instructionVariants: [
                    {
                        id: instruction_variant_1.INSTRUCTION_VARIANT.WINDOWS,
                        instructions: [
                            WINLOGBEAT_INSTRUCTIONS.INSTALL.WINDOWS,
                            WINLOGBEAT_INSTRUCTIONS.CONFIG.WINDOWS,
                            WINLOGBEAT_INSTRUCTIONS.START.WINDOWS,
                        ],
                    },
                ],
                statusCheck: winlogbeatStatusCheck(),
            },
        ],
    };
}
exports.onPremInstructions = onPremInstructions;
function onPremCloudInstructions() {
    const TRYCLOUD_OPTION1 = onprem_cloud_instructions_1.createTrycloudOption1();
    const TRYCLOUD_OPTION2 = onprem_cloud_instructions_1.createTrycloudOption2();
    const WINLOGBEAT_INSTRUCTIONS = exports.createWinlogbeatInstructions();
    return {
        instructionSets: [
            {
                title: i18n_1.i18n.translate('home.tutorials.common.winlogbeat.premCloudInstructions.gettingStarted.title', {
                    defaultMessage: 'Getting Started',
                }),
                instructionVariants: [
                    {
                        id: instruction_variant_1.INSTRUCTION_VARIANT.WINDOWS,
                        instructions: [
                            TRYCLOUD_OPTION1,
                            TRYCLOUD_OPTION2,
                            WINLOGBEAT_INSTRUCTIONS.INSTALL.WINDOWS,
                            WINLOGBEAT_INSTRUCTIONS.CONFIG.WINDOWS,
                            WINLOGBEAT_INSTRUCTIONS.START.WINDOWS,
                        ],
                    },
                ],
                statusCheck: winlogbeatStatusCheck(),
            },
        ],
    };
}
exports.onPremCloudInstructions = onPremCloudInstructions;
function cloudInstructions() {
    const WINLOGBEAT_INSTRUCTIONS = exports.createWinlogbeatInstructions();
    const WINLOGBEAT_CLOUD_INSTRUCTIONS = exports.createWinlogbeatCloudInstructions();
    return {
        instructionSets: [
            {
                title: i18n_1.i18n.translate('home.tutorials.common.winlogbeat.cloudInstructions.gettingStarted.title', {
                    defaultMessage: 'Getting Started',
                }),
                instructionVariants: [
                    {
                        id: instruction_variant_1.INSTRUCTION_VARIANT.WINDOWS,
                        instructions: [
                            WINLOGBEAT_INSTRUCTIONS.INSTALL.WINDOWS,
                            WINLOGBEAT_CLOUD_INSTRUCTIONS.CONFIG.WINDOWS,
                            WINLOGBEAT_INSTRUCTIONS.START.WINDOWS,
                        ],
                    },
                ],
                statusCheck: winlogbeatStatusCheck(),
            },
        ],
    };
}
exports.cloudInstructions = cloudInstructions;
