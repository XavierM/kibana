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
// @ts-ignore
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const ipv4_address_1 = require("./ipv4_address");
describe('Ipv4Address', () => {
    it('should throw errors with invalid IP addresses', () => {
        // @ts-ignore
        expect_1.default(() => new ipv4_address_1.Ipv4Address()).to.throwError();
        expect_1.default(() => new ipv4_address_1.Ipv4Address('')).to.throwError();
        expect_1.default(() => new ipv4_address_1.Ipv4Address('hello, world')).to.throwError();
        expect_1.default(() => new ipv4_address_1.Ipv4Address('0.0.0')).to.throwError();
        expect_1.default(() => new ipv4_address_1.Ipv4Address('256.0.0.0')).to.throwError();
        expect_1.default(() => new ipv4_address_1.Ipv4Address('-1.0.0.0')).to.throwError();
        expect_1.default(() => new ipv4_address_1.Ipv4Address(Number.MAX_SAFE_INTEGER)).to.throwError();
    });
    it('should allow creation with an integer or string', () => {
        expect_1.default(new ipv4_address_1.Ipv4Address(2116932386).toString()).to.be(new ipv4_address_1.Ipv4Address('126.45.211.34').toString());
    });
    it('should correctly calculate the decimal representation of an IP address', () => {
        let ipAddress = new ipv4_address_1.Ipv4Address('0.0.0.0');
        expect_1.default(ipAddress.valueOf()).to.be(0);
        ipAddress = new ipv4_address_1.Ipv4Address('0.0.0.1');
        expect_1.default(ipAddress.valueOf()).to.be(1);
        ipAddress = new ipv4_address_1.Ipv4Address('126.45.211.34');
        expect_1.default(ipAddress.valueOf()).to.be(2116932386);
    });
    it('toString()', () => {
        let ipAddress = new ipv4_address_1.Ipv4Address('0.000.00000.1');
        expect_1.default(ipAddress.toString()).to.be('0.0.0.1');
        ipAddress = new ipv4_address_1.Ipv4Address('123.123.123.123');
        expect_1.default(ipAddress.toString()).to.be('123.123.123.123');
    });
});
