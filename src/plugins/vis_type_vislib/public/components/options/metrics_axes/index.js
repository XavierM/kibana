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
const lodash_1 = require("lodash");
const eui_1 = require("@elastic/eui");
const series_panel_1 = require("./series_panel");
const category_axis_panel_1 = require("./category_axis_panel");
const value_axes_panel_1 = require("./value_axes_panel");
const utils_1 = require("./utils");
const VALUE_AXIS_PREFIX = 'ValueAxis-';
function MetricsAxisOptions(props) {
    const { stateParams, setValue, aggs, vis, isTabSelected } = props;
    const [isCategoryAxisHorizontal, setIsCategoryAxisHorizontal] = react_1.useState(true);
    const setParamByIndex = react_1.useCallback((axesName, index, paramName, value) => {
        const items = stateParams[axesName];
        const array = [...items];
        array[index] = {
            ...array[index],
            [paramName]: value,
        };
        setValue(axesName, array);
    }, [stateParams, setValue]);
    const setCategoryAxis = react_1.useCallback((value) => {
        const categoryAxes = [...stateParams.categoryAxes];
        categoryAxes[0] = value;
        setValue('categoryAxes', categoryAxes);
    }, [setValue, stateParams.categoryAxes]);
    // stores previous aggs' custom labels
    const [lastCustomLabels, setLastCustomLabels] = react_1.useState({});
    // stores previous aggs' field and type
    const [lastSeriesAgg, setLastSeriesAgg] = react_1.useState({});
    const updateAxisTitle = react_1.useCallback((seriesParams) => {
        const series = seriesParams || stateParams.seriesParams;
        let isAxesChanged = false;
        let lastValuesChanged = false;
        const lastLabels = { ...lastCustomLabels };
        const lastMatchingSeriesAgg = { ...lastSeriesAgg };
        const axes = stateParams.valueAxes.map((axis, axisNumber) => {
            let newCustomLabel = '';
            let updatedAxis;
            const matchingSeries = [];
            series.forEach((serie, seriesIndex) => {
                if ((axisNumber === 0 && !serie.valueAxis) || serie.valueAxis === axis.id) {
                    const aggByIndex = aggs.bySchemaName('metric')[seriesIndex];
                    matchingSeries.push(aggByIndex);
                }
            });
            if (matchingSeries.length === 1) {
                // if several series matches to the axis, axis title is set according to the first serie.
                newCustomLabel = matchingSeries[0].makeLabel();
            }
            if (lastCustomLabels[axis.id] !== newCustomLabel && newCustomLabel !== '') {
                const lastSeriesAggType = lodash_1.get(lastSeriesAgg, `${matchingSeries[0].id}.type`);
                const lastSeriesAggField = lodash_1.get(lastSeriesAgg, `${matchingSeries[0].id}.field`);
                const matchingSeriesAggType = lodash_1.get(matchingSeries, '[0]type.name', '');
                const matchingSeriesAggField = lodash_1.get(matchingSeries, '[0]params.field.name', '');
                const aggTypeIsChanged = lastSeriesAggType !== matchingSeriesAggType;
                const aggFieldIsChanged = lastSeriesAggField !== matchingSeriesAggField;
                lastMatchingSeriesAgg[matchingSeries[0].id] = {
                    type: matchingSeriesAggType,
                    field: matchingSeriesAggField,
                };
                lastLabels[axis.id] = newCustomLabel;
                lastValuesChanged = true;
                if (Object.keys(lastCustomLabels).length !== 0 &&
                    (aggTypeIsChanged ||
                        aggFieldIsChanged ||
                        axis.title.text === '' ||
                        lastCustomLabels[axis.id] === axis.title.text) &&
                    newCustomLabel !== axis.title.text) {
                    // Override axis title with new custom label
                    updatedAxis = {
                        ...axis,
                        title: { ...axis.title, text: newCustomLabel },
                    };
                    isAxesChanged = true;
                }
            }
            return updatedAxis || axis;
        });
        if (isAxesChanged) {
            setValue('valueAxes', axes);
        }
        if (lastValuesChanged) {
            setLastSeriesAgg(lastMatchingSeriesAgg);
            setLastCustomLabels(lastLabels);
        }
    }, [
        aggs,
        lastCustomLabels,
        lastSeriesAgg,
        setValue,
        stateParams.seriesParams,
        stateParams.valueAxes,
    ]);
    const onValueAxisPositionChanged = react_1.useCallback((index, value) => {
        const valueAxes = [...stateParams.valueAxes];
        const name = utils_1.getUpdatedAxisName(value, valueAxes);
        valueAxes[index] = {
            ...valueAxes[index],
            name,
            position: value,
        };
        setValue('valueAxes', valueAxes);
    }, [stateParams.valueAxes, setValue]);
    const onCategoryAxisPositionChanged = react_1.useCallback((chartPosition) => {
        const isChartHorizontal = utils_1.isAxisHorizontal(chartPosition);
        setIsCategoryAxisHorizontal(utils_1.isAxisHorizontal(chartPosition));
        stateParams.valueAxes.forEach((axis, index) => {
            if (utils_1.isAxisHorizontal(axis.position) === isChartHorizontal) {
                const position = utils_1.mapPosition(axis.position);
                onValueAxisPositionChanged(index, position);
            }
        });
    }, [stateParams.valueAxes, onValueAxisPositionChanged]);
    const addValueAxis = react_1.useCallback(() => {
        const nextAxisIdNumber = stateParams.valueAxes.reduce(utils_1.countNextAxisNumber(VALUE_AXIS_PREFIX), 1);
        const newAxis = lodash_1.cloneDeep(stateParams.valueAxes[0]);
        newAxis.id = VALUE_AXIS_PREFIX + nextAxisIdNumber;
        newAxis.position = utils_1.mapPositionOpposite(newAxis.position);
        newAxis.name = utils_1.getUpdatedAxisName(newAxis.position, stateParams.valueAxes);
        setValue('valueAxes', [...stateParams.valueAxes, newAxis]);
        return newAxis;
    }, [stateParams.valueAxes, setValue]);
    const removeValueAxis = react_1.useCallback((axis) => {
        const newValueAxes = stateParams.valueAxes.filter(valAxis => valAxis.id !== axis.id);
        setValue('valueAxes', newValueAxes);
        let isSeriesUpdated = false;
        const series = stateParams.seriesParams.map(ser => {
            if (axis.id === ser.valueAxis) {
                isSeriesUpdated = true;
                return { ...ser, valueAxis: newValueAxes[0].id };
            }
            return ser;
        });
        if (isSeriesUpdated) {
            // if seriesParams have valueAxis equals to removed one, then we reset it to the first valueAxis
            setValue('seriesParams', series);
        }
        if (stateParams.grid.valueAxis === axis.id) {
            // reset Y-axis grid lines setting
            setValue('grid', { ...stateParams.grid, valueAxis: undefined });
        }
    }, [stateParams.seriesParams, stateParams.valueAxes, setValue, stateParams.grid]);
    const changeValueAxis = react_1.useCallback((index, paramName, selectedValueAxis) => {
        let newValueAxis = selectedValueAxis;
        if (selectedValueAxis === 'new') {
            const axis = addValueAxis();
            newValueAxis = axis.id;
        }
        setParamByIndex('seriesParams', index, paramName, newValueAxis);
        updateAxisTitle();
    }, [addValueAxis, setParamByIndex, updateAxisTitle]);
    const schemaName = vis.type.schemas.metrics[0].name;
    const metrics = react_1.useMemo(() => {
        return aggs.bySchemaName(schemaName);
    }, [schemaName, aggs]);
    const firstValueAxesId = stateParams.valueAxes[0].id;
    react_1.useEffect(() => {
        const updatedSeries = metrics.map(agg => {
            const params = stateParams.seriesParams.find(param => param.data.id === agg.id);
            const label = agg.makeLabel();
            // update labels for existing params or create new one
            if (params) {
                return {
                    ...params,
                    data: {
                        ...params.data,
                        label,
                    },
                };
            }
            else {
                const series = utils_1.makeSerie(agg.id, label, firstValueAxesId, stateParams.seriesParams[stateParams.seriesParams.length - 1]);
                return series;
            }
        });
        setValue('seriesParams', updatedSeries);
        updateAxisTitle(updatedSeries);
    }, [metrics, firstValueAxesId, setValue, stateParams.seriesParams, updateAxisTitle]);
    const visType = react_1.useMemo(() => {
        const types = lodash_1.uniq(stateParams.seriesParams.map(({ type }) => type));
        return types.length === 1 ? types[0] : 'histogram';
    }, [stateParams.seriesParams]);
    react_1.useEffect(() => {
        vis.setState({ ...vis.serialize(), type: visType });
    }, [vis, visType]);
    return isTabSelected ? (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(series_panel_1.SeriesPanel, { changeValueAxis: changeValueAxis, setParamByIndex: setParamByIndex, seriesParams: stateParams.seriesParams, valueAxes: stateParams.valueAxes, vis: vis }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(value_axes_panel_1.ValueAxesPanel, { addValueAxis: addValueAxis, isCategoryAxisHorizontal: isCategoryAxisHorizontal, removeValueAxis: removeValueAxis, onValueAxisPositionChanged: onValueAxisPositionChanged, setParamByIndex: setParamByIndex, setMultipleValidity: props.setMultipleValidity, seriesParams: stateParams.seriesParams, valueAxes: stateParams.valueAxes, vis: vis }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" }),
        react_1.default.createElement(category_axis_panel_1.CategoryAxisPanel, { axis: stateParams.categoryAxes[0], onPositionChanged: onCategoryAxisPositionChanged, setCategoryAxis: setCategoryAxis, vis: vis }))) : null;
}
exports.MetricsAxisOptions = MetricsAxisOptions;
