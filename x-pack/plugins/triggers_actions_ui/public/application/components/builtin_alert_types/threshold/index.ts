/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { lazy } from 'react';
import { i18n } from '@kbn/i18n';

import { AlertTypeModel } from '../../../../types';
import { validateExpression } from './validation';
import { IndexThresholdAlertParams } from './types';
import { AlertsContextValue } from '../../../context/alerts_context';

export function getAlertType(): AlertTypeModel<IndexThresholdAlertParams, AlertsContextValue> {
  return {
    id: '.index-threshold',
    name: i18n.translate('xpack.triggersActionsUI.indexThresholdAlert.nameText', {
      defaultMessage: 'Index threshold',
    }),
    description: i18n.translate('xpack.triggersActionsUI.indexThresholdAlert.descriptionText', {
      defaultMessage: 'Alert when an aggregated query meets the threshold.',
    }),
    iconClass: 'alert',
    alertParamsExpression: lazy(() => import('./expression')),
    validate: validateExpression,
    requiresAppContext: false,
  };
}
