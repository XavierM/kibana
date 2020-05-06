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
const lodash_1 = require("lodash");
const react_1 = tslib_1.__importStar(require("react"));
const eui_1 = require("@elastic/eui");
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../data/public");
const public_2 = require("../../../charts/public");
const utils_1 = require("./utils");
const { tabifyGetColumns } = public_1.search;
function TableOptions({ aggs, stateParams, setValidity, setValue, }) {
    const percentageColumns = react_1.useMemo(() => [
        {
            value: '',
            text: i18n_1.i18n.translate('visTypeTable.params.defaultPercentageCol', {
                defaultMessage: 'Don’t show',
            }),
        },
        ...tabifyGetColumns(aggs.getResponseAggs(), true)
            .filter(col => lodash_1.get(col.aggConfig.type.getFormat(col.aggConfig), 'type.id') === 'number')
            .map(({ name }) => ({ value: name, text: name })),
    ], [aggs]);
    const isPerPageValid = stateParams.perPage === '' || stateParams.perPage > 0;
    react_1.useEffect(() => {
        setValidity(isPerPageValid);
    }, [isPerPageValid, setValidity]);
    react_1.useEffect(() => {
        if (!percentageColumns.find(({ value }) => value === stateParams.percentageCol) &&
            percentageColumns[0] &&
            percentageColumns[0].value !== stateParams.percentageCol) {
            setValue('percentageCol', percentageColumns[0].value);
        }
    }, [percentageColumns, stateParams.percentageCol, setValidity, setValue]);
    return (react_1.default.createElement(eui_1.EuiPanel, { paddingSize: "s" },
        react_1.default.createElement(public_2.NumberInputOption, { label: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeTable.params.perPageLabel", defaultMessage: "Max rows per page" }),
                ' ',
                react_1.default.createElement(eui_1.EuiIconTip, { content: "Leaving this field empty means it will use number of buckets from the response.", position: "right" })), isInvalid: !isPerPageValid, min: 1, paramName: "perPage", value: stateParams.perPage, setValue: setValue }),
        react_1.default.createElement(public_2.SwitchOption, { label: i18n_1.i18n.translate('visTypeTable.params.showMetricsLabel', {
                defaultMessage: 'Show metrics for every bucket/level',
            }), paramName: "showMetricsAtAllLevels", value: stateParams.showMetricsAtAllLevels, setValue: setValue, "data-test-subj": "showMetricsAtAllLevels" }),
        react_1.default.createElement(public_2.SwitchOption, { label: i18n_1.i18n.translate('visTypeTable.params.showPartialRowsLabel', {
                defaultMessage: 'Show partial rows',
            }), tooltip: i18n_1.i18n.translate('visTypeTable.params.showPartialRowsTip', {
                defaultMessage: 'Show rows that have partial data. This will still calculate metrics for every bucket/level, even if they are not displayed.',
            }), paramName: "showPartialRows", value: stateParams.showPartialRows, setValue: setValue, "data-test-subj": "showPartialRows" }),
        react_1.default.createElement(public_2.SwitchOption, { label: i18n_1.i18n.translate('visTypeTable.params.showTotalLabel', {
                defaultMessage: 'Show total',
            }), paramName: "showTotal", value: stateParams.showTotal, setValue: setValue }),
        react_1.default.createElement(public_2.SelectOption, { label: i18n_1.i18n.translate('visTypeTable.params.totalFunctionLabel', {
                defaultMessage: 'Total function',
            }), disabled: !stateParams.showTotal, options: utils_1.totalAggregations, paramName: "totalFunc", value: stateParams.totalFunc, setValue: setValue }),
        react_1.default.createElement(public_2.SelectOption, { label: i18n_1.i18n.translate('visTypeTable.params.PercentageColLabel', {
                defaultMessage: 'Percentage column',
            }), options: percentageColumns, paramName: "percentageCol", value: stateParams.percentageCol, setValue: setValue, id: "datatableVisualizationPercentageCol" })));
}
exports.TableOptions = TableOptions;
