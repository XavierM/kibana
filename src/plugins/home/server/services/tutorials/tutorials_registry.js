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
const joi_1 = tslib_1.__importDefault(require("joi"));
const tutorial_schema_1 = require("./lib/tutorial_schema");
const register_1 = require("../../tutorials/register");
class TutorialsRegistry {
    constructor() {
        this.tutorialProviders = []; // pre-register all the tutorials we know we want in here
        this.scopedTutorialContextFactories = [];
    }
    setup(core) {
        const router = core.http.createRouter();
        router.get({ path: '/api/kibana/home/tutorials', validate: false }, async (context, req, res) => {
            const initialContext = {};
            const scopedContext = this.scopedTutorialContextFactories.reduce((accumulatedContext, contextFactory) => {
                return { ...accumulatedContext, ...contextFactory(req) };
            }, initialContext);
            return res.ok({
                body: this.tutorialProviders.map(tutorialProvider => {
                    return tutorialProvider(scopedContext); // All the tutorialProviders need to be refactored so that they don't need the server.
                }),
            });
        });
        return {
            registerTutorial: (specProvider) => {
                const emptyContext = {};
                const { error } = joi_1.default.validate(specProvider(emptyContext), tutorial_schema_1.tutorialSchema);
                if (error) {
                    throw new Error(`Unable to register tutorial spec because its invalid. ${error}`);
                }
                this.tutorialProviders.push(specProvider);
            },
            addScopedTutorialContextFactory: (scopedTutorialContextFactory) => {
                if (typeof scopedTutorialContextFactory !== 'function') {
                    throw new Error(`Unable to add scoped(request) context factory because you did not provide a function`);
                }
                this.scopedTutorialContextFactories.push(scopedTutorialContextFactory);
            },
        };
    }
    start() {
        // pre-populate with built in tutorials
        this.tutorialProviders.push(...register_1.builtInTutorials);
        return {};
    }
}
exports.TutorialsRegistry = TutorialsRegistry;
