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
/**
 * Components using the react-intl module require access to the intl context.
 * This is not available when mounting single components in Enzyme.
 * These helper functions aim to address that and wrap a valid,
 * intl context around them.
 */
const react_1 = require("@kbn/i18n/react");
const enzyme_1 = require("enzyme");
const react_2 = tslib_1.__importDefault(require("react"));
// Use fake component to extract `intl` property to use in tests.
const { intl } = enzyme_1.mount(react_2.default.createElement(react_1.I18nProvider, null,
    react_2.default.createElement("br", null))).find('IntlProvider')
    .instance()
    .getChildContext();
function getOptions(context = {}, childContextTypes = {}, props = {}) {
    return {
        context: {
            ...context,
            intl,
        },
        childContextTypes: {
            ...childContextTypes,
            intl: react_1.intlShape,
        },
        ...props,
    };
}
/**
 * When using React-Intl `injectIntl` on components, props.intl is required.
 */
function nodeWithIntlProp(node) {
    return react_2.default.cloneElement(node, { intl });
}
/**
 *  Creates the wrapper instance using shallow with provided intl object into context
 *
 *  @param node The React element or cheerio wrapper
 *  @param options properties to pass into shallow wrapper
 *  @return The wrapper instance around the rendered output with intl object in context
 */
function shallowWithIntl(node, { context, childContextTypes, ...props } = {}) {
    const options = getOptions(context, childContextTypes, props);
    return enzyme_1.shallow(nodeWithIntlProp(node), options);
}
exports.shallowWithIntl = shallowWithIntl;
/**
 *  Creates the wrapper instance using mount with provided intl object into context
 *
 *  @param node The React element or cheerio wrapper
 *  @param options properties to pass into mount wrapper
 *  @return The wrapper instance around the rendered output with intl object in context
 */
function mountWithIntl(node, { context, childContextTypes, ...props } = {}) {
    const options = getOptions(context, childContextTypes, props);
    return enzyme_1.mount(nodeWithIntlProp(node), options);
}
exports.mountWithIntl = mountWithIntl;
/**
 *  Creates the wrapper instance using render with provided intl object into context
 *
 *  @param node The React element or cheerio wrapper
 *  @param options properties to pass into render wrapper
 *  @return The wrapper instance around the rendered output with intl object in context
 */
function renderWithIntl(node, { context, childContextTypes, ...props } = {}) {
    const options = getOptions(context, childContextTypes, props);
    return enzyme_1.render(nodeWithIntlProp(node), options);
}
exports.renderWithIntl = renderWithIntl;
exports.nextTick = () => new Promise(res => process.nextTick(res));
function shallowWithI18nProvider(child) {
    const wrapped = enzyme_1.shallow(react_2.default.createElement(react_1.I18nProvider, null, child));
    const name = typeof child.type === 'string' ? child.type : child.type.name;
    return wrapped.find(name).dive();
}
exports.shallowWithI18nProvider = shallowWithI18nProvider;
function mountWithI18nProvider(child) {
    const wrapped = enzyme_1.mount(react_2.default.createElement(react_1.I18nProvider, null, child));
    const name = typeof child.type === 'string' ? child.type : child.type.name;
    return wrapped.find(name);
}
exports.mountWithI18nProvider = mountWithI18nProvider;
