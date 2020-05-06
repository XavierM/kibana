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
const react_1 = tslib_1.__importStar(require("react"));
const form_context_1 = require("../form_context");
exports.FormDataProvider = react_1.default.memo(({ children, pathsToWatch }) => {
    const form = form_context_1.useFormContext();
    const previousRawData = react_1.useRef(form.__formData$.current.value);
    const [formData, setFormData] = react_1.useState(previousRawData.current);
    react_1.useEffect(() => {
        const subscription = form.subscribe(({ data: { raw } }) => {
            // To avoid re-rendering the children for updates on the form data
            // that we are **not** interested in, we can specify one or multiple path(s)
            // to watch.
            if (pathsToWatch) {
                const valuesToWatchArray = Array.isArray(pathsToWatch)
                    ? pathsToWatch
                    : [pathsToWatch];
                if (valuesToWatchArray.some(value => previousRawData.current[value] !== raw[value])) {
                    previousRawData.current = raw;
                    setFormData(raw);
                }
            }
            else {
                setFormData(raw);
            }
        });
        return subscription.unsubscribe;
    }, [form, pathsToWatch]);
    return children(formData);
});
