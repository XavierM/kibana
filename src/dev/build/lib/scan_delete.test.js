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
const scan_delete_1 = require("./scan_delete");
const TMP = path_1.resolve(__dirname, '__tests__/__tmp__');
// clean and recreate TMP directory
beforeEach(async () => {
    await del_1.default(TMP);
    await fs_2.mkdirp(path_1.resolve(TMP, 'foo/bar/baz'));
    await fs_2.mkdirp(path_1.resolve(TMP, 'foo/bar/box'));
    await fs_2.mkdirp(path_1.resolve(TMP, 'a/b/c/d/e'));
    await fs_2.write(path_1.resolve(TMP, 'a/bar'), 'foo');
});
// cleanup TMP directory
afterAll(async () => {
    await del_1.default(TMP);
});
it('requires absolute paths', async () => {
    await expect(scan_delete_1.scanDelete({
        directory: path_1.relative(process.cwd(), TMP),
        regularExpressions: [],
    })).rejects.toMatchInlineSnapshot(`[TypeError: Please use absolute paths to keep things explicit. You probably want to use \`build.resolvePath()\` or \`config.resolveFromRepo()\`.]`);
    await expect(scan_delete_1.scanDelete({
        directory: TMP,
        regularExpressions: [],
        excludePaths: ['foo'],
    })).rejects.toMatchInlineSnapshot(`[TypeError: Please use absolute paths to keep things explicit. You probably want to use \`build.resolvePath()\` or \`config.resolveFromRepo()\`.]`);
});
it('deletes files/folders matching regular expression', async () => {
    await scan_delete_1.scanDelete({
        directory: TMP,
        regularExpressions: [/^.*[\/\\](bar|c)([\/\\]|$)/],
    });
    expect(fs_1.readdirSync(path_1.resolve(TMP, 'foo'))).toEqual([]);
    expect(fs_1.readdirSync(path_1.resolve(TMP, 'a'))).toEqual(['b']);
    expect(fs_1.readdirSync(path_1.resolve(TMP, 'a/b'))).toEqual([]);
});
it('exludes directories mentioned in excludePaths', async () => {
    await scan_delete_1.scanDelete({
        directory: TMP,
        regularExpressions: [/^.*[\/\\](bar|c)([\/\\]|$)/],
        excludePaths: [path_1.resolve(TMP, 'foo')],
    });
    expect(fs_1.readdirSync(path_1.resolve(TMP, 'foo'))).toEqual(['bar']);
    expect(fs_1.readdirSync(path_1.resolve(TMP, 'a'))).toEqual(['b']);
    expect(fs_1.readdirSync(path_1.resolve(TMP, 'a/b'))).toEqual([]);
});
it('exludes files mentioned in excludePaths', async () => {
    await scan_delete_1.scanDelete({
        directory: TMP,
        regularExpressions: [/box/],
        excludePaths: [path_1.resolve(TMP, 'foo/bar/box')],
    });
    expect(fs_1.readdirSync(path_1.resolve(TMP, 'foo/bar'))).toEqual(['baz', 'box']);
});
