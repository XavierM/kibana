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
class File {
    constructor(path) {
        this.path = path_1.resolve(path);
        this.relativePath = path_1.relative(process.cwd(), this.path);
        this.ext = path_1.extname(this.path);
    }
    getAbsolutePath() {
        return this.path;
    }
    getRelativePath() {
        return this.relativePath;
    }
    isJs() {
        return this.ext === '.js';
    }
    isTypescript() {
        return this.ext === '.ts' || this.ext === '.tsx';
    }
    isTypescriptAmbient() {
        return this.path.endsWith('.d.ts');
    }
    isSass() {
        return this.ext === '.sass' || this.ext === '.scss';
    }
    isFixture() {
        return this.relativePath.split(path_1.sep).includes('__fixtures__');
    }
    getRelativeParentDirs() {
        const parents = [];
        while (true) {
            // NOTE: resolve() produces absolute paths, so we have to use join()
            const parent = parents.length
                ? path_1.join(parents[parents.length - 1], '..')
                : path_1.dirname(this.relativePath);
            if (parent === '..' || parent === '.') {
                break;
            }
            else {
                parents.push(parent);
            }
        }
        return parents;
    }
    toString() {
        return this.relativePath;
    }
    toJSON() {
        return this.relativePath;
    }
}
exports.File = File;
