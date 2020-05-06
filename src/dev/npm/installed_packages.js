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
const path_1 = require("path");
const fs_1 = require("fs");
const util_1 = require("util");
const license_checker_1 = tslib_1.__importDefault(require("license-checker"));
const toArray = (input) => [].concat(input);
function resolveLicenses(isPrivate, realPath, licenses) {
    // `license-checker` marks all packages that have `private: true`
    // in their `package.json` as "UNLICENSED", so we try to lookup the
    // actual license by reading the license field from their package.json
    if (isPrivate && licenses === 'UNLICENSED') {
        try {
            const pkg = JSON.parse(fs_1.readFileSync(path_1.resolve(realPath, 'package.json'), 'utf8'));
            if (!pkg.license) {
                throw new Error('no license field');
            }
            return [pkg.license];
        }
        catch (error) {
            throw new Error(`Unable to detect license for \`"private": true\` package at ${realPath}: ${error.message}`);
        }
    }
    return toArray(licenses || []);
}
function readModuleInfo(pkgAndVersion, moduleInfo, dev, options) {
    const directory = moduleInfo.realPath;
    if (directory === options.directory) {
        return;
    }
    const isPrivate = !!moduleInfo.private;
    const keyParts = pkgAndVersion.split('@');
    const name = keyParts.slice(0, -1).join('@');
    const version = keyParts[keyParts.length - 1];
    const override = options.licenseOverrides && options.licenseOverrides[pkgAndVersion];
    return {
        name,
        version,
        isDevOnly: dev,
        repository: moduleInfo.repository,
        directory,
        relative: path_1.relative(options.directory, directory),
        licenses: toArray(override ? override : resolveLicenses(isPrivate, directory, moduleInfo.licenses)),
    };
}
async function _getInstalledPackages(dev, options) {
    const lcResult = await util_1.promisify(license_checker_1.default.init)({
        start: options.directory,
        development: dev,
        production: !dev,
        json: true,
        customFormat: {
            realPath: true,
            licenseText: false,
            licenseFile: false,
        },
    });
    const result = [];
    for (const [pkgAndVersion, moduleInfo] of Object.entries(lcResult)) {
        const installedPackage = readModuleInfo(pkgAndVersion, moduleInfo, dev, options);
        if (installedPackage) {
            result.push(installedPackage);
        }
    }
    return result;
}
/**
 *  Get a list of objects with details about each installed
 *  NPM package.
 */
async function getInstalledPackages(options) {
    return [
        ...(await _getInstalledPackages(false, options)),
        ...(options.includeDev ? await _getInstalledPackages(true, options) : []),
    ];
}
exports.getInstalledPackages = getInstalledPackages;
