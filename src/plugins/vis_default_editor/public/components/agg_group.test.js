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
const test_utils_1 = require("react-dom/test-utils");
const agg_group_1 = require("./agg_group");
const agg_1 = require("./agg");
const agg_add_1 = require("./agg_add");
const schemas_1 = require("../schemas");
jest.mock('@elastic/eui', () => ({
    EuiTitle: 'eui-title',
    EuiDragDropContext: 'eui-drag-drop-context',
    EuiDroppable: 'eui-droppable',
    EuiDraggable: (props) => props.children({ dragHandleProps: {} }),
    EuiSpacer: 'eui-spacer',
    EuiPanel: 'eui-panel',
}));
jest.mock('./agg', () => ({
    DefaultEditorAgg: () => react_1.default.createElement("div", null),
}));
jest.mock('./agg_add', () => ({
    DefaultEditorAggAdd: () => react_1.default.createElement("div", null),
}));
describe('DefaultEditorAgg component', () => {
    let defaultProps;
    let aggs;
    let schemas;
    let setTouched;
    let setValidity;
    let reorderAggs;
    beforeEach(() => {
        setTouched = jest.fn();
        setValidity = jest.fn();
        reorderAggs = jest.fn();
        schemas = new schemas_1.Schemas([
            {
                name: 'metrics',
                group: 'metrics',
                max: 1,
            },
            {
                name: 'buckets',
                group: 'buckets',
                max: 1,
            },
        ]);
        aggs = {
            aggs: [
                {
                    id: '1',
                    params: {
                        field: {
                            type: 'number',
                        },
                    },
                    schema: 'metrics',
                },
                {
                    id: '3',
                    params: {
                        field: {
                            type: 'string',
                        },
                    },
                    schema: 'metrics',
                },
                {
                    id: '2',
                    params: {
                        field: {
                            type: 'number',
                        },
                    },
                    schema: 'buckets',
                },
            ],
        };
        defaultProps = {
            formIsTouched: false,
            metricAggs: [],
            groupName: 'metrics',
            state: {
                data: { aggs },
            },
            schemas: schemas.metrics,
            setTouched,
            setValidity,
            reorderAggs,
            addSchema: () => { },
            removeAgg: () => { },
            setAggParamValue: jest.fn(),
            setStateParamValue: jest.fn(),
            onAggTypeChange: jest.fn(),
            onToggleEnableAgg: () => { },
        };
    });
    it('should init with the default set of props', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({}, defaultProps)));
        expect(comp).toMatchSnapshot();
    });
    it('should call setTouched with false', () => {
        enzyme_1.mount(react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({}, defaultProps)));
        expect(setTouched).toBeCalledWith(false);
    });
    it('should last bucket has truthy isLastBucket prop', () => {
        defaultProps.groupName = 'buckets';
        defaultProps.schemas = schemas.buckets;
        const comp = enzyme_1.mount(react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({}, defaultProps)));
        const lastAgg = comp.find(agg_1.DefaultEditorAgg).last();
        expect(lastAgg.props()).toHaveProperty('isLastBucket', true);
    });
    it('should call reorderAggs when dragging ended', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({}, defaultProps)));
        test_utils_1.act(() => {
            // simulate dragging ending
            comp.props().onDragEnd({ source: { index: 0 }, destination: { index: 1 } });
        });
        expect(reorderAggs).toHaveBeenCalledWith(defaultProps.state.data.aggs.aggs[0], defaultProps.state.data.aggs.aggs[1]);
    });
    it('should show add button when schemas count is less than max', () => {
        defaultProps.groupName = 'buckets';
        defaultProps.schemas = schemas.buckets;
        defaultProps.schemas[0].max = 2;
        const comp = enzyme_1.shallow(react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({}, defaultProps)));
        expect(comp.find(agg_add_1.DefaultEditorAggAdd).exists()).toBeTruthy();
    });
    it('should not show add button when schemas count is not less than max', () => {
        const comp = enzyme_1.shallow(react_1.default.createElement(agg_group_1.DefaultEditorAggGroup, Object.assign({}, defaultProps)));
        expect(comp.find(agg_add_1.DefaultEditorAggAdd).exists()).toBeFalsy();
    });
});
