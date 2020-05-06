"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const _fake_x_aspect_1 = require("./_fake_x_aspect");
describe('makeFakeXAspect', function () {
    it('creates an object that looks like an aspect', function () {
        const aspect = _fake_x_aspect_1.makeFakeXAspect();
        expect(aspect).toHaveProperty('accessor', -1);
        expect(aspect).toHaveProperty('title', 'All docs');
        expect(aspect).toHaveProperty('format');
        expect(aspect).toHaveProperty('params');
        expect(aspect.params).toHaveProperty('defaultValue', '_all');
    });
});
