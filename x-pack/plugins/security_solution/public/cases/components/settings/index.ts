/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CaseSettingsRegistry } from '../../types';
import { getCaseSetting as getJiraCaseSetting } from './jira';

export function registerCaseSettings({
  caseSettingsRegistry,
}: {
  caseSettingsRegistry: CaseSettingsRegistry;
}) {
  caseSettingsRegistry.register(getJiraCaseSetting());
}
