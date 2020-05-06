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
const eui_1 = require("@elastic/eui");
const react_router_dom_1 = require("react-router-dom");
const call_outs_1 = require("./components/call_outs");
const search_1 = require("./components/search");
const form_1 = require("./components/form");
const advanced_settings_voice_announcement_1 = require("./components/advanced_settings_voice_announcement");
const lib_1 = require("./lib");
class AdvancedSettingsComponent extends react_1.Component {
    constructor(props) {
        super(props);
        this.categories = [];
        this.initSettings = this.mapConfig;
        this.initGroupedSettings = this.mapSettings;
        this.onQueryChange = ({ query }) => {
            this.setState({
                query,
                filteredSettings: this.mapSettings(eui_1.Query.execute(query, this.settings)),
            });
        };
        this.clearQuery = () => {
            this.setState({
                query: eui_1.Query.parse(''),
                footerQueryMatched: false,
                filteredSettings: this.groupedSettings,
            });
        };
        this.onFooterQueryMatchChange = (matched) => {
            this.setState({
                footerQueryMatched: matched,
            });
        };
        this.saveConfig = async (changes) => {
            const arr = Object.entries(changes).map(([key, value]) => this.props.uiSettings.set(key, value));
            return Promise.all(arr);
        };
        this.settings = this.initSettings(this.props.uiSettings);
        this.groupedSettings = this.initGroupedSettings(this.settings);
        this.categories = this.initCategories(this.groupedSettings);
        this.categoryCounts = this.initCategoryCounts(this.groupedSettings);
        const parsedQuery = eui_1.Query.parse(this.props.queryText ? lib_1.getAriaName(this.props.queryText) : '');
        this.state = {
            query: parsedQuery,
            footerQueryMatched: false,
            filteredSettings: this.mapSettings(eui_1.Query.execute(parsedQuery, this.settings)),
        };
    }
    init(config) {
        this.settings = this.initSettings(config);
        this.groupedSettings = this.initGroupedSettings(this.settings);
        this.categories = this.initCategories(this.groupedSettings);
        this.categoryCounts = this.initCategoryCounts(this.groupedSettings);
    }
    initCategories(groupedSettings) {
        return Object.keys(groupedSettings).sort((a, b) => {
            if (a === lib_1.DEFAULT_CATEGORY)
                return -1;
            if (b === lib_1.DEFAULT_CATEGORY)
                return 1;
            if (a > b)
                return 1;
            return a === b ? 0 : -1;
        });
    }
    initCategoryCounts(groupedSettings) {
        return Object.keys(groupedSettings).reduce((counts, category) => {
            counts[category] = groupedSettings[category].length;
            return counts;
        }, {});
    }
    componentDidMount() {
        this.uiSettingsSubscription = this.props.uiSettings.getUpdate$().subscribe(() => {
            const { query } = this.state;
            this.init(this.props.uiSettings);
            this.setState({
                filteredSettings: this.mapSettings(eui_1.Query.execute(query, this.settings)),
            });
        });
    }
    componentWillUnmount() {
        if (this.uiSettingsSubscription) {
            this.uiSettingsSubscription.unsubscribe();
        }
    }
    mapConfig(config) {
        const all = config.getAll();
        return Object.entries(all)
            .map(setting => {
            return lib_1.toEditableConfig({
                def: setting[1],
                name: setting[0],
                value: setting[1].userValue,
                isCustom: config.isCustom(setting[0]),
                isOverridden: config.isOverridden(setting[0]),
            });
        })
            .filter(c => !c.readonly)
            .sort(eui_1.Comparators.property('name', eui_1.Comparators.default('asc')));
    }
    mapSettings(settings) {
        // Group settings by category
        return settings.reduce((groupedSettings, setting) => {
            // We will want to change this logic when we put each category on its
            // own page aka allowing a setting to be included in multiple categories.
            const category = setting.category[0];
            (groupedSettings[category] = groupedSettings[category] || []).push(setting);
            return groupedSettings;
        }, {});
    }
    render() {
        const { filteredSettings, query, footerQueryMatched } = this.state;
        const componentRegistry = this.props.componentRegistry;
        const PageTitle = componentRegistry.get(componentRegistry.componentType.PAGE_TITLE_COMPONENT);
        const PageSubtitle = componentRegistry.get(componentRegistry.componentType.PAGE_SUBTITLE_COMPONENT);
        const PageFooter = componentRegistry.get(componentRegistry.componentType.PAGE_FOOTER_COMPONENT);
        return (react_1.default.createElement("div", null,
            react_1.default.createElement(eui_1.EuiFlexGroup, { gutterSize: "none" },
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(PageTitle, null)),
                react_1.default.createElement(eui_1.EuiFlexItem, null,
                    react_1.default.createElement(search_1.Search, { query: query, categories: this.categories, onQueryChange: this.onQueryChange }))),
            react_1.default.createElement(PageSubtitle, null),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(call_outs_1.CallOuts, null),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(advanced_settings_voice_announcement_1.AdvancedSettingsVoiceAnnouncement, { queryText: query.text, settings: filteredSettings }),
            react_1.default.createElement(form_1.Form, { settings: this.groupedSettings, visibleSettings: filteredSettings, categories: this.categories, categoryCounts: this.categoryCounts, clearQuery: this.clearQuery, save: this.saveConfig, showNoResultsMessage: !footerQueryMatched, enableSaving: this.props.enableSaving, dockLinks: this.props.dockLinks, toasts: this.props.toasts }),
            react_1.default.createElement(PageFooter, { toasts: this.props.toasts, query: query, onQueryMatchChange: this.onFooterQueryMatchChange, enableSaving: this.props.enableSaving })));
    }
}
exports.AdvancedSettingsComponent = AdvancedSettingsComponent;
exports.AdvancedSettings = (props) => {
    const { query } = react_router_dom_1.useParams();
    return (react_1.default.createElement(AdvancedSettingsComponent, { queryText: query || '', enableSaving: props.enableSaving, uiSettings: props.uiSettings, dockLinks: props.dockLinks, toasts: props.toasts, componentRegistry: props.componentRegistry }));
};
