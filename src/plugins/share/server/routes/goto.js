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
const config_schema_1 = require("@kbn/config-schema");
const short_url_assert_valid_1 = require("./lib/short_url_assert_valid");
const short_url_routes_1 = require("../../common/short_url_routes");
const utils_1 = require("../../../../core/utils");
exports.createGotoRoute = ({ router, shortUrlLookup, http, }) => {
    http.resources.register({
        path: short_url_routes_1.getGotoPath('{urlId}'),
        validate: {
            params: config_schema_1.schema.object({ urlId: config_schema_1.schema.string() }),
        },
    }, router.handleLegacyErrors(async function (context, request, response) {
        const url = await shortUrlLookup.getUrl(request.params.urlId, {
            savedObjects: context.core.savedObjects.client,
        });
        short_url_assert_valid_1.shortUrlAssertValid(url);
        const uiSettings = context.core.uiSettings.client;
        const stateStoreInSessionStorage = await uiSettings.get('state:storeInSessionStorage');
        if (!stateStoreInSessionStorage) {
            const basePath = http.basePath.get(request);
            const prependedUrl = utils_1.modifyUrl(url, parts => {
                if (!parts.hostname && parts.pathname && parts.pathname.startsWith('/')) {
                    parts.pathname = `${basePath}${parts.pathname}`;
                }
            });
            return response.redirected({
                headers: {
                    location: prependedUrl,
                },
            });
        }
        return response.renderCoreApp();
    }));
};
