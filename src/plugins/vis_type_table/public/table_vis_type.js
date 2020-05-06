"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const i18n_1 = require("@kbn/i18n");
const public_1 = require("../../data/public");
const public_2 = require("../../vis_default_editor/public");
const table_vis_response_handler_1 = require("./table_vis_response_handler");
// @ts-ignore
const table_vis_html_1 = tslib_1.__importDefault(require("./table_vis.html"));
const table_vis_options_1 = require("./components/table_vis_options");
const vis_controller_1 = require("./vis_controller");
function getTableVisTypeDefinition(core, context) {
    return {
        type: 'table',
        name: 'table',
        title: i18n_1.i18n.translate('visTypeTable.tableVisTitle', {
            defaultMessage: 'Data Table',
        }),
        icon: 'visTable',
        description: i18n_1.i18n.translate('visTypeTable.tableVisDescription', {
            defaultMessage: 'Display values in a table',
        }),
        visualization: vis_controller_1.getTableVisualizationControllerClass(core, context),
        visConfig: {
            defaults: {
                perPage: 10,
                showPartialRows: false,
                showMetricsAtAllLevels: false,
                sort: {
                    columnIndex: null,
                    direction: null,
                },
                showTotal: false,
                totalFunc: 'sum',
                percentageCol: '',
            },
            template: table_vis_html_1.default,
        },
        editorConfig: {
            optionsTemplate: table_vis_options_1.TableOptions,
            schemas: new public_2.Schemas([
                {
                    group: public_1.AggGroupNames.Metrics,
                    name: 'metric',
                    title: i18n_1.i18n.translate('visTypeTable.tableVisEditorConfig.schemas.metricTitle', {
                        defaultMessage: 'Metric',
                    }),
                    aggFilter: ['!geo_centroid', '!geo_bounds'],
                    aggSettings: {
                        top_hits: {
                            allowStrings: true,
                        },
                    },
                    min: 1,
                    defaults: [{ type: 'count', schema: 'metric' }],
                },
                {
                    group: public_1.AggGroupNames.Buckets,
                    name: 'bucket',
                    title: i18n_1.i18n.translate('visTypeTable.tableVisEditorConfig.schemas.bucketTitle', {
                        defaultMessage: 'Split rows',
                    }),
                    aggFilter: ['!filter'],
                },
                {
                    group: public_1.AggGroupNames.Buckets,
                    name: 'split',
                    title: i18n_1.i18n.translate('visTypeTable.tableVisEditorConfig.schemas.splitTitle', {
                        defaultMessage: 'Split table',
                    }),
                    min: 0,
                    max: 1,
                    aggFilter: ['!filter'],
                },
            ]),
        },
        responseHandler: table_vis_response_handler_1.tableVisResponseHandler,
        hierarchicalData: (vis) => {
            return Boolean(vis.params.showPartialRows || vis.params.showMetricsAtAllLevels);
        },
    };
}
exports.getTableVisTypeDefinition = getTableVisTypeDefinition;
