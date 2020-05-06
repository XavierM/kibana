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
const eui_1 = require("@elastic/eui");
const react_2 = require("@kbn/i18n/react");
const public_1 = require("../../../charts/public");
function WmsInternalOptions({ wms, setValue }) {
    const wmsLink = (react_1.default.createElement(eui_1.EuiLink, { href: "http://www.opengeospatial.org/standards/wms", target: "_blank" },
        react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsLinkText", defaultMessage: "OGC standard" })));
    const footnoteText = (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement("span", { "aria-hidden": "true" }, "*"),
        react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.mapLoadFailDescription", defaultMessage: "If this parameter is incorrect, maps will fail to load." })));
    const footnote = (react_1.default.createElement(eui_1.EuiScreenReaderOnly, null,
        react_1.default.createElement("p", null, footnoteText)));
    const setOptions = (paramName, value) => setValue('options', {
        ...wms.options,
        [paramName]: value,
    });
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(eui_1.EuiSpacer, { size: "xs" }),
        react_1.default.createElement(eui_1.EuiText, { size: "xs" },
            react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsDescription", defaultMessage: "WMS is an {wmsLink} for map image services.", values: { wmsLink } })),
        react_1.default.createElement(eui_1.EuiSpacer, { size: "m" }),
        react_1.default.createElement(public_1.TextInputOption, { label: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsUrlLabel", defaultMessage: "WMS url" }),
                react_1.default.createElement("span", { "aria-hidden": "true" }, "*")), helpText: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.urlOfWMSWebServiceTip", defaultMessage: "The URL of the WMS web service." }),
                footnote), paramName: "url", value: wms.url, setValue: setValue }),
        react_1.default.createElement(public_1.TextInputOption, { label: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsLayersLabel", defaultMessage: "WMS layers" }),
                react_1.default.createElement("span", { "aria-hidden": "true" }, "*")), helpText: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.listOfLayersToUseTip", defaultMessage: "A comma separated list of layers to use." }),
                footnote), paramName: "layers", value: wms.options.layers, setValue: setOptions }),
        react_1.default.createElement(public_1.TextInputOption, { label: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsVersionLabel", defaultMessage: "WMS version" }),
                react_1.default.createElement("span", { "aria-hidden": "true" }, "*")), helpText: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.versionOfWMSserverSupportsTip", defaultMessage: "The version of WMS the server supports." }),
                footnote), paramName: "version", value: wms.options.version, setValue: setOptions }),
        react_1.default.createElement(public_1.TextInputOption, { label: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsFormatLabel", defaultMessage: "WMS format" }),
                react_1.default.createElement("span", { "aria-hidden": "true" }, "*")), helpText: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.imageFormatToUseTip", defaultMessage: "Usually image/png or image/jpeg. Use png if the server will return transparent layers." }),
                footnote), paramName: "format", value: wms.options.format, setValue: setOptions }),
        react_1.default.createElement(public_1.TextInputOption, { label: react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsAttributionLabel", defaultMessage: "WMS attribution" }), helpText: react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.attributionStringTip", defaultMessage: "Attribution string for the lower right corner." }), paramName: "attribution", value: wms.options.attribution, setValue: setOptions }),
        react_1.default.createElement(public_1.TextInputOption, { label: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsStylesLabel", defaultMessage: "WMS styles" }),
                react_1.default.createElement("span", { "aria-hidden": "true" }, "*")), helpText: react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "maps_legacy.wmsOptions.wmsServerSupportedStylesListTip", defaultMessage: "A comma separated list of WMS server supported styles to use. Blank in most cases." }),
                footnote), paramName: "styles", value: wms.options.styles, setValue: setOptions }),
        react_1.default.createElement(eui_1.EuiText, { size: "xs" },
            react_1.default.createElement("p", { "aria-hidden": "true" }, footnoteText))));
}
exports.WmsInternalOptions = WmsInternalOptions;
