/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  Reducer,
  AnyAction,
  Middleware,
  Dispatch,
  PreloadedState,
  StateFromReducersMapObject,
  CombinedState,
} from 'redux';

import { NavTab } from '../common/components/navigation/types';
import { State, SubPluginsInitReducer } from '../common/store';
import { Immutable } from '../../common/endpoint/types';
import { AppAction } from '../common/store/actions';

export enum SecurityPageName {
  alerts = 'alerts',
  overview = 'overview',
  hosts = 'hosts',
  network = 'network',
  timelines = 'timelines',
  case = 'case',
  management = 'management',
}

export type SiemNavTabKey =
  | SecurityPageName.overview
  | SecurityPageName.hosts
  | SecurityPageName.network
  | SecurityPageName.alerts
  | SecurityPageName.timelines
  | SecurityPageName.case
  | SecurityPageName.management;

export type SiemNavTab = Record<SiemNavTabKey, NavTab>;

export interface SecuritySubPluginStore<K extends SecuritySubPluginKeyStore, T> {
  initialState: Record<K, T | undefined>;
  reducer: Record<K, Reducer<T, AnyAction>>;
  middleware?: Array<Middleware<{}, State, Dispatch<AppAction | Immutable<AppAction>>>>;
}

export interface SecuritySubPlugin {
  SubPluginRoutes: React.FC;
}

type SecuritySubPluginKeyStore =
  | 'hosts'
  | 'network'
  | 'timeline'
  | 'hostList'
  | 'alertList'
  | 'management';

/**
 * Returned by the various 'SecuritySubPlugin' classes from the `start` method.
 */
export interface SecuritySubPluginWithStore<K extends SecuritySubPluginKeyStore, T>
  extends SecuritySubPlugin {
  store: SecuritySubPluginStore<K, T>;
}

export interface SecuritySubPlugins extends SecuritySubPlugin {
  store: {
    initialState: PreloadedState<
      CombinedState<
        StateFromReducersMapObject<
          /** SubPluginsInitReducer, being an interface, will not work in `StateFromReducersMapObject`.
           * Picking its keys does the trick.
           **/
          Pick<SubPluginsInitReducer, keyof SubPluginsInitReducer>
        >
      >
    >;
    reducer: SubPluginsInitReducer;
    middlewares: Array<Middleware<{}, State, Dispatch<AppAction | Immutable<AppAction>>>>;
  };
}
