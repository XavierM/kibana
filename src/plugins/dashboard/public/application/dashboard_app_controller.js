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
const lodash_1 = tslib_1.__importStar(require("lodash"));
const i18n_1 = require("@kbn/i18n");
const eui_1 = require("@elastic/eui");
const react_1 = tslib_1.__importDefault(require("react"));
const react_dom_1 = tslib_1.__importDefault(require("react-dom"));
const angular_1 = tslib_1.__importDefault(require("angular"));
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/operators");
const dashboard_empty_screen_1 = require("./dashboard_empty_screen");
const public_1 = require("../../../data/public");
const public_2 = require("../../../saved_objects/public");
const embeddable_1 = require("./embeddable");
const public_3 = require("../../../embeddable/public");
const show_options_popover_1 = require("./top_nav/show_options_popover");
const save_modal_1 = require("./top_nav/save_modal");
const show_clone_modal_1 = require("./top_nav/show_clone_modal");
const lib_1 = require("./lib");
const dashboard_state_manager_1 = require("./dashboard_state_manager");
const dashboard_constants_1 = require("../dashboard_constants");
const get_top_nav_config_1 = require("./top_nav/get_top_nav_config");
const top_nav_ids_1 = require("./top_nav/top_nav_ids");
const dashboard_strings_1 = require("./dashboard_strings");
const embeddable_saved_object_converters_1 = require("./lib/embeddable_saved_object_converters");
const public_4 = require("../../../kibana_utils/public");
const public_5 = require("../../../kibana_legacy/public");
class DashboardAppController {
    constructor({ pluginInitializerContext, $scope, $route, $routeParams, dashboardConfig, localStorage, indexPatterns, savedQueryService, embeddable, share, dashboardCapabilities, embeddableCapabilities: { visualizeCapabilities, mapsCapabilities }, data: { query: queryService }, core: { notifications, overlays, chrome, injectedMetadata, fatalErrors, uiSettings, savedObjects, http, i18n: i18nStart, }, history, kbnUrlStateStorage, usageCollection, navigation, }) {
        const filterManager = queryService.filterManager;
        const queryFilter = filterManager;
        const timefilter = queryService.timefilter.timefilter;
        let showSearchBar = true;
        let showQueryBar = true;
        let lastReloadRequestTime = 0;
        const dash = ($scope.dash = $route.current.locals.dash);
        if (dash.id) {
            chrome.docTitle.change(dash.title);
        }
        const dashboardStateManager = new dashboard_state_manager_1.DashboardStateManager({
            savedDashboard: dash,
            hideWriteControls: dashboardConfig.getHideWriteControls(),
            kibanaVersion: pluginInitializerContext.env.packageInfo.version,
            kbnUrlStateStorage,
            history,
            usageCollection,
        });
        // sync initial app filters from state to filterManager
        // if there is an existing similar global filter, then leave it as global
        filterManager.setAppFilters(lodash_1.default.cloneDeep(dashboardStateManager.appState.filters));
        // setup syncing of app filters between appState and filterManager
        const stopSyncingAppFilters = public_1.connectToQueryState(queryService, {
            set: ({ filters }) => dashboardStateManager.setFilters(filters || []),
            get: () => ({ filters: dashboardStateManager.appState.filters }),
            state$: dashboardStateManager.appState$.pipe(operators_1.map(state => ({
                filters: state.filters,
            }))),
        }, {
            filters: public_1.esFilters.FilterStateStore.APP_STATE,
        });
        // The hash check is so we only update the time filter on dashboard open, not during
        // normal cross app navigation.
        if (dashboardStateManager.getIsTimeSavedWithDashboard()) {
            const initialGlobalStateInUrl = kbnUrlStateStorage.get('_g');
            if (!initialGlobalStateInUrl?.time) {
                dashboardStateManager.syncTimefilterWithDashboardTime(timefilter);
            }
            if (!initialGlobalStateInUrl?.refreshInterval) {
                dashboardStateManager.syncTimefilterWithDashboardRefreshInterval(timefilter);
            }
        }
        // starts syncing `_g` portion of url with query services
        // it is important to start this syncing after `dashboardStateManager.syncTimefilterWithDashboard(timefilter);` above is run,
        // otherwise it will case redundant browser history records
        const { stop: stopSyncingQueryServiceStateWithUrl } = public_1.syncQueryStateWithUrl(queryService, kbnUrlStateStorage);
        // starts syncing `_a` portion of url
        dashboardStateManager.startStateSyncing();
        $scope.showSaveQuery = dashboardCapabilities.saveQuery;
        const getShouldShowEditHelp = () => !dashboardStateManager.getPanels().length &&
            dashboardStateManager.getIsEditMode() &&
            !dashboardConfig.getHideWriteControls();
        const getShouldShowViewHelp = () => !dashboardStateManager.getPanels().length &&
            dashboardStateManager.getIsViewMode() &&
            !dashboardConfig.getHideWriteControls();
        const shouldShowUnauthorizedEmptyState = () => {
            const readonlyMode = !dashboardStateManager.getPanels().length &&
                !getShouldShowEditHelp() &&
                !getShouldShowViewHelp() &&
                dashboardConfig.getHideWriteControls();
            const userHasNoPermissions = !dashboardStateManager.getPanels().length &&
                !visualizeCapabilities.save &&
                !mapsCapabilities.save;
            return readonlyMode || userHasNoPermissions;
        };
        const addVisualization = () => {
            navActions[top_nav_ids_1.TopNavIds.VISUALIZE]();
        };
        const updateIndexPatterns = (container) => {
            if (!container || public_3.isErrorEmbeddable(container)) {
                return;
            }
            let panelIndexPatterns = [];
            Object.values(container.getChildIds()).forEach(id => {
                const embeddableInstance = container.getChild(id);
                if (public_3.isErrorEmbeddable(embeddableInstance))
                    return;
                const embeddableIndexPatterns = embeddableInstance.getOutput().indexPatterns;
                if (!embeddableIndexPatterns)
                    return;
                panelIndexPatterns.push(...embeddableIndexPatterns);
            });
            panelIndexPatterns = lodash_1.uniq(panelIndexPatterns, 'id');
            if (panelIndexPatterns && panelIndexPatterns.length > 0) {
                $scope.$evalAsync(() => {
                    $scope.indexPatterns = panelIndexPatterns;
                });
            }
            else {
                indexPatterns.getDefault().then(defaultIndexPattern => {
                    $scope.$evalAsync(() => {
                        $scope.indexPatterns = [defaultIndexPattern];
                    });
                });
            }
        };
        const showFilterBar = () => $scope.model.filters.length > 0 || !dashboardStateManager.getFullScreenMode();
        const getEmptyScreenProps = (shouldShowEditHelp, isEmptyInReadOnlyMode) => {
            const emptyScreenProps = {
                onLinkClick: shouldShowEditHelp ? $scope.showAddPanel : $scope.enterEditMode,
                showLinkToVisualize: shouldShowEditHelp,
                uiSettings,
                http,
            };
            if (shouldShowEditHelp) {
                emptyScreenProps.onVisualizeClick = addVisualization;
            }
            if (isEmptyInReadOnlyMode) {
                emptyScreenProps.isReadonlyMode = true;
            }
            return emptyScreenProps;
        };
        const getDashboardInput = () => {
            const embeddablesMap = {};
            dashboardStateManager.getPanels().forEach((panel) => {
                embeddablesMap[panel.panelIndex] = embeddable_saved_object_converters_1.convertSavedDashboardPanelToPanelState(panel);
            });
            let expandedPanelId;
            if (dashboardContainer && !public_3.isErrorEmbeddable(dashboardContainer)) {
                expandedPanelId = dashboardContainer.getInput().expandedPanelId;
            }
            const shouldShowEditHelp = getShouldShowEditHelp();
            const shouldShowViewHelp = getShouldShowViewHelp();
            const isEmptyInReadonlyMode = shouldShowUnauthorizedEmptyState();
            return {
                id: dashboardStateManager.savedDashboard.id || '',
                filters: queryFilter.getFilters(),
                hidePanelTitles: dashboardStateManager.getHidePanelTitles(),
                query: $scope.model.query,
                timeRange: {
                    ...lodash_1.default.cloneDeep(timefilter.getTime()),
                },
                refreshConfig: timefilter.getRefreshInterval(),
                viewMode: dashboardStateManager.getViewMode(),
                panels: embeddablesMap,
                isFullScreenMode: dashboardStateManager.getFullScreenMode(),
                isEmptyState: shouldShowEditHelp || shouldShowViewHelp || isEmptyInReadonlyMode,
                useMargins: dashboardStateManager.getUseMargins(),
                lastReloadRequestTime,
                title: dashboardStateManager.getTitle(),
                description: dashboardStateManager.getDescription(),
                expandedPanelId,
            };
        };
        const updateState = () => {
            // Following the "best practice" of always have a '.' in your ng-models –
            // https://github.com/angular/angular.js/wiki/Understanding-Scopes
            $scope.model = {
                query: dashboardStateManager.getQuery(),
                filters: queryFilter.getFilters(),
                timeRestore: dashboardStateManager.getTimeRestore(),
                title: dashboardStateManager.getTitle(),
                description: dashboardStateManager.getDescription(),
                timeRange: timefilter.getTime(),
                refreshInterval: timefilter.getRefreshInterval(),
            };
            $scope.panels = dashboardStateManager.getPanels();
        };
        updateState();
        let dashboardContainer;
        let inputSubscription;
        let outputSubscription;
        const dashboardDom = document.getElementById('dashboardViewport');
        const dashboardFactory = embeddable.getEmbeddableFactory(embeddable_1.DASHBOARD_CONTAINER_TYPE);
        if (dashboardFactory) {
            dashboardFactory
                .create(getDashboardInput())
                .then((container) => {
                if (container && !public_3.isErrorEmbeddable(container)) {
                    dashboardContainer = container;
                    dashboardContainer.renderEmpty = () => {
                        const shouldShowEditHelp = getShouldShowEditHelp();
                        const shouldShowViewHelp = getShouldShowViewHelp();
                        const isEmptyInReadOnlyMode = shouldShowUnauthorizedEmptyState();
                        const isEmptyState = shouldShowEditHelp || shouldShowViewHelp || isEmptyInReadOnlyMode;
                        return isEmptyState ? (react_1.default.createElement(dashboard_empty_screen_1.DashboardEmptyScreen, Object.assign({}, getEmptyScreenProps(shouldShowEditHelp, isEmptyInReadOnlyMode)))) : null;
                    };
                    updateIndexPatterns(dashboardContainer);
                    outputSubscription = dashboardContainer.getOutput$().subscribe(() => {
                        updateIndexPatterns(dashboardContainer);
                    });
                    inputSubscription = dashboardContainer.getInput$().subscribe(() => {
                        let dirty = false;
                        // This has to be first because handleDashboardContainerChanges causes
                        // appState.save which will cause refreshDashboardContainer to be called.
                        if (!public_1.esFilters.compareFilters(container.getInput().filters, queryFilter.getFilters(), public_1.esFilters.COMPARE_ALL_OPTIONS)) {
                            // Add filters modifies the object passed to it, hence the clone deep.
                            queryFilter.addFilters(lodash_1.default.cloneDeep(container.getInput().filters));
                            dashboardStateManager.applyFilters($scope.model.query, container.getInput().filters);
                            dirty = true;
                        }
                        dashboardStateManager.handleDashboardContainerChanges(container);
                        $scope.$evalAsync(() => {
                            if (dirty) {
                                updateState();
                            }
                        });
                    });
                    dashboardStateManager.registerChangeListener(() => {
                        // we aren't checking dirty state because there are changes the container needs to know about
                        // that won't make the dashboard "dirty" - like a view mode change.
                        refreshDashboardContainer();
                    });
                    // This code needs to be replaced with a better mechanism for adding new embeddables of
                    // any type from the add panel. Likely this will happen via creating a visualization "inline",
                    // without navigating away from the UX.
                    if ($routeParams[dashboard_constants_1.DashboardConstants.ADD_EMBEDDABLE_TYPE]) {
                        const type = $routeParams[dashboard_constants_1.DashboardConstants.ADD_EMBEDDABLE_TYPE];
                        const id = $routeParams[dashboard_constants_1.DashboardConstants.ADD_EMBEDDABLE_ID];
                        container.addNewEmbeddable(type, { savedObjectId: id });
                        public_4.removeQueryParam(history, dashboard_constants_1.DashboardConstants.ADD_EMBEDDABLE_TYPE);
                        public_4.removeQueryParam(history, dashboard_constants_1.DashboardConstants.ADD_EMBEDDABLE_ID);
                    }
                }
                if (dashboardDom && container) {
                    container.render(dashboardDom);
                }
            });
        }
        // Part of the exposed plugin API - do not remove without careful consideration.
        this.appStatus = {
            dirty: !dash.id,
        };
        dashboardStateManager.registerChangeListener(status => {
            this.appStatus.dirty = status.dirty || !dash.id;
            updateState();
        });
        dashboardStateManager.applyFilters(dashboardStateManager.getQuery() || {
            query: '',
            language: localStorage.get('kibana.userQueryLanguage') || uiSettings.get('search:queryLanguage'),
        }, queryFilter.getFilters());
        timefilter.disableTimeRangeSelector();
        timefilter.disableAutoRefreshSelector();
        const landingPageUrl = () => `#${dashboard_constants_1.DashboardConstants.LANDING_PAGE_PATH}`;
        const getDashTitle = () => dashboard_strings_1.getDashboardTitle(dashboardStateManager.getTitle(), dashboardStateManager.getViewMode(), dashboardStateManager.getIsDirty(timefilter), dashboardStateManager.isNew());
        // Push breadcrumbs to new header navigation
        const updateBreadcrumbs = () => {
            chrome.setBreadcrumbs([
                {
                    text: i18n_1.i18n.translate('dashboard.dashboardAppBreadcrumbsTitle', {
                        defaultMessage: 'Dashboard',
                    }),
                    href: landingPageUrl(),
                },
                { text: getDashTitle() },
            ]);
        };
        updateBreadcrumbs();
        dashboardStateManager.registerChangeListener(updateBreadcrumbs);
        const getChangesFromAppStateForContainerState = () => {
            const appStateDashboardInput = getDashboardInput();
            if (!dashboardContainer || public_3.isErrorEmbeddable(dashboardContainer)) {
                return appStateDashboardInput;
            }
            const containerInput = dashboardContainer.getInput();
            const differences = {};
            // Filters shouldn't  be compared using regular isEqual
            if (!public_1.esFilters.compareFilters(containerInput.filters, appStateDashboardInput.filters, public_1.esFilters.COMPARE_ALL_OPTIONS)) {
                differences.filters = appStateDashboardInput.filters;
            }
            Object.keys(lodash_1.default.omit(containerInput, 'filters')).forEach(key => {
                const containerValue = containerInput[key];
                const appStateValue = appStateDashboardInput[key];
                if (!lodash_1.default.isEqual(containerValue, appStateValue)) {
                    differences[key] = appStateValue;
                }
            });
            // cloneDeep hack is needed, as there are multiple place, where container's input mutated,
            // but values from appStateValue are deeply frozen, as they can't be mutated directly
            return Object.values(differences).length === 0 ? undefined : lodash_1.default.cloneDeep(differences);
        };
        const refreshDashboardContainer = () => {
            const changes = getChangesFromAppStateForContainerState();
            if (changes && dashboardContainer) {
                dashboardContainer.updateInput(changes);
            }
        };
        $scope.updateQueryAndFetch = function ({ query, dateRange }) {
            if (dateRange) {
                timefilter.setTime(dateRange);
            }
            const oldQuery = $scope.model.query;
            if (lodash_1.default.isEqual(oldQuery, query)) {
                // The user can still request a reload in the query bar, even if the
                // query is the same, and in that case, we have to explicitly ask for
                // a reload, since no state changes will cause it.
                lastReloadRequestTime = new Date().getTime();
                refreshDashboardContainer();
            }
            else {
                $scope.model.query = query;
                dashboardStateManager.applyFilters($scope.model.query, $scope.model.filters);
            }
        };
        const updateStateFromSavedQuery = (savedQuery) => {
            const allFilters = filterManager.getFilters();
            dashboardStateManager.applyFilters(savedQuery.attributes.query, allFilters);
            if (savedQuery.attributes.timefilter) {
                timefilter.setTime({
                    from: savedQuery.attributes.timefilter.from,
                    to: savedQuery.attributes.timefilter.to,
                });
                if (savedQuery.attributes.timefilter.refreshInterval) {
                    timefilter.setRefreshInterval(savedQuery.attributes.timefilter.refreshInterval);
                }
            }
            // Making this method sync broke the updates.
            // Temporary fix, until we fix the complex state in this file.
            setTimeout(() => {
                queryFilter.setFilters(allFilters);
            }, 0);
        };
        $scope.$watch('savedQuery', (newSavedQuery) => {
            if (!newSavedQuery)
                return;
            dashboardStateManager.setSavedQueryId(newSavedQuery.id);
            updateStateFromSavedQuery(newSavedQuery);
        });
        $scope.$watch(() => {
            return dashboardStateManager.getSavedQueryId();
        }, newSavedQueryId => {
            if (!newSavedQueryId) {
                $scope.savedQuery = undefined;
                return;
            }
            if (!$scope.savedQuery || newSavedQueryId !== $scope.savedQuery.id) {
                savedQueryService.getSavedQuery(newSavedQueryId).then((savedQuery) => {
                    $scope.$evalAsync(() => {
                        $scope.savedQuery = savedQuery;
                        updateStateFromSavedQuery(savedQuery);
                    });
                });
            }
        });
        $scope.indexPatterns = [];
        $scope.$watch('model.query', (newQuery) => {
            const query = public_5.migrateLegacyQuery(newQuery);
            $scope.updateQueryAndFetch({ query });
        });
        $scope.$watch(() => dashboardCapabilities.saveQuery, newCapability => {
            $scope.showSaveQuery = newCapability;
        });
        const onSavedQueryIdChange = (savedQueryId) => {
            dashboardStateManager.setSavedQueryId(savedQueryId);
        };
        const getNavBarProps = () => {
            const isFullScreenMode = dashboardStateManager.getFullScreenMode();
            const screenTitle = dashboardStateManager.getTitle();
            return {
                appName: 'dashboard',
                config: $scope.isVisible ? $scope.topNavMenu : undefined,
                className: isFullScreenMode ? 'kbnTopNavMenu-isFullScreen' : undefined,
                screenTitle,
                showSearchBar,
                showQueryBar,
                showFilterBar: showFilterBar(),
                indexPatterns: $scope.indexPatterns,
                showSaveQuery: $scope.showSaveQuery,
                query: $scope.model.query,
                savedQuery: $scope.savedQuery,
                onSavedQueryIdChange,
                savedQueryId: dashboardStateManager.getSavedQueryId(),
                useDefaultBehaviors: true,
                onQuerySubmit: (payload) => {
                    if (!payload.query) {
                        $scope.updateQueryAndFetch({ query: $scope.model.query, dateRange: payload.dateRange });
                    }
                    else {
                        $scope.updateQueryAndFetch({ query: payload.query, dateRange: payload.dateRange });
                    }
                },
            };
        };
        const dashboardNavBar = document.getElementById('dashboardChrome');
        const updateNavBar = () => {
            react_dom_1.default.render(react_1.default.createElement(navigation.ui.TopNavMenu, Object.assign({}, getNavBarProps())), dashboardNavBar);
        };
        const unmountNavBar = () => {
            if (dashboardNavBar) {
                react_dom_1.default.unmountComponentAtNode(dashboardNavBar);
            }
        };
        $scope.timefilterSubscriptions$ = new rxjs_1.Subscription();
        $scope.timefilterSubscriptions$.add(public_5.subscribeWithScope($scope, timefilter.getRefreshIntervalUpdate$(), {
            next: () => {
                updateState();
                refreshDashboardContainer();
            },
        }, (error) => public_5.addFatalError(fatalErrors, error)));
        $scope.timefilterSubscriptions$.add(public_5.subscribeWithScope($scope, timefilter.getTimeUpdate$(), {
            next: () => {
                updateState();
                refreshDashboardContainer();
            },
        }, (error) => public_5.addFatalError(fatalErrors, error)));
        function updateViewMode(newMode) {
            dashboardStateManager.switchViewMode(newMode);
        }
        const onChangeViewMode = (newMode) => {
            const isPageRefresh = newMode === dashboardStateManager.getViewMode();
            const isLeavingEditMode = !isPageRefresh && newMode === public_3.ViewMode.VIEW;
            const willLoseChanges = isLeavingEditMode && dashboardStateManager.getIsDirty(timefilter);
            if (!willLoseChanges) {
                updateViewMode(newMode);
                return;
            }
            function revertChangesAndExitEditMode() {
                dashboardStateManager.resetState();
                // This is only necessary for new dashboards, which will default to Edit mode.
                updateViewMode(public_3.ViewMode.VIEW);
                // We need to do a hard reset of the timepicker. appState will not reload like
                // it does on 'open' because it's been saved to the url and the getAppState.previouslyStored() check on
                // reload will cause it not to sync.
                if (dashboardStateManager.getIsTimeSavedWithDashboard()) {
                    dashboardStateManager.syncTimefilterWithDashboardTime(timefilter);
                    dashboardStateManager.syncTimefilterWithDashboardRefreshInterval(timefilter);
                }
                // Angular's $location skips this update because of history updates from syncState which happen simultaneously
                // when calling kbnUrl.change() angular schedules url update and when angular finally starts to process it,
                // the update is considered outdated and angular skips it
                // so have to use implementation of dashboardStateManager.changeDashboardUrl, which workarounds those issues
                dashboardStateManager.changeDashboardUrl(dash.id ? dashboard_constants_1.createDashboardEditUrl(dash.id) : dashboard_constants_1.DashboardConstants.CREATE_NEW_DASHBOARD_URL);
            }
            overlays
                .openConfirm(i18n_1.i18n.translate('dashboard.changeViewModeConfirmModal.discardChangesDescription', {
                defaultMessage: `Once you discard your changes, there's no getting them back.`,
            }), {
                confirmButtonText: i18n_1.i18n.translate('dashboard.changeViewModeConfirmModal.confirmButtonLabel', { defaultMessage: 'Discard changes' }),
                cancelButtonText: i18n_1.i18n.translate('dashboard.changeViewModeConfirmModal.cancelButtonLabel', { defaultMessage: 'Continue editing' }),
                defaultFocusedButton: eui_1.EUI_MODAL_CANCEL_BUTTON,
                title: i18n_1.i18n.translate('dashboard.changeViewModeConfirmModal.discardChangesTitle', {
                    defaultMessage: 'Discard changes to dashboard?',
                }),
            })
                .then(isConfirmed => {
                if (isConfirmed) {
                    revertChangesAndExitEditMode();
                }
            });
            updateNavBar();
        };
        /**
         * Saves the dashboard.
         *
         * @param {object} [saveOptions={}]
         * @property {boolean} [saveOptions.confirmOverwrite=false] - If true, attempts to create the source so it
         * can confirm an overwrite if a document with the id already exists.
         * @property {boolean} [saveOptions.isTitleDuplicateConfirmed=false] - If true, save allowed with duplicate title
         * @property {func} [saveOptions.onTitleDuplicate] - function called if duplicate title exists.
         * When not provided, confirm modal will be displayed asking user to confirm or cancel save.
         * @return {Promise}
         * @resolved {String} - The id of the doc
         */
        function save(saveOptions) {
            return lib_1.saveDashboard(angular_1.default.toJson, timefilter, dashboardStateManager, saveOptions)
                .then(function (id) {
                if (id) {
                    notifications.toasts.addSuccess({
                        title: i18n_1.i18n.translate('dashboard.dashboardWasSavedSuccessMessage', {
                            defaultMessage: `Dashboard '{dashTitle}' was saved`,
                            values: { dashTitle: dash.title },
                        }),
                        'data-test-subj': 'saveDashboardSuccess',
                    });
                    if (dash.id !== $routeParams.id) {
                        // Angular's $location skips this update because of history updates from syncState which happen simultaneously
                        // when calling kbnUrl.change() angular schedules url update and when angular finally starts to process it,
                        // the update is considered outdated and angular skips it
                        // so have to use implementation of dashboardStateManager.changeDashboardUrl, which workarounds those issues
                        dashboardStateManager.changeDashboardUrl(dashboard_constants_1.createDashboardEditUrl(dash.id));
                    }
                    else {
                        chrome.docTitle.change(dash.lastSavedTitle);
                        updateViewMode(public_3.ViewMode.VIEW);
                    }
                }
                return { id };
            })
                .catch(error => {
                notifications.toasts.addDanger({
                    title: i18n_1.i18n.translate('dashboard.dashboardWasNotSavedDangerMessage', {
                        defaultMessage: `Dashboard '{dashTitle}' was not saved. Error: {errorMessage}`,
                        values: {
                            dashTitle: dash.title,
                            errorMessage: error.message,
                        },
                    }),
                    'data-test-subj': 'saveDashboardFailure',
                });
                return { error };
            });
        }
        $scope.showAddPanel = () => {
            dashboardStateManager.setFullScreenMode(false);
            /*
             * Temp solution for triggering menu click.
             * When de-angularizing this code, please call the underlaying action function
             * directly and not via the top nav object.
             **/
            navActions[top_nav_ids_1.TopNavIds.ADD_EXISTING]();
        };
        $scope.enterEditMode = () => {
            dashboardStateManager.setFullScreenMode(false);
            /*
             * Temp solution for triggering menu click.
             * When de-angularizing this code, please call the underlaying action function
             * directly and not via the top nav object.
             **/
            navActions[top_nav_ids_1.TopNavIds.ENTER_EDIT_MODE]();
        };
        const navActions = {};
        navActions[top_nav_ids_1.TopNavIds.FULL_SCREEN] = () => {
            dashboardStateManager.setFullScreenMode(true);
            showQueryBar = false;
            updateNavBar();
        };
        navActions[top_nav_ids_1.TopNavIds.EXIT_EDIT_MODE] = () => onChangeViewMode(public_3.ViewMode.VIEW);
        navActions[top_nav_ids_1.TopNavIds.ENTER_EDIT_MODE] = () => onChangeViewMode(public_3.ViewMode.EDIT);
        navActions[top_nav_ids_1.TopNavIds.SAVE] = () => {
            const currentTitle = dashboardStateManager.getTitle();
            const currentDescription = dashboardStateManager.getDescription();
            const currentTimeRestore = dashboardStateManager.getTimeRestore();
            const onSave = ({ newTitle, newDescription, newCopyOnSave, newTimeRestore, isTitleDuplicateConfirmed, onTitleDuplicate, }) => {
                dashboardStateManager.setTitle(newTitle);
                dashboardStateManager.setDescription(newDescription);
                dashboardStateManager.savedDashboard.copyOnSave = newCopyOnSave;
                dashboardStateManager.setTimeRestore(newTimeRestore);
                const saveOptions = {
                    confirmOverwrite: false,
                    isTitleDuplicateConfirmed,
                    onTitleDuplicate,
                };
                return save(saveOptions).then((response) => {
                    // If the save wasn't successful, put the original values back.
                    if (!response.id) {
                        dashboardStateManager.setTitle(currentTitle);
                        dashboardStateManager.setDescription(currentDescription);
                        dashboardStateManager.setTimeRestore(currentTimeRestore);
                    }
                    return response;
                });
            };
            const dashboardSaveModal = (react_1.default.createElement(save_modal_1.DashboardSaveModal, { onSave: onSave, onClose: () => { }, title: currentTitle, description: currentDescription, timeRestore: currentTimeRestore, showCopyOnSave: dash.id ? true : false }));
            public_2.showSaveModal(dashboardSaveModal, i18nStart.Context);
        };
        navActions[top_nav_ids_1.TopNavIds.CLONE] = () => {
            const currentTitle = dashboardStateManager.getTitle();
            const onClone = (newTitle, isTitleDuplicateConfirmed, onTitleDuplicate) => {
                dashboardStateManager.savedDashboard.copyOnSave = true;
                dashboardStateManager.setTitle(newTitle);
                const saveOptions = {
                    confirmOverwrite: false,
                    isTitleDuplicateConfirmed,
                    onTitleDuplicate,
                };
                return save(saveOptions).then((response) => {
                    // If the save wasn't successful, put the original title back.
                    if (response.error) {
                        dashboardStateManager.setTitle(currentTitle);
                    }
                    updateNavBar();
                    return response;
                });
            };
            show_clone_modal_1.showCloneModal(onClone, currentTitle);
        };
        navActions[top_nav_ids_1.TopNavIds.ADD_EXISTING] = () => {
            if (dashboardContainer && !public_3.isErrorEmbeddable(dashboardContainer)) {
                public_3.openAddPanelFlyout({
                    embeddable: dashboardContainer,
                    getAllFactories: embeddable.getEmbeddableFactories,
                    getFactory: embeddable.getEmbeddableFactory,
                    notifications,
                    overlays,
                    SavedObjectFinder: public_2.getSavedObjectFinder(savedObjects, uiSettings),
                });
            }
        };
        navActions[top_nav_ids_1.TopNavIds.VISUALIZE] = async () => {
            const type = 'visualization';
            const factory = embeddable.getEmbeddableFactory(type);
            if (!factory) {
                throw new public_3.EmbeddableFactoryNotFoundError(type);
            }
            const explicitInput = await factory.getExplicitInput();
            if (dashboardContainer) {
                await dashboardContainer.addNewEmbeddable(type, explicitInput);
            }
        };
        navActions[top_nav_ids_1.TopNavIds.OPTIONS] = anchorElement => {
            show_options_popover_1.showOptionsPopover({
                anchorElement,
                useMargins: dashboardStateManager.getUseMargins(),
                onUseMarginsChange: (isChecked) => {
                    dashboardStateManager.setUseMargins(isChecked);
                },
                hidePanelTitles: dashboardStateManager.getHidePanelTitles(),
                onHidePanelTitlesChange: (isChecked) => {
                    dashboardStateManager.setHidePanelTitles(isChecked);
                },
            });
        };
        if (share) {
            // the share button is only availabale if "share" plugin contract enabled
            navActions[top_nav_ids_1.TopNavIds.SHARE] = anchorElement => {
                share.toggleShareContextMenu({
                    anchorElement,
                    allowEmbed: true,
                    allowShortUrl: !dashboardConfig.getHideWriteControls() || dashboardCapabilities.createShortUrl,
                    shareableUrl: public_4.unhashUrl(window.location.href),
                    objectId: dash.id,
                    objectType: 'dashboard',
                    sharingData: {
                        title: dash.title,
                    },
                    isDirty: dashboardStateManager.getIsDirty(),
                });
            };
        }
        updateViewMode(dashboardStateManager.getViewMode());
        // update root source when filters update
        const updateSubscription = queryFilter.getUpdates$().subscribe({
            next: () => {
                $scope.model.filters = queryFilter.getFilters();
                dashboardStateManager.applyFilters($scope.model.query, $scope.model.filters);
                if (dashboardContainer) {
                    dashboardContainer.updateInput({ filters: $scope.model.filters });
                }
            },
        });
        const visibleSubscription = chrome.getIsVisible$().subscribe(isVisible => {
            $scope.$evalAsync(() => {
                $scope.isVisible = isVisible;
                showSearchBar = isVisible || showFilterBar();
                showQueryBar = !dashboardStateManager.getFullScreenMode() && isVisible;
                updateNavBar();
            });
        });
        dashboardStateManager.registerChangeListener(() => {
            // view mode could have changed, so trigger top nav update
            $scope.topNavMenu = get_top_nav_config_1.getTopNavConfig(dashboardStateManager.getViewMode(), navActions, dashboardConfig.getHideWriteControls());
            updateNavBar();
        });
        $scope.$watch('indexPatterns', () => {
            updateNavBar();
        });
        $scope.$on('$destroy', () => {
            // we have to unmount nav bar manually to make sure all internal subscriptions are unsubscribed
            unmountNavBar();
            updateSubscription.unsubscribe();
            stopSyncingQueryServiceStateWithUrl();
            stopSyncingAppFilters();
            visibleSubscription.unsubscribe();
            $scope.timefilterSubscriptions$.unsubscribe();
            dashboardStateManager.destroy();
            if (inputSubscription) {
                inputSubscription.unsubscribe();
            }
            if (outputSubscription) {
                outputSubscription.unsubscribe();
            }
            if (dashboardContainer) {
                dashboardContainer.destroy();
            }
        });
    }
}
exports.DashboardAppController = DashboardAppController;
