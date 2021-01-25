/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { KibanaRequest } from 'src/core/server';
import { loggingSystemMock, elasticsearchServiceMock } from 'src/core/server/mocks';
import { actionsClientMock } from '../../../../../actions/server/mocks';
import { createCaseClient } from '../../../client';
import {
  AlertService,
  CaseService,
  CaseConfigureService,
  ConnectorMappingsService,
} from '../../../services';
import { getActions } from '../__mocks__/request_responses';
import { authenticationMock } from '../__fixtures__';
import type { CasesRequestHandlerContext } from '../../../types';

export const createRouteContext = async (client: any, badAuth = false) => {
  const actionsMock = actionsClientMock.create();
  actionsMock.getAll.mockImplementation(() => Promise.resolve(getActions()));
  const log = loggingSystemMock.create().get('case');
  const esClientMock = elasticsearchServiceMock.createClusterClient();

  const caseService = new CaseService(
    log,
    badAuth ? authenticationMock.createInvalid() : authenticationMock.create()
  );
  const caseConfigureServicePlugin = new CaseConfigureService(log);
  const connectorMappingsServicePlugin = new ConnectorMappingsService(log);

  const caseConfigureService = await caseConfigureServicePlugin.setup();
  const alertsService = new AlertService();
  alertsService.initialize(esClientMock);

  const context = ({
    core: {
      savedObjects: {
        client,
      },
    },
    actions: { getActionsClient: () => actionsMock },
    case: {
      getCaseClient: () => caseClient,
    },
    // TODO: remove
    /* securitySolution: {
      getAppClient: () => ({
        getSignalsIndex: () => '.siem-signals',
      }),
    },*/
  } as unknown) as CasesRequestHandlerContext;

  const connectorMappingsService = await connectorMappingsServicePlugin.setup();
  const caseClient = createCaseClient({
    savedObjectsClient: client,
    request: {} as KibanaRequest,
    caseService,
    caseConfigureService,
    connectorMappingsService,
    userActionService: {
      postUserActions: jest.fn(),
      getUserActions: jest.fn(),
    },
    alertsService,
  });

  return context;
};
