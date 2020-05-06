"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const shard_failure_open_modal_button_test_mocks_1 = require("./shard_failure_open_modal_button.test.mocks");
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const shard_failure_open_modal_button_1 = require("./shard_failure_open_modal_button");
const shard_failure_request_1 = require("./__mocks__/shard_failure_request");
const shard_failure_response_1 = require("./__mocks__/shard_failure_response");
// @ts-ignore
const test_1 = require("@elastic/eui/lib/test");
describe('ShardFailureOpenModalButton', () => {
    it('triggers the openModal function when "Show details" button is clicked', () => {
        const component = enzyme_helpers_1.mountWithIntl(react_1.default.createElement(shard_failure_open_modal_button_1.ShardFailureOpenModalButton, { request: shard_failure_request_1.shardFailureRequest, response: shard_failure_response_1.shardFailureResponse, title: "test" }));
        test_1.findTestSubject(component, 'openShardFailureModalBtn').simulate('click');
        expect(shard_failure_open_modal_button_test_mocks_1.openModal).toHaveBeenCalled();
    });
});
