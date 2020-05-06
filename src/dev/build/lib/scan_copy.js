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
const util_1 = require("util");
// @ts-ignore
const fs_2 = require("./fs");
const statAsync = util_1.promisify(fs_1.default.stat);
const mkdirAsync = util_1.promisify(fs_1.default.mkdir);
const utimesAsync = util_1.promisify(fs_1.default.utimes);
const copyFileAsync = util_1.promisify(fs_1.default.copyFile);
const readdirAsync = util_1.promisify(fs_1.default.readdir);
class Record {
    constructor(isDirectory, name, absolute, absoluteDest) {
        this.isDirectory = isDirectory;
        this.name = name;
        this.absolute = absolute;
        this.absoluteDest = absoluteDest;
    }
}
/**
 * Copy all of the files from one directory to another, optionally filtered with a
 * function or modifying mtime/atime for each file.
 */
async function scanCopy(options) {
    const { source, destination, filter, time } = options;
    fs_2.assertAbsolute(source);
    fs_2.assertAbsolute(destination);
    // get filtered Records for files/directories within a directory
    const getChildRecords = async (parent) => {
        const names = await readdirAsync(parent.absolute);
        const records = await Promise.all(names.map(async (name) => {
            const absolute = path_1.join(parent.absolute, name);
            const stat = await statAsync(absolute);
            return new Record(stat.isDirectory(), name, absolute, path_1.join(parent.absoluteDest, name));
        }));
        return records.filter(record => (filter ? filter(record) : true));
    };
    // create or copy each child of a directory
    const copyChildren = async (record) => {
        const children = await getChildRecords(record);
        await Promise.all(children.map(async (child) => await copy(child)));
    };
    // create or copy a record and recurse into directories
    const copy = async (record) => {
        if (record.isDirectory) {
            await mkdirAsync(record.absoluteDest);
        }
        else {
            await copyFileAsync(record.absolute, record.absoluteDest, fs_1.default.constants.COPYFILE_EXCL);
        }
        if (time) {
            await utimesAsync(record.absoluteDest, time, time);
        }
        if (record.isDirectory) {
            await copyChildren(record);
        }
    };
    await fs_2.mkdirp(destination);
    await copyChildren(new Record(true, path_1.basename(source), source, destination));
}
exports.scanCopy = scanCopy;
