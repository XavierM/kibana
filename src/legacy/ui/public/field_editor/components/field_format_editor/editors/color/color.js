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
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const default_1 = require("../default");
const public_1 = require("../../../../../../../../plugins/data/public");
class ColorFormatEditor extends default_1.DefaultFormatEditor {
    constructor(props) {
        super(props);
        this.onColorChange = (newColorParams, index) => {
            const colors = [...this.props.formatParams.colors];
            colors[index] = {
                ...colors[index],
                ...newColorParams,
            };
            this.onChange({
                colors,
            });
        };
        this.addColor = () => {
            const colors = [...this.props.formatParams.colors];
            this.onChange({
                colors: [...colors, { ...public_1.fieldFormats.DEFAULT_CONVERTER_COLOR }],
            });
        };
        this.removeColor = (index) => {
            const colors = [...this.props.formatParams.colors];
            colors.splice(index, 1);
            this.onChange({
                colors,
            });
        };
        this.onChange({
            fieldType: props.fieldType,
        });
    }
    render() {
        const { formatParams, fieldType } = this.props;
        const items = (formatParams.colors &&
            formatParams.colors.length &&
            formatParams.colors.map((color, index) => {
                return {
                    ...color,
                    index,
                };
            })) ||
            [];
        const columns = [
            fieldType === 'string'
                ? {
                    field: 'regex',
                    name: (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.color.patternLabel", defaultMessage: "Pattern (regular expression)" })),
                    render: (value, item) => {
                        return (react_1.default.createElement(eui_1.EuiFieldText, { value: value, onChange: e => {
                                this.onColorChange({
                                    regex: e.target.value,
                                }, item.index);
                            } }));
                    },
                }
                : {
                    field: 'range',
                    name: (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.color.rangeLabel", defaultMessage: "Range (min:max)" })),
                    render: (value, item) => {
                        return (react_1.default.createElement(eui_1.EuiFieldText, { value: value, onChange: e => {
                                this.onColorChange({
                                    range: e.target.value,
                                }, item.index);
                            } }));
                    },
                },
            {
                field: 'text',
                name: (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.color.textColorLabel", defaultMessage: "Text color" })),
                render: (color, item) => {
                    return (react_1.default.createElement(eui_1.EuiColorPicker, { color: color, onChange: newColor => {
                            this.onColorChange({
                                text: newColor,
                            }, item.index);
                        } }));
                },
            },
            {
                field: 'background',
                name: (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.color.backgroundLabel", defaultMessage: "Background color" })),
                render: (color, item) => {
                    return (react_1.default.createElement(eui_1.EuiColorPicker, { color: color, onChange: newColor => {
                            this.onColorChange({
                                background: newColor,
                            }, item.index);
                        } }));
                },
            },
            {
                name: (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.color.exampleLabel", defaultMessage: "Example" })),
                render: (item) => {
                    return (react_1.default.createElement("div", { style: {
                            background: item.background,
                            color: item.text,
                        } }, "123456"));
                },
            },
            {
                field: 'actions',
                name: i18n_1.i18n.translate('common.ui.fieldEditor.color.actions', {
                    defaultMessage: 'Actions',
                }),
                actions: [
                    {
                        name: i18n_1.i18n.translate('common.ui.fieldEditor.color.deleteAria', {
                            defaultMessage: 'Delete',
                        }),
                        description: i18n_1.i18n.translate('common.ui.fieldEditor.color.deleteTitle', {
                            defaultMessage: 'Delete color format',
                        }),
                        onClick: (item) => {
                            this.removeColor(item.index);
                        },
                        type: 'icon',
                        icon: 'trash',
                        color: 'danger',
                        available: () => items.length > 1,
                    },
                ],
            },
        ];
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(eui_1.EuiBasicTable, { items: items, columns: columns }),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
            react_1.default.createElement(eui_1.EuiButton, { iconType: "plusInCircle", size: "s", onClick: this.addColor },
                react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.color.addColorButton", defaultMessage: "Add color" })),
            react_1.default.createElement(eui_1.EuiSpacer, { size: "l" })));
    }
}
exports.ColorFormatEditor = ColorFormatEditor;
ColorFormatEditor.formatId = 'color';
