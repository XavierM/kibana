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
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const lineage_map_1 = require("./lineage_map");
const editor_utils_1 = require("../editor_utils");
test('creates lineage map', () => {
    const control1 = editor_utils_1.newControl(editor_utils_1.CONTROL_TYPES.LIST);
    control1.id = '1';
    const control2 = editor_utils_1.newControl(editor_utils_1.CONTROL_TYPES.LIST);
    control2.id = '2';
    const control3 = editor_utils_1.newControl(editor_utils_1.CONTROL_TYPES.LIST);
    control3.id = '3';
    control2.parent = control1.id;
    control3.parent = control2.id;
    const lineageMap = lineage_map_1.getLineageMap([control1, control2, control3]);
    expect_1.default([control1.id]).to.eql(lineageMap.get(control1.id));
    expect_1.default([control2.id, control1.id]).to.eql(lineageMap.get(control2.id));
    expect_1.default([control3.id, control2.id, control1.id]).to.eql(lineageMap.get(control3.id));
});
test('safely handles circular graph', () => {
    const control1 = editor_utils_1.newControl(editor_utils_1.CONTROL_TYPES.LIST);
    control1.id = '1';
    const control2 = editor_utils_1.newControl(editor_utils_1.CONTROL_TYPES.LIST);
    control2.id = '2';
    control1.parent = control2.id;
    control2.parent = control1.id;
    const lineageMap = lineage_map_1.getLineageMap([control1, control2]);
    expect_1.default([control1.id, control2.id]).to.eql(lineageMap.get(control1.id));
    expect_1.default([control2.id, control1.id]).to.eql(lineageMap.get(control2.id));
});
