/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  ILegacyScopedClusterClient,
  KibanaRequest,
  SavedObjectsClientContract,
} from 'kibana/server';
import { ActionsClient } from '../../../actions/server';
import {
  CaseClientPostRequest,
  CasePostRequest,
  CaseResponse,
  CasesPatchRequest,
  CasesResponse,
  CaseStatuses,
  CollectionWithSubCaseResponse,
  CommentRequest,
  ConnectorMappingsAttributes,
  GetFieldsResponse,
} from '../../common/api';
import {
  CaseConfigureServiceSetup,
  CaseServiceSetup,
  CaseUserActionServiceSetup,
  AlertServiceContract,
} from '../services';
import { ConnectorMappingsServiceSetup } from '../services/connector_mappings';

// TODO: Remove unused types

export interface CaseClientCreate {
  theCase: CaseClientPostRequest;
}

export interface CaseClientUpdate {
  cases: CasesPatchRequest;
}

export interface CaseClientAddComment {
  caseId: string;
  comment: CommentRequest;
}

export interface CaseClientAddInternalComment {
  caseId: string;
  comment: CommentRequest;
}

export interface CaseClientUpdateAlertsStatus {
  ids: string[];
  status: CaseStatuses;
  indices: Set<string>;
}

export interface CaseClientFactoryArguments {
  // TODO: we have to use the one that the actions API gives us which is deprecated, but we'll need it updated there first I think
  callCluster: ILegacyScopedClusterClient['callAsCurrentUser'];
  caseConfigureService: CaseConfigureServiceSetup;
  caseService: CaseServiceSetup;
  connectorMappingsService: ConnectorMappingsServiceSetup;
  request: KibanaRequest;
  savedObjectsClient: SavedObjectsClientContract;
  userActionService: CaseUserActionServiceSetup;
  alertsService: AlertServiceContract;
}

export interface ConfigureFields {
  actionsClient: ActionsClient;
  connectorId: string;
  connectorType: string;
}

/**
 * This represents the interface that other plugins can access.
 */
export interface CaseClient {
  addComment(args: CaseClientAddComment): Promise<CollectionWithSubCaseResponse>;
  create(theCase: CasePostRequest): Promise<CaseResponse>;
  getFields(args: ConfigureFields): Promise<GetFieldsResponse>;
  getMappings(args: MappingsClient): Promise<ConnectorMappingsAttributes[]>;
  update(args: CasesPatchRequest): Promise<CasesResponse>;
  updateAlertsStatus(args: CaseClientUpdateAlertsStatus): Promise<void>;
}

export interface MappingsClient {
  actionsClient: ActionsClient;
  connectorId: string;
  connectorType: string;
}
