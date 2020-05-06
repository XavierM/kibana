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
exports.StatusMessage = ({ matchedIndices: { allIndices = [], exactMatchedIndices = [], partialMatchedIndices = [] }, isIncludingSystemIndices, query, showSystemIndices, }) => {
    let statusIcon;
    let statusMessage;
    let statusColor;
    const allIndicesLength = allIndices.length;
    if (query.length === 0) {
        statusIcon = null;
        statusColor = 'default';
        if (allIndicesLength > 1) {
            statusMessage = (react_1.default.createElement("span", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.matchAnyLabel.matchAnyDetail", defaultMessage: "Your index pattern can match any of your {strongIndices}, below.", values: { strongIndices: react_1.default.createElement("strong", null,
                            allIndicesLength,
                            " indices") } })));
        }
        else if (!isIncludingSystemIndices && showSystemIndices) {
            statusMessage = (react_1.default.createElement("span", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.noSystemIndicesWithPromptLabel", defaultMessage: "No Elasticsearch indices match your pattern. To view the matching system indices, toggle the switch in\n            the upper right." })));
        }
        else {
            statusMessage = (react_1.default.createElement("span", null,
                react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.noSystemIndicesLabel", defaultMessage: "No Elasticsearch indices match your pattern." })));
        }
    }
    else if (exactMatchedIndices.length) {
        statusIcon = 'check';
        statusColor = 'secondary';
        statusMessage = (react_1.default.createElement("span", null,
            "\u00A0",
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.successLabel.successDetail", defaultMessage: "{strongSuccess} Your index pattern matches {strongIndices}.", values: {
                    strongSuccess: (react_1.default.createElement("strong", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.successLabel.strongSuccessLabel", defaultMessage: "Success!" }))),
                    strongIndices: (react_1.default.createElement("strong", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.successLabel.strongIndicesLabel", defaultMessage: "{indicesLength, plural, one {# index} other {# indices}}", values: { indicesLength: exactMatchedIndices.length } }))),
                } })));
    }
    else if (partialMatchedIndices.length) {
        statusIcon = null;
        statusColor = 'default';
        statusMessage = (react_1.default.createElement("span", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.partialMatchLabel.partialMatchDetail", defaultMessage: "Your index pattern doesn't match any indices, but you have {strongIndices} which\n          {matchedIndicesLength, plural, one {looks} other {look}} similar.", values: {
                    matchedIndicesLength: partialMatchedIndices.length,
                    strongIndices: (react_1.default.createElement("strong", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.partialMatchLabel.strongIndicesLabel", defaultMessage: "{matchedIndicesLength, plural, one {# index} other {# indices}}", values: { matchedIndicesLength: partialMatchedIndices.length } }))),
                } })));
    }
    else if (allIndicesLength) {
        statusIcon = null;
        statusColor = 'default';
        statusMessage = (react_1.default.createElement("span", null,
            react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.notMatchLabel.notMatchDetail", defaultMessage: "The index pattern you've entered doesn't match any indices.\n          You can match {indicesLength, plural, one {your} other {any of your}} {strongIndices}, below.", values: {
                    strongIndices: (react_1.default.createElement("strong", null,
                        react_1.default.createElement(react_2.FormattedMessage, { id: "kbn.management.createIndexPattern.step.status.notMatchLabel.allIndicesLabel", defaultMessage: "{indicesLength, plural, one {# index} other {# indices}}", values: { indicesLength: allIndicesLength } }))),
                    indicesLength: allIndicesLength,
                } })));
    }
    return (react_1.default.createElement(eui_1.EuiText, { size: "s", "data-test-subj": "createIndexPatternStatusMessage" },
        react_1.default.createElement(eui_1.EuiTextColor, { color: statusColor },
            statusIcon ? react_1.default.createElement(eui_1.EuiIcon, { type: statusIcon }) : null,
            statusMessage)));
};
