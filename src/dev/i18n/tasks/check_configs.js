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
const constants_1 = require("../constants");
const __1 = require("..");
function checkConfigs(additionalConfigPaths = []) {
    const root = path_1.join(__dirname, '../../../../');
    const kibanaRC = path_1.resolve(root, constants_1.I18N_RC);
    const xpackRC = path_1.resolve(root, 'x-pack', constants_1.I18N_RC);
    const configPaths = [kibanaRC, xpackRC, ...__1.arrayify(additionalConfigPaths)];
    return configPaths.map(configPath => ({
        task: async (context) => {
            try {
                await __1.checkConfigNamespacePrefix(configPath);
            }
            catch (err) {
                const { reporter } = context;
                const reporterWithContext = reporter.withContext({ name: configPath });
                reporterWithContext.report(err);
                throw reporter;
            }
        },
        title: `Checking configs in ${configPath}`,
    }));
}
exports.checkConfigs = checkConfigs;
