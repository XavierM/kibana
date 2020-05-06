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
const react_2 = require("@kbn/i18n/react");
const default_1 = require("../default");
const samples_1 = require("../../samples");
const label_template_flyout_1 = require("./label_template_flyout");
const url_template_flyout_1 = require("./url_template_flyout");
require("./icons");
class UrlFormatEditor extends default_1.DefaultFormatEditor {
    constructor(props) {
        super(props);
        this.sanitizeNumericValue = (val) => {
            const sanitizedValue = parseInt(val, 10);
            if (isNaN(sanitizedValue)) {
                return '';
            }
            return sanitizedValue;
        };
        this.onTypeChange = (newType) => {
            const { urlTemplate, width, height } = this.props.formatParams;
            const params = {
                type: newType,
            };
            if (newType === 'img') {
                params.width = width;
                params.height = height;
                if (!urlTemplate) {
                    params.urlTemplate = this.iconPattern;
                }
            }
            else if (newType !== 'img' && urlTemplate === this.iconPattern) {
                params.urlTemplate = undefined;
            }
            this.onChange(params);
        };
        this.showUrlTemplateHelp = () => {
            this.setState({
                showLabelTemplateHelp: false,
                showUrlTemplateHelp: true,
            });
        };
        this.hideUrlTemplateHelp = () => {
            this.setState({
                showUrlTemplateHelp: false,
            });
        };
        this.showLabelTemplateHelp = () => {
            this.setState({
                showLabelTemplateHelp: true,
                showUrlTemplateHelp: false,
            });
        };
        this.hideLabelTemplateHelp = () => {
            this.setState({
                showLabelTemplateHelp: false,
            });
        };
        this.renderWidthHeightParameters = () => {
            const width = this.sanitizeNumericValue(this.props.formatParams.width);
            const height = this.sanitizeNumericValue(this.props.formatParams.height);
            return (react_1.default.createElement(react_1.Fragment, null,
                react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.widthLabel", defaultMessage: "Width" }) },
                    react_1.default.createElement(eui_1.EuiFieldNumber, { "data-test-subj": "urlEditorWidth", value: width, onChange: e => {
                            this.onChange({ width: e.target.value });
                        } })),
                react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.heightLabel", defaultMessage: "Height" }) },
                    react_1.default.createElement(eui_1.EuiFieldNumber, { "data-test-subj": "urlEditorHeight", value: height, onChange: e => {
                            this.onChange({ height: e.target.value });
                        } }))));
        };
        this.iconPattern = `${props.basePath}/bundles/src/legacy/ui/public/field_editor/components/field_format_editor/editors/url/icons/{{value}}.png`;
        this.state = {
            ...this.state,
            sampleInputsByType: {
                a: ['john', '/some/pathname/asset.png', 1234],
                img: ['go', 'stop', ['de', 'ne', 'us', 'ni'], 'cv'],
                audio: ['hello.mp3'],
            },
            sampleConverterType: 'html',
            showUrlTemplateHelp: false,
            showLabelTemplateHelp: false,
        };
    }
    render() {
        const { format, formatParams } = this.props;
        const { error, samples, sampleConverterType } = this.state;
        return (react_1.default.createElement(react_1.Fragment, null,
            react_1.default.createElement(label_template_flyout_1.LabelTemplateFlyout, { isVisible: this.state.showLabelTemplateHelp, onClose: this.hideLabelTemplateHelp }),
            react_1.default.createElement(url_template_flyout_1.UrlTemplateFlyout, { isVisible: this.state.showUrlTemplateHelp, onClose: this.hideUrlTemplateHelp }),
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.typeLabel", defaultMessage: "Type" }) },
                react_1.default.createElement(eui_1.EuiSelect, { "data-test-subj": "urlEditorType", value: formatParams.type, options: format.type.urlTypes.map((type) => {
                        return {
                            value: type.kind,
                            text: type.text,
                        };
                    }), onChange: e => {
                        this.onTypeChange(e.target.value);
                    } })),
            formatParams.type === 'a' ? (react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.openTabLabel", defaultMessage: "Open in a new tab" }) },
                react_1.default.createElement(eui_1.EuiSwitch, { label: formatParams.openLinkInCurrentTab ? (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.offLabel", defaultMessage: "Off" })) : (react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.onLabel", defaultMessage: "On" })), checked: !formatParams.openLinkInCurrentTab, onChange: e => {
                        this.onChange({ openLinkInCurrentTab: !e.target.checked });
                    } }))) : null,
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.urlTemplateLabel", defaultMessage: "URL template" }), helpText: react_1.default.createElement(eui_1.EuiLink, { onClick: this.showUrlTemplateHelp },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.template.helpLinkText", defaultMessage: "URL template help" })), isInvalid: !!error, error: error },
                react_1.default.createElement(eui_1.EuiFieldText, { "data-test-subj": "urlEditorUrlTemplate", value: formatParams.urlTemplate || '', onChange: e => {
                        this.onChange({ urlTemplate: e.target.value });
                    } })),
            react_1.default.createElement(eui_1.EuiFormRow, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.labelTemplateLabel", defaultMessage: "Label template" }), helpText: react_1.default.createElement(eui_1.EuiLink, { onClick: this.showLabelTemplateHelp },
                    react_1.default.createElement(react_2.FormattedMessage, { id: "common.ui.fieldEditor.url.labelTemplateHelpText", defaultMessage: "Label template help" })), isInvalid: !!error, error: error },
                react_1.default.createElement(eui_1.EuiFieldText, { "data-test-subj": "urlEditorLabelTemplate", value: formatParams.labelTemplate || '', onChange: e => {
                        this.onChange({ labelTemplate: e.target.value });
                    } })),
            formatParams.type === 'img' && this.renderWidthHeightParameters(),
            react_1.default.createElement(samples_1.FormatEditorSamples, { samples: samples, sampleType: sampleConverterType })));
    }
}
exports.UrlFormatEditor = UrlFormatEditor;
UrlFormatEditor.formatId = 'url';
