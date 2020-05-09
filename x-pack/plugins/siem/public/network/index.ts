/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SecuritySubPlugins } from '../app/types';
import { getNetworkRoutes } from './routes';
import { initialNetworkState, networkReducer, NetworkState } from './store';

export class Network {
  public setup() {}

  public start(): SecuritySubPlugins<NetworkState> {
    return {
      routes: getNetworkRoutes(),
      store: {
        initialState: { network: initialNetworkState },
        reducer: { network: networkReducer },
      },
    };
  }
}
