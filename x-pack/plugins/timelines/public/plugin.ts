/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */
import { CoreSetup, Plugin, PluginInitializerContext } from '../../../../src/core/public';
import { TimelinesPluginSetup, TGridProps } from './types';
import { getTimelineLazy } from './methods';
import { tGridActions, getReduxDeps, tGridSelectors } from './store/t_grid';
import { initialTGridState, tGridReducer } from './store/t_grid/reducer';

export class TimelinesPlugin implements Plugin<TimelinesPluginSetup> {
  constructor(private readonly initializerContext: PluginInitializerContext) {}

  public setup(core: CoreSetup): TimelinesPluginSetup {
    const config = this.initializerContext.config.get<{ enabled: boolean }>();
    if (!config.enabled) {
      return {};
    }

    return {
      getTGrid: (props: TGridProps) => {
        return getTimelineLazy(props);
      },
      getTimelineStore: () => {
        return {
          actions: tGridActions,
          initialState: initialTGridState,
          reducer: tGridReducer,
          selectors: tGridSelectors,
        };
      },
      getCreatedTgridStore: (type: TGridProps['type']) => {
        return getReduxDeps(type);
      },
    };
  }

  public start() {
    const config = this.initializerContext.config.get<{ enabled: boolean }>();
    if (!config.enabled) {
      return {};
    }
    return {
      getTimeline: (props: TGridProps) => {
        return getTimelineLazy(props);
      },
      getTimelineStore: () => {
        return {
          actions: tGridActions,
          initialState: initialTGridState,
          reducer: tGridReducer,
        };
      },
      getCreatedTgridStore: (type: TGridProps['type']) => {
        return getReduxDeps(type);
      },
    };
  }

  public stop() {}
}
