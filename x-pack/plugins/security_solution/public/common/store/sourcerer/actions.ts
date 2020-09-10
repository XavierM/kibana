/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import actionCreatorFactory from 'typescript-fsa';

import { KibanaIndexPatterns, ManageScopeInit, SourcererScopeName } from './model';

const actionCreator = actionCreatorFactory('x-pack/security_solution/local/sourcerer');

export const setSource = actionCreator<{
  id: SourcererScopeName;
  payload: ManageScopeInit;
}>('SET_SOURCE');

export const setIndexPatternsList = actionCreator<{
  kibanaIndexPatterns: KibanaIndexPatterns;
  allIndexPatterns: string[];
}>('SET_INDEX_PATTERNS_LIST');

export const setIsIndexPatternsLoading = actionCreator<{ payload: boolean }>(
  'SET_IS_INDEX_PATTERNS_LOADING'
);

export const setSelectedIndexPatterns = actionCreator<{
  id: SourcererScopeName;
  selectedPatterns: string[];
}>('SET_SELECTED_INDEX_PATTERNS');
