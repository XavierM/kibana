/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { CaseSettingsRegistry } from './types';
import { createCaseSettingsRegistry } from './settings_registry';
import { getCaseSetting as getJiraCaseSetting } from './jira';
import { getCaseSetting as getResilientCaseSetting } from './resilient';
import { getCaseSetting as getServiceNowCaseSetting } from './servicenow';
import {
  JiraFieldsType,
  ServiceNowFieldsType,
  ResilientFieldsType,
} from '../../../../../case/common/api/connectors';

interface UseCaseSettingReturn {
  caseSettingsRegistry: CaseSettingsRegistry;
}

function registerCaseSettings(caseSettingsRegistry: CaseSettingsRegistry) {
  caseSettingsRegistry.register<JiraFieldsType>(getJiraCaseSetting());
  caseSettingsRegistry.register<ResilientFieldsType>(getResilientCaseSetting());
  caseSettingsRegistry.register<ServiceNowFieldsType>(getServiceNowCaseSetting());
}

const caseSettingsRegistry = createCaseSettingsRegistry();
registerCaseSettings(caseSettingsRegistry);

export const useCaseSettings = (): UseCaseSettingReturn => {
  return {
    caseSettingsRegistry,
  };
};
