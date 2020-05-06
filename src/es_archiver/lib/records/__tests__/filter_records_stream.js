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
const chance_1 = tslib_1.__importDefault(require("chance"));
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const utils_1 = require("../../../../legacy/utils");
const filter_records_stream_1 = require("../filter_records_stream");
const chance = new chance_1.default();
describe('esArchiver: createFilterRecordsStream()', () => {
    it('consumes any value', async () => {
        const output = await utils_1.createPromiseFromStreams([
            utils_1.createListStream([
                chance.integer(),
                /test/,
                {
                    birthday: chance.birthday(),
                    ssn: chance.ssn(),
                },
                chance.bool(),
            ]),
            filter_records_stream_1.createFilterRecordsStream('type'),
            utils_1.createConcatStream([]),
        ]);
        expect_1.default(output).to.eql([]);
    });
    it('produces record values that have a matching type', async () => {
        const type1 = chance.word({ length: 5 });
        const output = await utils_1.createPromiseFromStreams([
            utils_1.createListStream([
                { type: type1, value: {} },
                { type: type1, value: {} },
                { type: chance.word({ length: 10 }), value: {} },
                { type: chance.word({ length: 10 }), value: {} },
                { type: type1, value: {} },
                { type: chance.word({ length: 10 }), value: {} },
                { type: chance.word({ length: 10 }), value: {} },
            ]),
            filter_records_stream_1.createFilterRecordsStream(type1),
            utils_1.createConcatStream([]),
        ]);
        expect_1.default(output).to.have.length(3);
        expect_1.default(output.map(o => o.type)).to.eql([type1, type1, type1]);
    });
});
