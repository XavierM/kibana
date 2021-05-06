/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback } from 'react';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { EuiButton } from '@elastic/eui';
import { FormattedMessage, I18nProvider } from '@kbn/i18n/react';
import { TimelineId } from '../store/t_grid/types';
import * as actions from '../store/t_grid/actions';
import { getReduxDeps } from '../store/t_grid';

import { TGrid } from './tgrid';
import { PLUGIN_NAME } from '../../common';
import { TimelineProps } from '../types';

export const Timeline = (props: TimelineProps) => {
  const reduxStuff = getReduxDeps(props.type);
  if (props.type === 'standalone') {
    return (
      <Provider store={reduxStuff}>
        <I18nProvider>
          <TGrid {...props} />
        </I18nProvider>
      </Provider>
    );
  } else {
    return (
      <I18nProvider>
        <TGrid {...props} />
      </I18nProvider>
    );
  }
};

// eslint-disable-next-line import/no-default-export
export { Timeline as default };
