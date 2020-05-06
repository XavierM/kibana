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
const eui_1 = require("@elastic/eui");
const react_1 = require("@kbn/i18n/react");
const classnames_1 = tslib_1.__importDefault(require("classnames"));
const react_2 = tslib_1.__importStar(require("react"));
const filter_editor_1 = require("./filter_editor");
const filter_view_1 = require("./filter_view");
const common_1 = require("../../../common");
const services_1 = require("../../services");
class FilterItemUI extends react_2.Component {
    constructor() {
        super(...arguments);
        this.state = {
            isPopoverOpen: false,
        };
        this.handleBadgeClick = (e) => {
            if (e.shiftKey) {
                this.onToggleDisabled();
            }
            else {
                this.togglePopover();
            }
        };
        this.closePopover = () => {
            this.setState({
                isPopoverOpen: false,
            });
        };
        this.togglePopover = () => {
            this.setState({
                isPopoverOpen: !this.state.isPopoverOpen,
            });
        };
        this.onSubmit = (filter) => {
            this.closePopover();
            this.props.onUpdate(filter);
        };
        this.onTogglePinned = () => {
            const filter = common_1.toggleFilterPinned(this.props.filter);
            this.props.onUpdate(filter);
        };
        this.onToggleNegated = () => {
            const filter = common_1.toggleFilterNegated(this.props.filter);
            this.props.onUpdate(filter);
        };
        this.onToggleDisabled = () => {
            const filter = common_1.toggleFilterDisabled(this.props.filter);
            this.props.onUpdate(filter);
        };
    }
    render() {
        const { filter, id } = this.props;
        const { negate, disabled } = filter.meta;
        let hasError = false;
        let valueLabel;
        try {
            valueLabel = common_1.getDisplayValueFromFilter(filter, this.props.indexPatterns);
        }
        catch (e) {
            services_1.getNotifications().toasts.addError(e, {
                title: this.props.intl.formatMessage({
                    id: 'data.filter.filterBar.labelErrorMessage',
                    defaultMessage: 'Failed to display filter',
                }),
            });
            valueLabel = this.props.intl.formatMessage({
                id: 'data.filter.filterBar.labelErrorText',
                defaultMessage: 'Error',
            });
            hasError = true;
        }
        const dataTestSubjKey = filter.meta.key ? `filter-key-${filter.meta.key}` : '';
        const dataTestSubjValue = filter.meta.value ? `filter-value-${valueLabel}` : '';
        const dataTestSubjDisabled = `filter-${this.props.filter.meta.disabled ? 'disabled' : 'enabled'}`;
        const dataTestSubjPinned = `filter-${common_1.isFilterPinned(filter) ? 'pinned' : 'unpinned'}`;
        const classes = classnames_1.default('globalFilterItem', {
            'globalFilterItem-isDisabled': disabled || hasError,
            'globalFilterItem-isInvalid': hasError,
            'globalFilterItem-isPinned': common_1.isFilterPinned(filter),
            'globalFilterItem-isExcluded': negate,
        }, this.props.className);
        const badge = (react_2.default.createElement(filter_view_1.FilterView, { filter: filter, valueLabel: valueLabel, className: classes, iconOnClick: () => this.props.onRemove(), onClick: this.handleBadgeClick, "data-test-subj": `filter ${dataTestSubjDisabled} ${dataTestSubjKey} ${dataTestSubjValue} ${dataTestSubjPinned}` }));
        const panelTree = [
            {
                id: 0,
                items: [
                    {
                        name: common_1.isFilterPinned(filter)
                            ? this.props.intl.formatMessage({
                                id: 'data.filter.filterBar.unpinFilterButtonLabel',
                                defaultMessage: 'Unpin',
                            })
                            : this.props.intl.formatMessage({
                                id: 'data.filter.filterBar.pinFilterButtonLabel',
                                defaultMessage: 'Pin across all apps',
                            }),
                        icon: 'pin',
                        onClick: () => {
                            this.closePopover();
                            this.onTogglePinned();
                        },
                        'data-test-subj': 'pinFilter',
                    },
                    {
                        name: this.props.intl.formatMessage({
                            id: 'data.filter.filterBar.editFilterButtonLabel',
                            defaultMessage: 'Edit filter',
                        }),
                        icon: 'pencil',
                        panel: 1,
                        'data-test-subj': 'editFilter',
                    },
                    {
                        name: negate
                            ? this.props.intl.formatMessage({
                                id: 'data.filter.filterBar.includeFilterButtonLabel',
                                defaultMessage: 'Include results',
                            })
                            : this.props.intl.formatMessage({
                                id: 'data.filter.filterBar.excludeFilterButtonLabel',
                                defaultMessage: 'Exclude results',
                            }),
                        icon: negate ? 'plusInCircle' : 'minusInCircle',
                        onClick: () => {
                            this.closePopover();
                            this.onToggleNegated();
                        },
                        'data-test-subj': 'negateFilter',
                    },
                    {
                        name: disabled
                            ? this.props.intl.formatMessage({
                                id: 'data.filter.filterBar.enableFilterButtonLabel',
                                defaultMessage: 'Re-enable',
                            })
                            : this.props.intl.formatMessage({
                                id: 'data.filter.filterBar.disableFilterButtonLabel',
                                defaultMessage: 'Temporarily disable',
                            }),
                        icon: `${disabled ? 'eye' : 'eyeClosed'}`,
                        onClick: () => {
                            this.closePopover();
                            this.onToggleDisabled();
                        },
                        'data-test-subj': 'disableFilter',
                    },
                    {
                        name: this.props.intl.formatMessage({
                            id: 'data.filter.filterBar.deleteFilterButtonLabel',
                            defaultMessage: 'Delete',
                        }),
                        icon: 'trash',
                        onClick: () => {
                            this.closePopover();
                            this.props.onRemove();
                        },
                        'data-test-subj': 'deleteFilter',
                    },
                ],
            },
            {
                id: 1,
                width: 420,
                content: (react_2.default.createElement("div", null,
                    react_2.default.createElement(filter_editor_1.FilterEditor, { filter: filter, indexPatterns: this.props.indexPatterns, onSubmit: this.onSubmit, onCancel: this.closePopover }))),
            },
        ];
        return (react_2.default.createElement(eui_1.EuiPopover, { id: `popoverFor_filter${id}`, className: `globalFilterItem__popover`, anchorClassName: `globalFilterItem__popoverAnchor`, isOpen: this.state.isPopoverOpen, closePopover: this.closePopover, button: badge, anchorPosition: "downLeft", withTitle: true, panelPaddingSize: "none" },
            react_2.default.createElement(eui_1.EuiContextMenu, { initialPanelId: 0, panels: panelTree })));
    }
}
exports.FilterItem = react_1.injectI18n(FilterItemUI);
