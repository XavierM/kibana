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
class Settings {
    constructor(storage) {
        this.storage = storage;
    }
    getFontSize() {
        return this.storage.get('font_size', 14);
    }
    setFontSize(size) {
        this.storage.set('font_size', size);
        return true;
    }
    getWrapMode() {
        return this.storage.get('wrap_mode', true);
    }
    setWrapMode(mode) {
        this.storage.set('wrap_mode', mode);
        return true;
    }
    setTripleQuotes(tripleQuotes) {
        this.storage.set('triple_quotes', tripleQuotes);
        return true;
    }
    getTripleQuotes() {
        return this.storage.get('triple_quotes', true);
    }
    getAutocomplete() {
        return this.storage.get('autocomplete_settings', {
            fields: true,
            indices: true,
            templates: true,
        });
    }
    setAutocomplete(settings) {
        this.storage.set('autocomplete_settings', settings);
        return true;
    }
    getPolling() {
        return this.storage.get('console_polling', true);
    }
    setPolling(polling) {
        this.storage.set('console_polling', polling);
        return true;
    }
    toJSON() {
        return {
            autocomplete: this.getAutocomplete(),
            wrapMode: this.getWrapMode(),
            tripleQuotes: this.getTripleQuotes(),
            fontSize: parseFloat(this.getFontSize()),
            polling: Boolean(this.getPolling()),
        };
    }
    updateSettings({ fontSize, wrapMode, tripleQuotes, autocomplete, polling }) {
        this.setFontSize(fontSize);
        this.setWrapMode(wrapMode);
        this.setTripleQuotes(tripleQuotes);
        this.setAutocomplete(autocomplete);
        this.setPolling(polling);
    }
}
exports.Settings = Settings;
function createSettings({ storage }) {
    return new Settings(storage);
}
exports.createSettings = createSettings;
