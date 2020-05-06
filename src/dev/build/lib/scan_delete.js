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
const fs_1 = tslib_1.__importDefault(require("fs"));
const del_1 = tslib_1.__importDefault(require("del"));
const path_1 = require("path");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
// @ts-ignore
const fs_2 = require("./fs");
const getStat$ = Rx.bindNodeCallback(fs_1.default.stat);
const getReadDir$ = Rx.bindNodeCallback(fs_1.default.readdir);
/**
 * Scan the files in a directory and delete the directories/files that
 * are matched by an array of regular expressions.
 *
 * @param options.directory the directory to scan, all files including dot files will be checked
 * @param options.regularExpressions an array of regular expressions, if any matches the file/directory will be deleted
 * @param options.concurrency optional concurrency to run deletes, defaults to 20
 */
async function scanDelete(options) {
    const { directory, regularExpressions, concurrency = 20, excludePaths } = options;
    fs_2.assertAbsolute(directory);
    (excludePaths || []).forEach(excluded => fs_2.assertAbsolute(excluded));
    // get an observable of absolute paths within a directory
    const getChildPath$ = (path) => getReadDir$(path).pipe(operators_1.mergeAll(), operators_1.map((name) => path_1.join(path, name)));
    // get an observable of all paths to be deleted, by starting with the arg
    // and recursively iterating through all children, unless a child matches
    // one of the supplied regular expressions
    const getPathsToDelete$ = (path) => {
        if (excludePaths && excludePaths.includes(path)) {
            return Rx.EMPTY;
        }
        if (regularExpressions.some(re => re.test(path))) {
            return Rx.of(path);
        }
        return getStat$(path).pipe(operators_1.mergeMap(stat => (stat.isDirectory() ? getChildPath$(path) : Rx.EMPTY)), operators_1.mergeMap(getPathsToDelete$));
    };
    return await Rx.of(directory)
        .pipe(operators_1.mergeMap(getPathsToDelete$), operators_1.mergeMap(async (path) => await del_1.default(path), concurrency), operators_1.count())
        .toPromise();
}
exports.scanDelete = scanDelete;
