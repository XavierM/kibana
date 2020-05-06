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
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_helpers_1 = require("test_utils/enzyme_helpers");
const shard_failure_modal_1 = require("./shard_failure_modal");
const shard_failure_request_1 = require("./__mocks__/shard_failure_request");
const shard_failure_response_1 = require("./__mocks__/shard_failure_response");
describe('ShardFailureModal', () => {
    it('renders matching snapshot given valid properties', () => {
        const component = enzyme_helpers_1.shallowWithIntl(react_1.default.createElement(shard_failure_modal_1.ShardFailureModal, { title: "test", request: shard_failure_request_1.shardFailureRequest, response: shard_failure_response_1.shardFailureResponse, onClose: jest.fn() }));
        expect(component).toMatchSnapshot();
    });
});
