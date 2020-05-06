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
const react_1 = require("react");
const i18n_1 = require("@kbn/i18n");
const string_1 = require("../../../static/validators/string");
const stringifyJson = (json) => Object.keys(json).length ? JSON.stringify(json, null, 2) : '{\n\n}';
exports.useJson = ({ defaultValue = {}, onUpdate, isControlled = false, }) => {
    const didMount = react_1.useRef(false);
    const [content, setContent] = react_1.useState(stringifyJson(defaultValue));
    const [error, setError] = react_1.useState(null);
    const validate = () => {
        // We allow empty string as it will be converted to "{}""
        const isValid = content.trim() === '' ? true : string_1.isJSON(content);
        if (!isValid) {
            setError(i18n_1.i18n.translate('esUi.validation.string.invalidJSONError', {
                defaultMessage: 'Invalid JSON',
            }));
        }
        else {
            setError(null);
        }
        return isValid;
    };
    const formatContent = () => {
        const isValid = validate();
        const data = isValid && content.trim() !== '' ? JSON.parse(content) : {};
        return data;
    };
    react_1.useEffect(() => {
        if (didMount.current) {
            const isValid = isControlled ? undefined : validate();
            onUpdate({
                data: {
                    raw: content,
                    format: formatContent,
                },
                validate,
                isValid,
            });
        }
        else {
            didMount.current = true;
        }
    }, [content]);
    return {
        content,
        setContent,
        error,
    };
};
