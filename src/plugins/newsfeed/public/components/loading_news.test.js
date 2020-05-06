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
const enzyme_1 = require("enzyme");
const enzyme_to_json_1 = tslib_1.__importDefault(require("enzyme-to-json"));
const loading_news_1 = require("./loading_news");
describe('news_loading', () => {
    describe('rendering', () => {
        it('renders the default News Loading', () => {
            const wrapper = enzyme_1.shallow(React.createElement(loading_news_1.NewsLoadingPrompt, null));
            expect(enzyme_to_json_1.default(wrapper)).toMatchSnapshot();
        });
    });
});
