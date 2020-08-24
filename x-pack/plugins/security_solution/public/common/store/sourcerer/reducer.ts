/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { reducerWithInitialState } from 'typescript-fsa-reducers';

import {
  setActiveSourceGroupId,
  setKibanaIndexPatterns,
  setIsIndexPatternsLoading,
  setIsSourceLoading,
  setSource,
} from './actions';
import { initialSourcererState, SourcererModel } from './model';
import { getSourceDefaults } from '../../containers/sourcerer';

export type SourcererState = SourcererModel;

export const sourcererReducer = reducerWithInitialState(initialSourcererState)
  .case(setActiveSourceGroupId, (state, { payload }) => ({
    ...state,
    activeSourceGroupId: payload,
  }))
  .case(setKibanaIndexPatterns, (state, { payload }) => ({
    ...state,
    kibanaIndexPatterns: payload,
  }))
  .case(setIsIndexPatternsLoading, (state, { payload }) => ({
    ...state,
    isIndexPatternsLoading: payload,
  }))
  .case(setIsSourceLoading, (state, { id, payload }) => ({
    ...state,
    sourceGroups: {
      ...state.sourceGroups,
      [id]: {
        ...state.sourceGroups[id],
        id,
        loading: payload,
      },
    },
  }))
  .case(setSource, (state, { id, payload }) => ({
    ...state,
    sourceGroups: {
      ...state.sourceGroups,
      [id]: {
        ...getSourceDefaults(id, payload.selectedPatterns),
        ...state.sourceGroups[id],
        ...payload,
      },
    },
  }))
  .build();
