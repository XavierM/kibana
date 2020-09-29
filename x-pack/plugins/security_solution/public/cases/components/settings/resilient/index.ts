/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { lazy } from 'react';

import { CaseSetting } from '../types';
import { ResilientFieldsType } from '../../../../../../case/common/api/connectors';

export * from './types';

export const getCaseSetting = (): CaseSetting<ResilientFieldsType> => {
  return {
    id: '.resilient',
    caseSettingFieldsComponent: lazy(() => import('./fields')),
  };
};
