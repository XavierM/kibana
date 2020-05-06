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
function ValidationWrapper({ component: Component, ...rest }) {
    const [panelState, setPanelState] = react_1.useState({});
    const isPanelValid = Object.values(panelState).every(item => item.isValid);
    const { setValidity } = rest;
    const setValidityHandler = react_1.useCallback((paramName, isValid) => {
        setPanelState(state => ({
            ...state,
            [paramName]: {
                isValid,
            },
        }));
    }, []);
    react_1.useEffect(() => {
        setValidity(isPanelValid);
    }, [isPanelValid, setValidity]);
    return react_1.default.createElement(Component, Object.assign({}, rest, { setMultipleValidity: setValidityHandler }));
}
exports.ValidationWrapper = ValidationWrapper;
