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
const react_1 = tslib_1.__importDefault(require("react"));
const enzyme_1 = require("enzyme");
const advanced_settings_voice_announcement_1 = require("./advanced_settings_voice_announcement");
const settingPartial = {
    name: 'name',
    isOverridden: false,
    type: 'string',
    value: 'value',
    defVal: 'defVal',
    optionLabels: { label: 'label' },
    description: 'description',
    displayName: 'displayName',
    isCustom: false,
    requiresPageReload: false,
    options: [],
    validation: { regex: /a/, message: 'message' },
    category: ['category'],
    readOnly: false,
};
const testProps = {
    nothing: {
        query: '',
        filteredSettings: [
            {
                ariaName: 'General',
                ...settingPartial,
            },
        ],
    },
    searchResult: {
        query: 'dark theme',
        filteredSettings: [
            {
                ariaName: 'General',
                ...settingPartial,
            },
        ],
    },
};
describe('Advanced Settings: Voice Announcement', () => {
    it('should render nothing', async () => {
        const { query, filteredSettings } = testProps.nothing;
        const component = enzyme_1.shallow(react_1.default.createElement(advanced_settings_voice_announcement_1.AdvancedSettingsVoiceAnnouncement, { queryText: query, settings: { filteredSettings } }));
        expect(component).toMatchSnapshot();
    });
    it('should render announcement', async () => {
        const { query, filteredSettings } = testProps.searchResult;
        const component = enzyme_1.shallow(react_1.default.createElement(advanced_settings_voice_announcement_1.AdvancedSettingsVoiceAnnouncement, { queryText: query, settings: { filteredSettings } }));
        expect(component).toMatchSnapshot();
    });
});
