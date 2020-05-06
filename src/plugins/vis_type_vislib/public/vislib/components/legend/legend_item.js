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
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const i18n_1 = require("@kbn/i18n");
const react_2 = require("@kbn/i18n/react");
const eui_1 = require("@elastic/eui");
const models_1 = require("./models");
const VisLegendItemComponent = ({ item, legendId, selected, canFilter, anchorPosition, onFilter, onSelect, onHighlight, onUnhighlight, setColor, getColor, }) => {
    /**
     * Keydown listener for a legend entry.
     * This will close the details panel of this legend entry when pressing Escape.
     */
    const onLegendEntryKeydown = (event) => {
        if (event.keyCode === eui_1.keyCodes.ESCAPE) {
            event.preventDefault();
            event.stopPropagation();
            onSelect(null)();
        }
    };
    const filterOptions = [
        {
            id: 'filterIn',
            label: i18n_1.i18n.translate('visTypeVislib.vislib.legend.filterForValueButtonAriaLabel', {
                defaultMessage: 'Filter for value {legendDataLabel}',
                values: { legendDataLabel: item.label },
            }),
            iconType: 'plusInCircle',
            'data-test-subj': `legend-${item.label}-filterIn`,
        },
        {
            id: 'filterOut',
            label: i18n_1.i18n.translate('visTypeVislib.vislib.legend.filterOutValueButtonAriaLabel', {
                defaultMessage: 'Filter out value {legendDataLabel}',
                values: { legendDataLabel: item.label },
            }),
            iconType: 'minusInCircle',
            'data-test-subj': `legend-${item.label}-filterOut`,
        },
    ];
    const handleFilterChange = (id) => {
        onFilter(item, id !== 'filterIn');
    };
    const renderFilterBar = () => (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiButtonGroup, { type: "multi", isIconOnly: true, isFullWidth: true, legend: i18n_1.i18n.translate('visTypeVislib.vislib.legend.filterOptionsLegend', {
                defaultMessage: '{legendDataLabel}, filter options',
                values: { legendDataLabel: item.label },
            }), options: filterOptions, onChange: handleFilterChange, "data-test-subj": `legend-${item.label}-filters` }),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "s" })));
    const button = (react_1.default.createElement(eui_1.EuiButtonEmpty, { size: "xs", color: "text", flush: "left", className: "visLegend__button", onKeyDown: onLegendEntryKeydown, onMouseEnter: onHighlight, onFocus: onHighlight, onClick: onSelect(item.label), onMouseLeave: onUnhighlight, onBlur: onUnhighlight, "data-label": item.label, title: item.label, "aria-label": i18n_1.i18n.translate('visTypeVislib.vislib.legend.toggleOptionsButtonAriaLabel', {
            defaultMessage: '{legendDataLabel}, toggle options',
            values: { legendDataLabel: item.label },
        }), "data-test-subj": `legend-${item.label}` },
        react_1.default.createElement(eui_1.EuiIcon, { size: "l", type: "dot", color: getColor(item.label), "data-test-subj": `legendSelectedColor-${getColor(item.label)}` }),
        react_1.default.createElement("span", { className: "visLegend__valueTitle" }, item.label)));
    const renderDetails = () => (react_1.default.createElement(eui_1.EuiPopover, { ownFocus: true, display: "block", button: button, isOpen: selected, anchorPosition: anchorPosition, closePopover: onSelect(null), panelPaddingSize: "s" },
        react_1.default.createElement("div", { className: "visLegend__valueDetails" },
            canFilter && renderFilterBar(),
            react_1.default.createElement("div", { className: "visLegend__valueColorPicker", role: "listbox" },
                react_1.default.createElement("span", { id: `${legendId}ColorPickerDesc`, className: "euiScreenReaderOnly" },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "visTypeVislib.vislib.legend.setColorScreenReaderDescription", defaultMessage: "Set color for value {legendDataLabel}", values: { legendDataLabel: item.label } })),
                models_1.legendColors.map(color => (react_1.default.createElement(eui_1.EuiIcon, { role: "option", tabIndex: 0, type: "dot", size: "l", color: getColor(item.label), key: color, "aria-label": color, "aria-describedby": `${legendId}ColorPickerDesc`, "aria-selected": color === getColor(item.label), onClick: setColor(item.label, color), onKeyPress: setColor(item.label, color), className: classnames_1.default('visLegend__valueColorPickerDot', {
                        'visLegend__valueColorPickerDot-isSelected': color === getColor(item.label),
                    }), style: { color }, "data-test-subj": `legendSelectColor-${color}` })))))));
    return (react_1.default.createElement("li", { key: item.label, className: "visLegend__value" }, renderDetails()));
};
exports.VisLegendItem = react_1.memo(VisLegendItemComponent);
