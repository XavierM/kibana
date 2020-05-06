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
const short_url_lookup_1 = require("./lib/short_url_lookup");
const goto_1 = require("./goto");
const shorten_url_1 = require("./shorten_url");
const get_1 = require("./get");
function createRoutes({ http }, logger) {
    const shortUrlLookup = short_url_lookup_1.shortUrlLookupProvider({ logger });
    const router = http.createRouter();
    goto_1.createGotoRoute({ router, shortUrlLookup, http });
    get_1.createGetterRoute({ router, shortUrlLookup, http });
    shorten_url_1.createShortenUrlRoute({ router, shortUrlLookup });
}
exports.createRoutes = createRoutes;
