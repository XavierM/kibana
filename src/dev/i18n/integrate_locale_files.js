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
const path_1 = tslib_1.__importDefault(require("path"));
const dev_utils_1 = require("@kbn/dev-utils");
const utils_1 = require("./utils");
const serializers_1 = require("./serializers");
function verifyMessages(localizedMessagesMap, defaultMessagesMap, options) {
    let errorMessage = '';
    const defaultMessagesIds = [...defaultMessagesMap.keys()];
    const localizedMessagesIds = [...localizedMessagesMap.keys()];
    const unusedTranslations = utils_1.difference(localizedMessagesIds, defaultMessagesIds);
    if (unusedTranslations.length > 0) {
        if (!options.ignoreUnused) {
            errorMessage += `\n${unusedTranslations.length} unused translation(s):\n${unusedTranslations.join(', ')}`;
        }
        else {
            for (const unusedTranslationId of unusedTranslations) {
                localizedMessagesMap.delete(unusedTranslationId);
            }
        }
    }
    if (!options.ignoreMissing) {
        const missingTranslations = utils_1.difference(defaultMessagesIds, localizedMessagesIds);
        if (missingTranslations.length > 0) {
            errorMessage += `\n${missingTranslations.length} missing translation(s):\n${missingTranslations.join(', ')}`;
        }
    }
    for (const messageId of localizedMessagesIds) {
        const defaultMessage = defaultMessagesMap.get(messageId);
        if (defaultMessage) {
            try {
                const message = localizedMessagesMap.get(messageId);
                utils_1.checkValuesProperty(utils_1.extractValueReferencesFromMessage(defaultMessage.message, messageId), typeof message === 'string' ? message : message.text, messageId);
            }
            catch (err) {
                if (options.ignoreIncompatible) {
                    localizedMessagesMap.delete(messageId);
                    options.log.warning(`Incompatible translation ignored: ${err.message}`);
                }
                else {
                    errorMessage += `\nIncompatible translation: ${err.message}\n`;
                }
            }
        }
    }
    if (errorMessage) {
        throw dev_utils_1.createFailError(errorMessage);
    }
}
exports.verifyMessages = verifyMessages;
function groupMessagesByNamespace(localizedMessagesMap, knownNamespaces) {
    const localizedMessagesByNamespace = new Map();
    for (const [messageId, messageValue] of localizedMessagesMap) {
        const namespace = knownNamespaces.find(key => messageId.startsWith(`${key}.`));
        if (!namespace) {
            throw dev_utils_1.createFailError(`Unknown namespace in id ${messageId}.`);
        }
        if (!localizedMessagesByNamespace.has(namespace)) {
            localizedMessagesByNamespace.set(namespace, []);
        }
        localizedMessagesByNamespace
            .get(namespace)
            .push([
            messageId,
            { message: typeof messageValue === 'string' ? messageValue : messageValue.text },
        ]);
    }
    return localizedMessagesByNamespace;
}
async function writeMessages(localizedMessagesByNamespace, formats, options) {
    // If target file name is specified we need to write all the translations into one file,
    // irrespective to the namespace.
    if (options.targetFileName) {
        await utils_1.writeFileAsync(options.targetFileName, serializers_1.serializeToJson([...localizedMessagesByNamespace.values()].reduce((acc, val) => acc.concat(val), []), formats));
        return options.log.success(`Translations have been integrated to ${utils_1.normalizePath(options.targetFileName)}`);
    }
    // Use basename of source file name to write the same locale name as the source file has.
    const fileName = path_1.default.basename(options.sourceFileName);
    for (const [namespace, messages] of localizedMessagesByNamespace) {
        for (const namespacedPath of options.config.paths[namespace]) {
            const destPath = path_1.default.resolve(namespacedPath, 'translations');
            try {
                await utils_1.accessAsync(destPath);
            }
            catch (_) {
                await utils_1.makeDirAsync(destPath);
            }
            const writePath = path_1.default.resolve(destPath, fileName);
            await utils_1.writeFileAsync(writePath, serializers_1.serializeToJson(messages, formats));
            options.log.success(`Translations have been integrated to ${utils_1.normalizePath(writePath)}`);
        }
    }
}
async function integrateLocaleFiles(defaultMessagesMap, options) {
    const localizedMessages = JSON.parse((await utils_1.readFileAsync(options.sourceFileName)).toString());
    if (!localizedMessages.formats) {
        throw dev_utils_1.createFailError(`Locale file should contain formats object.`);
    }
    const localizedMessagesMap = new Map(Object.entries(localizedMessages.messages));
    verifyMessages(localizedMessagesMap, defaultMessagesMap, options);
    const knownNamespaces = Object.keys(options.config.paths);
    const groupedLocalizedMessagesMap = groupMessagesByNamespace(localizedMessagesMap, knownNamespaces);
    if (!options.dryRun) {
        await writeMessages(groupedLocalizedMessagesMap, localizedMessages.formats, options);
    }
}
exports.integrateLocaleFiles = integrateLocaleFiles;
