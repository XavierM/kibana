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
/**
 * @name Vis
 *
 * @description This class consists of aggs, params, listeners, title, and type.
 *  - Aggs: Instances of IAggConfig.
 *  - Params: The settings in the Options tab.
 *
 * Not to be confused with vislib/vis.js.
 */
const lodash_1 = require("lodash");
const persisted_state_1 = require("./persisted_state");
const services_1 = require("./services");
class Vis {
    constructor(visType, visState = {}) {
        this.title = '';
        this.description = '';
        this.params = {};
        // Session state is for storing information that is transitory, and will not be saved with the visualization.
        // For instance, map bounds, which depends on the view port, browser window size, etc.
        this.sessionState = {};
        this.data = {};
        this.type = this.getType(visType);
        this.params = this.getParams(visState.params);
        this.uiState = new persisted_state_1.PersistedState(visState.uiState);
        this.id = visState.id;
        this.setState(visState || {});
    }
    getType(visType) {
        const type = services_1.getTypes().get(visType);
        if (!type) {
            throw new Error(`Invalid type "${visType}"`);
        }
        return type;
    }
    getParams(params) {
        return lodash_1.defaults({}, lodash_1.cloneDeep(params || {}), lodash_1.cloneDeep(this.type.visConfig.defaults || {}));
    }
    setState(state) {
        let typeChanged = false;
        if (state.type && this.type.name !== state.type) {
            // @ts-ignore
            this.type = this.getType(state.type);
            typeChanged = true;
        }
        if (state.title !== undefined) {
            this.title = state.title;
        }
        if (state.description !== undefined) {
            this.description = state.description;
        }
        if (state.params || typeChanged) {
            this.params = this.getParams(state.params);
        }
        if (state.data && state.data.searchSource) {
            this.data.searchSource = state.data.searchSource;
            this.data.indexPattern = this.data.searchSource.getField('index');
        }
        if (state.data && state.data.savedSearchId) {
            this.data.savedSearchId = state.data.savedSearchId;
        }
        if (state.data && state.data.aggs) {
            const configStates = this.initializeDefaultsFromSchemas(lodash_1.cloneDeep(state.data.aggs), this.type.schemas.all || []);
            if (!this.data.indexPattern) {
                if (state.data.aggs.length) {
                    throw new Error('trying to initialize aggs without index pattern');
                }
                return;
            }
            this.data.aggs = services_1.getAggs().createAggConfigs(this.data.indexPattern, configStates);
        }
    }
    clone() {
        return new Vis(this.type.name, this.serialize());
    }
    serialize() {
        const aggs = this.data.aggs ? this.data.aggs.aggs.map(agg => agg.toJSON()) : [];
        const indexPattern = this.data.searchSource && this.data.searchSource.getField('index');
        return {
            id: this.id,
            title: this.title,
            type: this.type.name,
            params: lodash_1.cloneDeep(this.params),
            uiState: this.uiState.toJSON(),
            data: {
                aggs: aggs,
                indexPattern: indexPattern ? indexPattern.id : undefined,
                searchSource: this.data.searchSource.createCopy(),
                savedSearchId: this.data.savedSearchId,
            },
        };
    }
    toAST() {
        return this.type.toAST(this.params);
    }
    // deprecated
    isHierarchical() {
        if (lodash_1.isFunction(this.type.hierarchicalData)) {
            return !!this.type.hierarchicalData(this);
        }
        else {
            return !!this.type.hierarchicalData;
        }
    }
    initializeDefaultsFromSchemas(configStates, schemas) {
        // Set the defaults for any schema which has them. If the defaults
        // for some reason has more then the max only set the max number
        // of defaults (not sure why a someone define more...
        // but whatever). Also if a schema.name is already set then don't
        // set anything.
        const newConfigs = [...configStates];
        schemas
            .filter((schema) => Array.isArray(schema.defaults) && schema.defaults.length > 0)
            .filter((schema) => !configStates.find(agg => agg.schema && agg.schema === schema.name))
            .forEach((schema) => {
            const defaultSchemaConfig = schema.defaults.slice(0, schema.max);
            defaultSchemaConfig.forEach((d) => newConfigs.push(d));
        });
        return newConfigs;
    }
}
exports.Vis = Vis;
