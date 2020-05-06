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
const storage_1 = require("./storage");
class StorageMock extends storage_1.Storage {
    constructor() {
        super(...arguments);
        this.delete = jest.fn();
        this.decode = jest.fn();
        this.decodeKey = jest.fn();
        this.encodeKey = jest.fn();
        this.encode = jest.fn();
        this.has = jest.fn();
        this.keys = jest.fn();
        this.get = jest.fn();
        this.set = jest.fn();
    }
}
exports.StorageMock = StorageMock;
