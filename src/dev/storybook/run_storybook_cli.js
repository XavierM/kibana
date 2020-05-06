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
const dev_utils_1 = require("@kbn/dev-utils");
const dev_utils_2 = require("@kbn/dev-utils");
const aliases_1 = require("./aliases");
const clean_1 = require("./commands/clean");
dev_utils_1.run(async (params) => {
    const { flags, log } = params;
    const { _: [alias], } = flags;
    if (flags.verbose) {
        log.verbose('Flags:', flags);
    }
    if (flags.clean) {
        await clean_1.clean({ log });
        return;
    }
    if (!alias) {
        throw dev_utils_1.createFlagError('missing alias');
    }
    if (!aliases_1.storybookAliases.hasOwnProperty(alias)) {
        throw dev_utils_1.createFlagError(`unknown alias [${alias}]`);
    }
    const relative = aliases_1.storybookAliases[alias];
    const absolute = path_1.join(dev_utils_2.REPO_ROOT, relative);
    log.verbose('Loading Storybook:', absolute);
    process.chdir(path_1.join(absolute, '..', '..'));
    require(absolute);
}, {
    usage: `node scripts/storybook <alias>`,
    description: `
      Start a 📕 Storybook for a plugin

      Available aliases:
        ${Object.keys(aliases_1.storybookAliases)
        .map(alias => `📕 ${alias}`)
        .join('\n        ')}

      Add your alias in src/dev/storybook/aliases.ts
    `,
    flags: {
        default: {},
        string: [],
        boolean: ['clean', 'site'],
        help: `
      --clean            Clean Storybook build folder.
      --site             Build static version of Storybook.
    `,
    },
});
