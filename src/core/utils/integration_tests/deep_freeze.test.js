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
const execa_1 = tslib_1.__importDefault(require("execa"));
const MINUTE = 60 * 1000;
it('types return values to prevent mutations in typescript', async () => {
    await expect(execa_1.default('tsc', ['--noEmit'], {
        cwd: path_1.resolve(__dirname, '__fixtures__/frozen_object_mutation'),
        preferLocal: true,
    }).catch(err => err.stdout)).resolves.toMatchInlineSnapshot(`
      "index.ts(28,12): error TS2540: Cannot assign to 'baz' because it is a read-only property.
      index.ts(36,11): error TS2540: Cannot assign to 'bar' because it is a read-only property."
    `);
}, MINUTE);
