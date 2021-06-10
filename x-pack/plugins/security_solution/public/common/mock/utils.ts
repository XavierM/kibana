/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { AnyAction, Reducer } from 'redux';
import reduceReducers from 'reduce-reducers';

import { tGridReducer } from '../../../../timelines/public';

import { hostsReducer } from '../../hosts/store';
import { networkReducer } from '../../network/store';
import { timelineReducer } from '../../timelines/store/timeline/reducer';
import { managementReducer } from '../../management/store/reducer';
import { ManagementPluginReducer } from '../../management';
import { SubPluginsInitReducer } from '../store';
import { mockGlobalState } from './global_state';
import { TimelineState } from '../../timelines/store/timeline/types';

interface Global extends NodeJS.Global {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  window?: any;
}

export const globalNode: Global = global;

const combineTimelineReducer = (reduceReducers(
  mockGlobalState.timeline,
  tGridReducer,
  timelineReducer
) as unknown) as Reducer<TimelineState, AnyAction>;

export const SUB_PLUGINS_REDUCER: SubPluginsInitReducer = {
  hosts: hostsReducer,
  network: networkReducer,
  timeline: combineTimelineReducer,
  /**
   * These state's are wrapped in `Immutable`, but for compatibility with the overall app architecture,
   * they are cast to mutable versions here.
   */
  management: managementReducer as ManagementPluginReducer['management'],
};
