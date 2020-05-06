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
const lodash_1 = require("lodash");
const installed_packages_1 = require("../installed_packages");
const constants_1 = require("../../constants");
const FIXTURE1_ROOT = path_1.resolve(__dirname, '__fixtures__/fixture1');
describe('src/dev/npm/installed_packages', () => {
    describe('getInstalledPackages()', function () {
        let kibanaPackages;
        let fixture1Packages;
        beforeAll(async function () {
            [kibanaPackages, fixture1Packages] = await Promise.all([
                installed_packages_1.getInstalledPackages({
                    directory: constants_1.REPO_ROOT,
                }),
                installed_packages_1.getInstalledPackages({
                    directory: FIXTURE1_ROOT,
                    includeDev: true,
                }),
            ]);
        }, 360 * 1000);
        it('reads all installed packages of a module', () => {
            expect(fixture1Packages).toEqual([
                {
                    name: 'dep1',
                    version: '0.0.2',
                    licenses: ['Apache-2.0'],
                    repository: 'https://github.com/mycorp/dep1',
                    directory: path_1.resolve(FIXTURE1_ROOT, 'node_modules/dep1'),
                    relative: ['node_modules', 'dep1'].join(path_1.sep),
                    isDevOnly: false,
                },
                {
                    name: 'privatedep',
                    version: '0.0.2',
                    repository: 'https://github.com/mycorp/privatedep',
                    licenses: ['Apache-2.0'],
                    directory: path_1.resolve(FIXTURE1_ROOT, 'node_modules/privatedep'),
                    relative: ['node_modules', 'privatedep'].join(path_1.sep),
                    isDevOnly: false,
                },
                {
                    name: 'dep2',
                    version: '0.0.2',
                    licenses: ['Apache-2.0'],
                    repository: 'https://github.com/mycorp/dep2',
                    directory: path_1.resolve(FIXTURE1_ROOT, 'node_modules/dep2'),
                    relative: ['node_modules', 'dep2'].join(path_1.sep),
                    isDevOnly: true,
                },
            ]);
        });
        it('returns a single entry for every package/version combo', () => {
            const tags = kibanaPackages.map(pkg => `${pkg.name}@${pkg.version}`);
            expect(tags).toEqual(lodash_1.uniq(tags));
        });
        it('does not include root package in the list', () => {
            if (kibanaPackages.find(pkg => pkg.name === 'kibana')) {
                throw new Error('Expected getInstalledPackages(kibana) to not include kibana pkg');
            }
            if (fixture1Packages.find(pkg => pkg.name === 'fixture1')) {
                throw new Error('Expected getInstalledPackages(fixture1) to not include fixture1 pkg');
            }
        });
    });
});
