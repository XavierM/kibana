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
const i18n_1 = require("@kbn/i18n");
const lodash_1 = require("lodash");
function getPainlessError(error) {
    const rootCause = lodash_1.get(error, 'body.attributes.error.root_cause');
    const message = lodash_1.get(error, 'body.message');
    if (!rootCause) {
        return;
    }
    const [{ lang, script }] = rootCause;
    if (lang !== 'painless') {
        return;
    }
    return {
        lang,
        script,
        message: i18n_1.i18n.translate('kbn.discover.painlessError.painlessScriptedFieldErrorMessage', {
            defaultMessage: "Error with Painless scripted field '{script}'.",
            values: { script },
        }),
        error: message,
    };
}
exports.getPainlessError = getPainlessError;
