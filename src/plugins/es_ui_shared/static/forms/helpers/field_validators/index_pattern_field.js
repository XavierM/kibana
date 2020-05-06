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
const string_1 = require("../../../validators/string");
const public_1 = require("../../../../../data/public");
exports.indexPatternField = (i18n) => (...args) => {
    const [{ value }] = args;
    if (typeof value !== 'string') {
        return;
    }
    // Validate it does not contain spaces
    const { doesContain } = string_1.containsChars(' ')(value);
    if (doesContain) {
        return {
            code: 'ERR_FIELD_FORMAT',
            formatType: 'INDEX_PATTERN',
            message: i18n.translate('esUi.forms.fieldValidation.indexPatternSpacesError', {
                defaultMessage: 'The index pattern cannot contain spaces.',
            }),
        };
    }
    // Validate illegal characters
    const errors = public_1.indexPatterns.validate(value);
    if (errors[public_1.indexPatterns.ILLEGAL_CHARACTERS_KEY]) {
        return {
            code: 'ERR_FIELD_FORMAT',
            formatType: 'INDEX_PATTERN',
            message: i18n.translate('esUi.forms.fieldValidation.indexPatternInvalidCharactersError', {
                defaultMessage: 'The index pattern contains the invalid {characterListLength, plural, one {character} other {characters}} { characterList }.',
                values: {
                    characterList: errors[public_1.indexPatterns.ILLEGAL_CHARACTERS_KEY].join(' '),
                    characterListLength: errors[public_1.indexPatterns.ILLEGAL_CHARACTERS_KEY].length,
                },
            }),
        };
    }
};
