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
const fs_1 = require("fs");
const path_1 = require("path");
const del_1 = tslib_1.__importDefault(require("del"));
// @ts-ignore
const fs_2 = require("./fs");
const scan_copy_1 = require("./scan_copy");
const IS_WINDOWS = process.platform === 'win32';
const FIXTURES = path_1.resolve(__dirname, '__tests__/fixtures');
const WORLD_EXECUTABLE = path_1.resolve(FIXTURES, 'bin/world_executable');
const TMP = path_1.resolve(__dirname, '__tests__/__tmp__');
const getCommonMode = (path) => fs_1.statSync(path)
    .mode.toString(8)
    .slice(-3);
// ensure WORLD_EXECUTABLE is actually executable by all
beforeAll(async () => {
    fs_1.chmodSync(WORLD_EXECUTABLE, 0o777);
});
// cleanup TMP directory
afterEach(async () => {
    await del_1.default(TMP);
});
it('rejects if source path is not absolute', async () => {
    await expect(scan_copy_1.scanCopy({
        source: 'foo/bar',
        destination: __dirname,
    })).rejects.toThrowErrorMatchingInlineSnapshot(`"Please use absolute paths to keep things explicit. You probably want to use \`build.resolvePath()\` or \`config.resolveFromRepo()\`."`);
});
it('rejects if destination path is not absolute', async () => {
    await expect(scan_copy_1.scanCopy({
        source: __dirname,
        destination: 'foo/bar',
    })).rejects.toThrowErrorMatchingInlineSnapshot(`"Please use absolute paths to keep things explicit. You probably want to use \`build.resolvePath()\` or \`config.resolveFromRepo()\`."`);
});
it('rejects if neither path is absolute', async () => {
    await expect(scan_copy_1.scanCopy({
        source: 'foo/bar',
        destination: 'foo/bar',
    })).rejects.toThrowErrorMatchingInlineSnapshot(`"Please use absolute paths to keep things explicit. You probably want to use \`build.resolvePath()\` or \`config.resolveFromRepo()\`."`);
});
it('copies files and directories from source to dest, including dot files, creating dest if necessary, respecting mode', async () => {
    const destination = path_1.resolve(TMP, 'a/b/c');
    await scan_copy_1.scanCopy({
        source: FIXTURES,
        destination,
    });
    expect((await fs_2.getChildPaths(path_1.resolve(destination, 'foo_dir'))).sort()).toEqual([
        path_1.resolve(destination, 'foo_dir/.bar'),
        path_1.resolve(destination, 'foo_dir/bar.txt'),
        path_1.resolve(destination, 'foo_dir/foo'),
    ]);
    expect(getCommonMode(path_1.resolve(destination, 'bin/world_executable'))).toBe(IS_WINDOWS ? '666' : '777');
    expect(getCommonMode(path_1.resolve(destination, 'foo_dir/bar.txt'))).toBe(IS_WINDOWS ? '666' : '644');
});
it('applies filter function specified', async () => {
    const destination = path_1.resolve(TMP, 'a/b/c/d');
    await scan_copy_1.scanCopy({
        source: FIXTURES,
        destination,
        filter: record => !record.name.includes('bar'),
    });
    expect((await fs_2.getChildPaths(path_1.resolve(destination, 'foo_dir'))).sort()).toEqual([
        path_1.resolve(destination, 'foo_dir/foo'),
    ]);
});
it('supports atime and mtime', async () => {
    const destination = path_1.resolve(TMP, 'a/b/c/d/e');
    const time = new Date(1425298511000);
    await scan_copy_1.scanCopy({
        source: FIXTURES,
        destination,
        time,
    });
    const barTxt = fs_1.statSync(path_1.resolve(destination, 'foo_dir/bar.txt'));
    const fooDir = fs_1.statSync(path_1.resolve(destination, 'foo_dir'));
    // precision is platform specific
    const oneDay = 86400000;
    expect(Math.abs(barTxt.atimeMs - time.getTime())).toBeLessThan(oneDay);
    expect(Math.abs(barTxt.mtimeMs - time.getTime())).toBeLessThan(oneDay);
    expect(Math.abs(fooDir.atimeMs - time.getTime())).toBeLessThan(oneDay);
});
