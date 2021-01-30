/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

export const APP_ID = 'case';

/**
 * Case routes
 */

export const CASES_URL = '/api/cases';
export const CASE_DETAILS_URL = `${CASES_URL}/{case_id}`;
export const CASE_CONFIGURE_URL = `${CASES_URL}/configure`;
export const CASE_COLLECTION_URL = `${CASES_URL}/collection`;
export const CASE_CONFIGURE_CONNECTORS_URL = `${CASE_CONFIGURE_URL}/connectors`;
export const CASE_CONFIGURE_CONNECTOR_DETAILS_URL = `${CASE_CONFIGURE_CONNECTORS_URL}/{connector_id}`;
export const CASE_CONFIGURE_PUSH_URL = `${CASE_CONFIGURE_CONNECTOR_DETAILS_URL}/push`;

export const SUB_CASES_PATCH_URL = `${CASES_URL}/sub_cases`;
export const SUB_CASES_URL = `${CASE_DETAILS_URL}/sub_cases`;
export const SUB_CASE_DETAILS_URL = `${CASE_DETAILS_URL}/sub_cases/{sub_case_id}`;

export const CASE_COMMENTS_URL = `${CASE_DETAILS_URL}/comments`;
export const CASE_COMMENT_DETAILS_URL = `${CASE_DETAILS_URL}/comments/{comment_id}`;
export const CASE_REPORTERS_URL = `${CASES_URL}/reporters`;
export const CASE_STATUS_URL = `${CASES_URL}/status`;
export const CASE_TAGS_URL = `${CASES_URL}/tags`;
export const CASE_USER_ACTIONS_URL = `${CASE_DETAILS_URL}/user_actions`;

/**
 * Action routes
 */

export const ACTION_URL = '/api/actions';
export const ACTION_TYPES_URL = '/api/actions/list_action_types';
export const SERVICENOW_ACTION_TYPE_ID = '.servicenow';
export const JIRA_ACTION_TYPE_ID = '.jira';
export const RESILIENT_ACTION_TYPE_ID = '.resilient';

export const SUPPORTED_CONNECTORS = [
  SERVICENOW_ACTION_TYPE_ID,
  JIRA_ACTION_TYPE_ID,
  RESILIENT_ACTION_TYPE_ID,
];
