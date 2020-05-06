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
const dev_utils_1 = require("@kbn/dev-utils");
const npm_1 = require("../npm");
const config_1 = require("./config");
const valid_1 = require("./valid");
const constants_1 = require("../constants");
dev_utils_1.run(async ({ log, flags }) => {
    const packages = await npm_1.getInstalledPackages({
        directory: constants_1.REPO_ROOT,
        licenseOverrides: config_1.LICENSE_OVERRIDES,
        includeDev: !!flags.dev,
    });
    // Assert if the found licenses in the production
    // packages are valid
    valid_1.assertLicensesValid({
        packages: packages.filter(pkg => !pkg.isDevOnly),
        validLicenses: config_1.LICENSE_WHITELIST,
    });
    log.success('All production dependency licenses are allowed');
    // Do the same as above for the packages only used in development
    // if the dev flag is found
    if (flags.dev) {
        valid_1.assertLicensesValid({
            packages: packages.filter(pkg => pkg.isDevOnly),
            validLicenses: config_1.LICENSE_WHITELIST.concat(config_1.DEV_ONLY_LICENSE_WHITELIST),
        });
        log.success('All development dependency licenses are allowed');
    }
}, {
    flags: {
        boolean: ['dev'],
        help: `
        --dev              Also check dev dependencies
      `,
    },
});
