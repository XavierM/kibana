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
const lodash_1 = require("lodash");
const react_vis_type_1 = require("./react_vis_type");
describe('React Vis Type', () => {
    const visConfig = {
        name: 'test',
        title: 'test',
        description: 'test',
        icon: 'test',
        visConfig: { component: 'test' },
    };
    describe('initialization', () => {
        it('should throw if component is not set', () => {
            expect(() => {
                const missingConfig = lodash_1.cloneDeep(visConfig);
                delete missingConfig.visConfig.component;
                new react_vis_type_1.ReactVisType(missingConfig);
            }).toThrow();
        });
        it('creates react controller', () => {
            const visType = new react_vis_type_1.ReactVisType(visConfig);
            expect(visType.visualization).not.toBeUndefined();
        });
    });
});
