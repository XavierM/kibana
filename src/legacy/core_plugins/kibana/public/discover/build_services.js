"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_1 = require("../../../../../plugins/discover/public");
async function buildServices(core, plugins, getHistory) {
    const services = {
        savedObjectsClient: core.savedObjects.client,
        indexPatterns: plugins.data.indexPatterns,
        search: plugins.data.search,
        chrome: core.chrome,
        overlays: core.overlays,
    };
    const savedObjectService = public_1.createSavedSearchesLoader(services);
    return {
        addBasePath: core.http.basePath.prepend,
        capabilities: core.application.capabilities,
        chrome: core.chrome,
        core,
        data: plugins.data,
        docLinks: core.docLinks,
        DocViewer: plugins.discover.docViews.DocViewer,
        theme: plugins.charts.theme,
        filterManager: plugins.data.query.filterManager,
        getSavedSearchById: async (id) => savedObjectService.get(id),
        getSavedSearchUrlById: async (id) => savedObjectService.urlFor(id),
        history: getHistory,
        indexPatterns: plugins.data.indexPatterns,
        inspector: plugins.inspector,
        // @ts-ignore
        metadata: core.injectedMetadata.getLegacyMetadata(),
        share: plugins.share,
        timefilter: plugins.data.query.timefilter.timefilter,
        toastNotifications: core.notifications.toasts,
        uiSettings: core.uiSettings,
        visualizations: plugins.visualizations,
    };
}
exports.buildServices = buildServices;
