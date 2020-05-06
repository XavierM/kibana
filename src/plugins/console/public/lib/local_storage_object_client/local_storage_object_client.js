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
const uuid_1 = tslib_1.__importDefault(require("uuid"));
class LocalObjectStorage {
    constructor(client, type) {
        this.client = client;
        this.prefix = `console_local_${type}`;
    }
    async create(obj) {
        const id = uuid_1.default.v4();
        const newObj = { id, ...obj };
        this.client.set(`${this.prefix}_${id}`, newObj);
        return newObj;
    }
    async update(obj) {
        this.client.set(`${this.prefix}_${obj.id}`, obj);
    }
    async findAll() {
        const allLocalKeys = this.client.keys().filter(key => {
            return key.includes(this.prefix);
        });
        const result = [];
        for (const key of allLocalKeys) {
            result.push(this.client.get(key));
        }
        return result;
    }
}
exports.LocalObjectStorage = LocalObjectStorage;
