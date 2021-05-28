/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import {
  Action,
  applyMiddleware,
  CombinedState,
  compose,
  createStore as createReduxStore,
  PreloadedState,
  Store,
} from 'redux';

import { createEpicMiddleware } from 'redux-observable';
import { Storage } from '../../../../../../src/plugins/kibana_utils/public';

export * from './model';
export * as tGridActions from './actions';
export * as tGridSelectors from './selectors';
export * from './types';
import { TimelineState, tGridSelectors, TGridEpicDependencies } from '../../types';
import { tGridReducer } from './reducer';

type State = CombinedState<TimelineState>;

/**
 * Factory for Security App's redux store.
 */
export const createStore = (
  state: PreloadedState<TimelineState>,
  storage: Storage
): Store<State, Action> => {
  const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middlewareDependencies: TGridEpicDependencies<State> = {
    tGridByIdSelector: tGridSelectors.getTGridByIdSelector,
    storage,
  };

  const epicMiddleware = createEpicMiddleware<Action, Action, State, typeof middlewareDependencies>(
    {
      dependencies: middlewareDependencies,
    }
  );

  const store: Store<State, Action> = createReduxStore(
    tGridReducer,
    state,
    composeEnhancers(applyMiddleware(epicMiddleware))
  );

  // epicMiddleware.run(createRootEpic<CombinedState<State>>());

  return store;
};
