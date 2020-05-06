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
const React = tslib_1.__importStar(require("react"));
const useObservable_1 = tslib_1.__importDefault(require("react-use/lib/useObservable"));
const fast_deep_equal_1 = tslib_1.__importDefault(require("fast-deep-equal"));
const { useContext, useLayoutEffect, useRef, createElement: h } = React;
exports.createStateContainerReactHelpers = () => {
    const context = React.createContext(null);
    const useContainer = () => useContext(context);
    const useState = () => {
        const { state$, get } = useContainer();
        const value = useObservable_1.default(state$, get());
        return value;
    };
    const useTransitions = () => useContainer().transitions;
    const useSelector = (selector, comparator = fast_deep_equal_1.default) => {
        const { state$, get } = useContainer();
        const lastValueRef = useRef(get());
        const [value, setValue] = React.useState(() => {
            const newValue = selector(get());
            lastValueRef.current = newValue;
            return newValue;
        });
        useLayoutEffect(() => {
            const subscription = state$.subscribe((currentState) => {
                const newValue = selector(currentState);
                if (!comparator(lastValueRef.current, newValue)) {
                    lastValueRef.current = newValue;
                    setValue(newValue);
                }
            });
            return () => subscription.unsubscribe();
        }, [state$, comparator]);
        return value;
    };
    const connect = mapStateToProp => component => props => h(component, { ...useSelector(mapStateToProp), ...props });
    return {
        Provider: context.Provider,
        Consumer: context.Consumer,
        context,
        useContainer,
        useState,
        useTransitions,
        useSelector,
        connect,
    };
};
