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
const i18n_1 = require("@kbn/i18n");
const lodash_1 = tslib_1.__importDefault(require("lodash"));
const public_1 = require("../../../kibana_legacy/public");
const embeddable_plugin_1 = require("../embeddable_plugin");
const lib_1 = require("./lib");
const embeddable_saved_object_converters_1 = require("./lib/embeddable_saved_object_converters");
const filter_utils_1 = require("./lib/filter_utils");
const public_2 = require("../../../kibana_utils/public");
/**
 * Dashboard state manager handles connecting angular and redux state between the angular and react portions of the
 * app. There are two "sources of truth" that need to stay in sync - AppState (aka the `_a` portion of the url) and
 * the Store. They aren't complete duplicates of each other as AppState has state that the Store doesn't, and vice
 * versa. They should be as decoupled as possible so updating the store won't affect bwc of urls.
 */
class DashboardStateManager {
    /**
     *
     * @param savedDashboard
     * @param hideWriteControls true if write controls should be hidden.
     * @param kibanaVersion current kibanaVersion
     * @param
     */
    constructor({ savedDashboard, hideWriteControls, kibanaVersion, kbnUrlStateStorage, history, usageCollection, }) {
        this.STATE_STORAGE_KEY = '_a';
        this.history = history;
        this.kibanaVersion = kibanaVersion;
        this.savedDashboard = savedDashboard;
        this.hideWriteControls = hideWriteControls;
        this.usageCollection = usageCollection;
        // get state defaults from saved dashboard, make sure it is migrated
        this.stateDefaults = lib_1.migrateAppState(lib_1.getAppStateDefaults(this.savedDashboard, this.hideWriteControls), kibanaVersion, usageCollection);
        this.kbnUrlStateStorage = kbnUrlStateStorage;
        // setup initial state by merging defaults with state from url
        // also run migration, as state in url could be of older version
        const initialState = lib_1.migrateAppState({
            ...this.stateDefaults,
            ...this.kbnUrlStateStorage.get(this.STATE_STORAGE_KEY),
        }, kibanaVersion, usageCollection);
        // setup state container using initial state both from defaults and from url
        this.stateContainer = public_2.createStateContainer(initialState, {
            set: state => (prop, value) => ({ ...state, [prop]: value }),
            setOption: state => (option, value) => ({
                ...state,
                options: {
                    ...state.options,
                    [option]: value,
                },
            }),
        });
        this.isDirty = false;
        // We can't compare the filters stored on this.appState to this.savedDashboard because in order to apply
        // the filters to the visualizations, we need to save it on the dashboard. We keep track of the original
        // filter state in order to let the user know if their filters changed and provide this specific information
        // in the 'lose changes' warning message.
        this.lastSavedDashboardFilters = this.getFilterState();
        this.changeListeners = [];
        this.stateContainerChangeSub = this.stateContainer.state$.subscribe(() => {
            this.isDirty = this.checkIsDirty();
            this.changeListeners.forEach(listener => listener({ dirty: this.isDirty }));
        });
        // setup state syncing utils. state container will be synced with url into `this.STATE_STORAGE_KEY` query param
        this.stateSyncRef = public_2.syncState({
            storageKey: this.STATE_STORAGE_KEY,
            stateContainer: {
                ...this.stateContainer,
                get: () => this.toUrlState(this.stateContainer.get()),
                set: (state) => {
                    // sync state required state container to be able to handle null
                    // overriding set() so it could handle null coming from url
                    if (state) {
                        // Skip this update if current dashboardId in the url is different from what we have in the current instance of state manager
                        // As dashboard is driven by angular at the moment, the destroy cycle happens async,
                        // If the dashboardId has changed it means this instance
                        // is going to be destroyed soon and we shouldn't sync state anymore,
                        // as it could potentially trigger further url updates
                        const currentDashboardIdInUrl = lib_1.getDashboardIdFromUrl(history.location.pathname);
                        if (currentDashboardIdInUrl !== this.savedDashboard.id)
                            return;
                        this.stateContainer.set({
                            ...this.stateDefaults,
                            ...state,
                        });
                    }
                    else {
                        // Do nothing in case when state from url is empty,
                        // this fixes: https://github.com/elastic/kibana/issues/57789
                        // There are not much cases when state in url could become empty:
                        // 1. User manually removed `_a` from the url
                        // 2. Browser is navigating away from the page and most likely there is no `_a` in the url.
                        //    In this case we don't want to do any state updates
                        //    and just allow $scope.$on('destroy') fire later and clean up everything
                    }
                },
            },
            stateStorage: this.kbnUrlStateStorage,
        });
    }
    get appState() {
        return this.stateContainer.get();
    }
    get appState$() {
        return this.stateContainer.state$;
    }
    startStateSyncing() {
        this.saveState({ replace: true });
        this.stateSyncRef.start();
    }
    registerChangeListener(callback) {
        this.changeListeners.push(callback);
    }
    handleDashboardContainerChanges(dashboardContainer) {
        let dirty = false;
        let dirtyBecauseOfInitialStateMigration = false;
        const savedDashboardPanelMap = {};
        const input = dashboardContainer.getInput();
        this.getPanels().forEach(savedDashboardPanel => {
            if (input.panels[savedDashboardPanel.panelIndex] !== undefined) {
                savedDashboardPanelMap[savedDashboardPanel.panelIndex] = savedDashboardPanel;
            }
            else {
                // A panel was deleted.
                dirty = true;
            }
        });
        const convertedPanelStateMap = {};
        Object.values(input.panels).forEach(panelState => {
            if (savedDashboardPanelMap[panelState.explicitInput.id] === undefined) {
                dirty = true;
            }
            convertedPanelStateMap[panelState.explicitInput.id] = embeddable_saved_object_converters_1.convertPanelStateToSavedDashboardPanel(panelState, this.kibanaVersion);
            if (!lodash_1.default.isEqual(convertedPanelStateMap[panelState.explicitInput.id], savedDashboardPanelMap[panelState.explicitInput.id])) {
                // A panel was changed
                dirty = true;
                const oldVersion = savedDashboardPanelMap[panelState.explicitInput.id]?.version;
                const newVersion = convertedPanelStateMap[panelState.explicitInput.id]?.version;
                if (oldVersion && newVersion && oldVersion !== newVersion) {
                    dirtyBecauseOfInitialStateMigration = true;
                }
            }
        });
        if (dirty) {
            this.stateContainer.transitions.set('panels', Object.values(convertedPanelStateMap));
            if (dirtyBecauseOfInitialStateMigration) {
                this.saveState({ replace: true });
            }
        }
        if (input.isFullScreenMode !== this.getFullScreenMode()) {
            this.setFullScreenMode(input.isFullScreenMode);
        }
        if (!lodash_1.default.isEqual(input.query, this.getQuery())) {
            this.setQuery(input.query);
        }
        this.changeListeners.forEach(listener => listener({ dirty }));
    }
    getFullScreenMode() {
        return this.appState.fullScreenMode;
    }
    setFullScreenMode(fullScreenMode) {
        this.stateContainer.transitions.set('fullScreenMode', fullScreenMode);
    }
    setFilters(filters) {
        this.stateContainer.transitions.set('filters', filters);
    }
    /**
     * Resets the state back to the last saved version of the dashboard.
     */
    resetState() {
        // In order to show the correct warning, we have to store the unsaved
        // title on the dashboard object. We should fix this at some point, but this is how all the other object
        // save panels work at the moment.
        this.savedDashboard.title = this.savedDashboard.lastSavedTitle;
        // appState.reset uses the internal defaults to reset the state, but some of the default settings (e.g. the panels
        // array) point to the same object that is stored on appState and is getting modified.
        // The right way to fix this might be to ensure the defaults object stored on state is a deep
        // clone, but given how much code uses the state object, I determined that to be too risky of a change for
        // now.  TODO: revisit this!
        this.stateDefaults = lib_1.migrateAppState(lib_1.getAppStateDefaults(this.savedDashboard, this.hideWriteControls), this.kibanaVersion, this.usageCollection);
        // The original query won't be restored by the above because the query on this.savedDashboard is applied
        // in place in order for it to affect the visualizations.
        this.stateDefaults.query = this.lastSavedDashboardFilters.query;
        // Need to make a copy to ensure they are not overwritten.
        this.stateDefaults.filters = [...this.getLastSavedFilterBars()];
        this.isDirty = false;
        this.stateContainer.set(this.stateDefaults);
    }
    /**
     * Returns an object which contains the current filter state of this.savedDashboard.
     */
    getFilterState() {
        return {
            timeTo: this.savedDashboard.timeTo,
            timeFrom: this.savedDashboard.timeFrom,
            filterBars: this.savedDashboard.getFilters(),
            query: this.savedDashboard.getQuery(),
        };
    }
    getTitle() {
        return this.appState.title;
    }
    isSaved() {
        return !!this.savedDashboard.id;
    }
    isNew() {
        return !this.isSaved();
    }
    getDescription() {
        return this.appState.description;
    }
    setDescription(description) {
        this.stateContainer.transitions.set('description', description);
    }
    setTitle(title) {
        this.savedDashboard.title = title;
        this.stateContainer.transitions.set('title', title);
    }
    getAppState() {
        return this.stateContainer.get();
    }
    getQuery() {
        return public_1.migrateLegacyQuery(this.stateContainer.get().query);
    }
    getSavedQueryId() {
        return this.stateContainer.get().savedQuery;
    }
    setSavedQueryId(id) {
        this.stateContainer.transitions.set('savedQuery', id);
    }
    getUseMargins() {
        // Existing dashboards that don't define this should default to false.
        return this.appState.options.useMargins === undefined
            ? false
            : this.appState.options.useMargins;
    }
    setUseMargins(useMargins) {
        this.stateContainer.transitions.setOption('useMargins', useMargins);
    }
    getHidePanelTitles() {
        return this.appState.options.hidePanelTitles;
    }
    setHidePanelTitles(hidePanelTitles) {
        this.stateContainer.transitions.setOption('hidePanelTitles', hidePanelTitles);
    }
    getTimeRestore() {
        return this.appState.timeRestore;
    }
    setTimeRestore(timeRestore) {
        this.stateContainer.transitions.set('timeRestore', timeRestore);
    }
    getIsTimeSavedWithDashboard() {
        return this.savedDashboard.timeRestore;
    }
    getLastSavedFilterBars() {
        return this.lastSavedDashboardFilters.filterBars;
    }
    getLastSavedQuery() {
        return this.lastSavedDashboardFilters.query;
    }
    /**
     * @returns True if the query changed since the last time the dashboard was saved, or if it's a
     * new dashboard, if the query differs from the default.
     */
    getQueryChanged() {
        const currentQuery = this.appState.query;
        const lastSavedQuery = this.getLastSavedQuery();
        const query = public_1.migrateLegacyQuery(currentQuery);
        const isLegacyStringQuery = lodash_1.default.isString(lastSavedQuery) && lodash_1.default.isPlainObject(currentQuery) && lodash_1.default.has(currentQuery, 'query');
        if (isLegacyStringQuery) {
            return lastSavedQuery !== query.query;
        }
        return !lodash_1.default.isEqual(currentQuery, lastSavedQuery);
    }
    /**
     * @returns True if the filter bar state has changed since the last time the dashboard was saved,
     * or if it's a new dashboard, if the query differs from the default.
     */
    getFilterBarChanged() {
        return !lodash_1.default.isEqual(filter_utils_1.FilterUtils.cleanFiltersForComparison(this.appState.filters), filter_utils_1.FilterUtils.cleanFiltersForComparison(this.getLastSavedFilterBars()));
    }
    /**
     * @param timeFilter
     * @returns True if the time state has changed since the time saved with the dashboard.
     */
    getTimeChanged(timeFilter) {
        return (!filter_utils_1.FilterUtils.areTimesEqual(this.lastSavedDashboardFilters.timeFrom, timeFilter.getTime().from) ||
            !filter_utils_1.FilterUtils.areTimesEqual(this.lastSavedDashboardFilters.timeTo, timeFilter.getTime().to));
    }
    getViewMode() {
        return this.hideWriteControls ? embeddable_plugin_1.ViewMode.VIEW : this.appState.viewMode;
    }
    getIsViewMode() {
        return this.getViewMode() === embeddable_plugin_1.ViewMode.VIEW;
    }
    getIsEditMode() {
        return this.getViewMode() === embeddable_plugin_1.ViewMode.EDIT;
    }
    /**
     *
     * @returns True if the dashboard has changed since the last save (or, is new).
     */
    getIsDirty(timeFilter) {
        // Filter bar comparison is done manually (see cleanFiltersForComparison for the reason) and time picker
        // changes are not tracked by the state monitor.
        const hasTimeFilterChanged = timeFilter ? this.getFiltersChanged(timeFilter) : false;
        return this.getIsEditMode() && (this.isDirty || hasTimeFilterChanged);
    }
    getPanels() {
        return this.appState.panels;
    }
    updatePanel(panelIndex, panelAttributes) {
        const foundPanel = this.getPanels().find((panel) => panel.panelIndex === panelIndex);
        Object.assign(foundPanel, panelAttributes);
        return foundPanel;
    }
    /**
     * @param timeFilter
     * @returns An array of user friendly strings indicating the filter types that have changed.
     */
    getChangedFilterTypes(timeFilter) {
        const changedFilters = [];
        if (this.getFilterBarChanged()) {
            changedFilters.push('filter');
        }
        if (this.getQueryChanged()) {
            changedFilters.push('query');
        }
        if (this.savedDashboard.timeRestore && this.getTimeChanged(timeFilter)) {
            changedFilters.push('time range');
        }
        return changedFilters;
    }
    /**
     * @returns True if filters (query, filter bar filters, and time picker if time is stored
     * with the dashboard) have changed since the last saved state (or if the dashboard hasn't been saved,
     * the default state).
     */
    getFiltersChanged(timeFilter) {
        return this.getChangedFilterTypes(timeFilter).length > 0;
    }
    /**
     * Updates timeFilter to match the time saved with the dashboard.
     * @param timeFilter
     * @param timeFilter.setTime
     * @param timeFilter.setRefreshInterval
     */
    syncTimefilterWithDashboardTime(timeFilter) {
        if (!this.getIsTimeSavedWithDashboard()) {
            throw new Error(i18n_1.i18n.translate('dashboard.stateManager.timeNotSavedWithDashboardErrorMessage', {
                defaultMessage: 'The time is not saved with this dashboard so should not be synced.',
            }));
        }
        if (this.savedDashboard.timeFrom && this.savedDashboard.timeTo) {
            timeFilter.setTime({
                from: this.savedDashboard.timeFrom,
                to: this.savedDashboard.timeTo,
            });
        }
    }
    /**
     * Updates timeFilter to match the refreshInterval saved with the dashboard.
     * @param timeFilter
     */
    syncTimefilterWithDashboardRefreshInterval(timeFilter) {
        if (!this.getIsTimeSavedWithDashboard()) {
            throw new Error(i18n_1.i18n.translate('dashboard.stateManager.timeNotSavedWithDashboardErrorMessage', {
                defaultMessage: 'The time is not saved with this dashboard so should not be synced.',
            }));
        }
        if (this.savedDashboard.refreshInterval) {
            timeFilter.setRefreshInterval(this.savedDashboard.refreshInterval);
        }
    }
    /**
     * Synchronously writes current state to url
     * returned boolean indicates whether the update happened and if history was updated
     */
    saveState({ replace }) {
        // schedules setting current state to url
        this.kbnUrlStateStorage.set(this.STATE_STORAGE_KEY, this.toUrlState(this.stateContainer.get()));
        // immediately forces scheduled updates and changes location
        return this.kbnUrlStateStorage.flush({ replace });
    }
    // TODO: find nicer solution for this
    // this function helps to make just 1 browser history update, when we imperatively changing the dashboard url
    // It could be that there is pending *dashboardStateManager* updates, which aren't flushed yet to the url.
    // So to prevent 2 browser updates:
    // 1. Force flush any pending state updates (syncing state to query)
    // 2. If url was updated, then apply path change with replace
    changeDashboardUrl(pathname) {
        // synchronously persist current state to url with push()
        const updated = this.saveState({ replace: false });
        // change pathname
        this.history[updated ? 'replace' : 'push']({
            ...this.history.location,
            pathname,
        });
    }
    setQuery(query) {
        this.stateContainer.transitions.set('query', query);
    }
    /**
     * Applies the current filter state to the dashboard.
     * @param filter An array of filter bar filters.
     */
    applyFilters(query, filters) {
        this.savedDashboard.searchSource.setField('query', query);
        this.savedDashboard.searchSource.setField('filter', filters);
        this.stateContainer.transitions.set('query', query);
    }
    switchViewMode(newMode) {
        this.stateContainer.transitions.set('viewMode', newMode);
    }
    /**
     * Destroys and cleans up this object when it's no longer used.
     */
    destroy() {
        this.stateContainerChangeSub.unsubscribe();
        this.savedDashboard.destroy();
        if (this.stateSyncRef) {
            this.stateSyncRef.stop();
        }
    }
    checkIsDirty() {
        // Filters need to be compared manually because they sometimes have a $$hashkey stored on the object.
        // Query needs to be compared manually because saved legacy queries get migrated in app state automatically
        const propsToIgnore = ['viewMode', 'filters', 'query'];
        const initial = lodash_1.default.omit(this.stateDefaults, propsToIgnore);
        const current = lodash_1.default.omit(this.stateContainer.get(), propsToIgnore);
        return !lodash_1.default.isEqual(initial, current);
    }
    toUrlState(state) {
        if (state.viewMode === embeddable_plugin_1.ViewMode.VIEW) {
            const { panels, ...stateWithoutPanels } = state;
            return stateWithoutPanels;
        }
        return state;
    }
}
exports.DashboardStateManager = DashboardStateManager;
