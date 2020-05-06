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
const settings_1 = require("./settings");
class SettingsMock extends settings_1.Settings {
    constructor() {
        super(...arguments);
        this.getAutocomplete = jest.fn();
        this.getFontSize = jest.fn();
        this.getPolling = jest.fn();
        this.getTripleQuotes = jest.fn();
        this.getWrapMode = jest.fn();
        this.setAutocomplete = jest.fn();
        this.setFontSize = jest.fn();
        this.setPolling = jest.fn();
        this.setTripleQuotes = jest.fn();
        this.setWrapMode = jest.fn();
        this.toJSON = jest.fn();
        this.updateSettings = jest.fn();
    }
}
exports.SettingsMock = SettingsMock;
