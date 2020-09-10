/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { reducerWithInitialState } from 'typescript-fsa-reducers';

import {
  setIndexPatternsList,
  setIsIndexPatternsLoading,
  setSelectedIndexPatterns,
  setSource,
} from './actions';
import { initialSourcererState, SourcererModel } from './model';

export type SourcererState = SourcererModel;

export const sourcererReducer = reducerWithInitialState(initialSourcererState)
  .case(setIndexPatternsList, (state, { kibanaIndexPatterns, allIndexPatterns }) => ({
    ...state,
    kibanaIndexPatterns,
    allIndexPatterns,
  }))
  .case(setIsIndexPatternsLoading, (state, { payload }) => ({
    ...state,
    isIndexPatternsLoading: payload,
  }))
  .case(setSelectedIndexPatterns, (state, { id, selectedPatterns }) => {
    return {
      ...state,
      sourcererScopes: {
        ...state.sourcererScopes,
        [id]: {
          ...state.sourcererScopes[id],
          ...selectedPatterns,
        },
      },
    };
  })
  .case(setSource, (state, { id, payload }) => {
    const { allExistingIndexPatterns, ...sourcererScopes } = payload;
    return {
      ...state,
      allIndexPatterns: allExistingIndexPatterns,
      sourcererScopes: {
        ...state.sourcererScopes,
        [id]: {
          ...state.sourcererScopes[id],
          ...sourcererScopes,
        },
      },
    };
  })
  .build();
