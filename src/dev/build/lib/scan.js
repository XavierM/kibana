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
const path_1 = require("path");
const Rx = tslib_1.__importStar(require("rxjs"));
const operators_1 = require("rxjs/operators");
const getStat$ = Rx.bindNodeCallback(fs_1.default.stat);
const getReadDir$ = Rx.bindNodeCallback(fs_1.default.readdir);
/**
 * Return an observable of all files in a directory, starting with the
 * directory argument and including all of its children recursivly,
 * including dot files.
 *
 * @param directory the directory to scan
 */
function scan$(directory) {
    // get an observable of absolute paths within a directory
    const getChildPath$ = (path) => getReadDir$(path).pipe(operators_1.mergeAll(), operators_1.map((name) => path_1.join(path, name)));
    // get an observable for the argument paths and all of its child
    // paths if it is a path to a directory, recursively
    const getPaths$ = (path) => {
        return Rx.concat([path], getStat$(path).pipe(operators_1.mergeMap(stat => (stat.isDirectory() ? getChildPath$(path) : Rx.EMPTY)), operators_1.mergeMap(getPaths$)));
    };
    return getPaths$(directory);
}
exports.scan$ = scan$;
