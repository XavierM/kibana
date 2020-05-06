"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
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
const react_1 = tslib_1.__importDefault(require("react"));
const public_1 = require("../../saved_objects/public");
const bootstrap_1 = require("./bootstrap");
const lib_1 = require("./lib");
class EmbeddablePublicPlugin {
    constructor(initializerContext) {
        this.embeddableFactoryDefinitions = new Map();
        this.embeddableFactories = new Map();
        this.getEmbeddableFactories = () => {
            this.ensureFactoriesExist();
            return this.embeddableFactories.values();
        };
        this.registerEmbeddableFactory = (embeddableFactoryId, factory) => {
            if (this.embeddableFactoryDefinitions.has(embeddableFactoryId)) {
                throw new Error(`Embeddable factory [embeddableFactoryId = ${embeddableFactoryId}] already registered in Embeddables API.`);
            }
            this.embeddableFactoryDefinitions.set(embeddableFactoryId, factory);
        };
        this.getEmbeddableFactory = (embeddableFactoryId) => {
            this.ensureFactoryExists(embeddableFactoryId);
            const factory = this.embeddableFactories.get(embeddableFactoryId);
            if (!factory) {
                throw new Error(`Embeddable factory [embeddableFactoryId = ${embeddableFactoryId}] does not exist.`);
            }
            return factory;
        };
        // These two functions are only to support legacy plugins registering factories after the start lifecycle.
        this.ensureFactoriesExist = () => {
            this.embeddableFactoryDefinitions.forEach(def => this.ensureFactoryExists(def.type));
        };
        this.ensureFactoryExists = (type) => {
            if (!this.embeddableFactories.get(type)) {
                const def = this.embeddableFactoryDefinitions.get(type);
                if (!def)
                    return;
                this.embeddableFactories.set(type, this.customEmbeddableFactoryProvider
                    ? this.customEmbeddableFactoryProvider(def)
                    : lib_1.defaultEmbeddableFactoryProvider(def));
            }
        };
    }
    setup(core, { uiActions }) {
        bootstrap_1.bootstrap(uiActions);
        return {
            registerEmbeddableFactory: this.registerEmbeddableFactory,
            setCustomEmbeddableFactoryProvider: (provider) => {
                if (this.customEmbeddableFactoryProvider) {
                    throw new Error('Custom embeddable factory provider is already set, and can only be set once');
                }
                this.customEmbeddableFactoryProvider = provider;
            },
        };
    }
    start(core, { uiActions, inspector }) {
        this.embeddableFactoryDefinitions.forEach(def => {
            this.embeddableFactories.set(def.type, this.customEmbeddableFactoryProvider
                ? this.customEmbeddableFactoryProvider(def)
                : lib_1.defaultEmbeddableFactoryProvider(def));
        });
        return {
            getEmbeddableFactory: this.getEmbeddableFactory,
            getEmbeddableFactories: this.getEmbeddableFactories,
            EmbeddablePanel: ({ embeddable, hideHeader, }) => (react_1.default.createElement(lib_1.EmbeddablePanel, { hideHeader: hideHeader, embeddable: embeddable, getActions: uiActions.getTriggerCompatibleActions, getEmbeddableFactory: this.getEmbeddableFactory, getAllEmbeddableFactories: this.getEmbeddableFactories, overlays: core.overlays, notifications: core.notifications, application: core.application, inspector: inspector, SavedObjectFinder: public_1.getSavedObjectFinder(core.savedObjects, core.uiSettings) })),
        };
    }
    stop() { }
}
exports.EmbeddablePublicPlugin = EmbeddablePublicPlugin;
