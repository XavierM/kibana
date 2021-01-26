/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as rt from 'io-ts';

import { NumberFromString } from '../saved_object';
import { UserRT } from '../user';
import { CommentResponseRt } from './comment';
import { CasesStatusResponseRt } from './status';
import { CaseConnectorRt, ESCaseConnector } from '../connectors';
import { SubCaseResponseRt } from './sub_case';

export enum CaseStatuses {
  open = 'open',
  'in-progress' = 'in-progress',
  closed = 'closed',
}

export const CaseStatusRt = rt.union([
  rt.literal(CaseStatuses.open),
  rt.literal(CaseStatuses['in-progress']),
  rt.literal(CaseStatuses.closed),
]);

export const caseStatuses = Object.values(CaseStatuses);

export enum CaseType {
  parent = 'parent',
  individual = 'individual',
}

const CaseTypeRt = rt.union([rt.literal(CaseType.parent), rt.literal(CaseType.individual)]);

const SettingsRt = rt.type({
  syncAlerts: rt.boolean,
});

const CaseBasicNoTypeRt = rt.type({
  description: rt.string,
  status: CaseStatusRt,
  tags: rt.array(rt.string),
  title: rt.string,
  type: CaseTypeRt,
  connector: CaseConnectorRt,
  settings: SettingsRt,
});

const CaseBasicRt = rt.type({
  ...CaseBasicNoTypeRt.props,
  type: CaseTypeRt,
});

const CaseExternalServiceBasicRt = rt.type({
  connector_id: rt.string,
  connector_name: rt.string,
  external_id: rt.string,
  external_title: rt.string,
  external_url: rt.string,
});

const CaseFullExternalServiceRt = rt.union([
  rt.intersection([
    CaseExternalServiceBasicRt,
    rt.type({
      pushed_at: rt.string,
      pushed_by: UserRT,
    }),
  ]),
  rt.null,
]);

export const CaseAttributesRt = rt.intersection([
  CaseBasicRt,
  rt.type({
    closed_at: rt.union([rt.string, rt.null]),
    closed_by: rt.union([UserRT, rt.null]),
    converted_by: rt.union([UserRT, rt.null]),
    created_at: rt.string,
    created_by: UserRT,
    external_service: CaseFullExternalServiceRt,
    updated_at: rt.union([rt.string, rt.null]),
    updated_by: rt.union([UserRT, rt.null]),
  }),
]);

export const CasePostRequestRt = rt.type({
  description: rt.string,
  tags: rt.array(rt.string),
  title: rt.string,
  connector: CaseConnectorRt,
  settings: SettingsRt,
});

export const CaseClientPostRequestRt = rt.type({
  type: CaseTypeRt,
  ...CasePostRequestRt.props,
});

export const CaseExternalServiceRequestRt = CaseExternalServiceBasicRt;

export const CasesFindRequestRt = rt.partial({
  type: CaseTypeRt,
  tags: rt.union([rt.array(rt.string), rt.string]),
  status: CaseStatusRt,
  reporters: rt.union([rt.array(rt.string), rt.string]),
  defaultSearchOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),
  fields: rt.array(rt.string),
  page: NumberFromString,
  perPage: NumberFromString,
  search: rt.string,
  searchFields: rt.array(rt.string),
  sortField: rt.string,
  sortOrder: rt.union([rt.literal('desc'), rt.literal('asc')]),
});

export const CaseResponseRt = rt.intersection([
  CaseAttributesRt,
  rt.type({
    id: rt.string,
    totalComment: rt.number,
    totalAlerts: rt.number,
    version: rt.string,
  }),
  rt.partial({
    subCases: rt.array(SubCaseResponseRt),
    comments: rt.array(CommentResponseRt),
  }),
]);

export const CasesFindResponseRt = rt.intersection([
  rt.type({
    cases: rt.array(CaseResponseRt),
    page: rt.number,
    per_page: rt.number,
    total: rt.number,
  }),
  CasesStatusResponseRt,
]);

export const CasePatchRequestRt = rt.intersection([
  rt.partial(CaseBasicNoTypeRt.props),
  rt.type({ id: rt.string, version: rt.string }),
]);

/**
 * This is so the convert request can just pass the request along to the internal
 * update functionality. We don't want to expose the type field in the API request though
 * so users can't change a collection back to a normal case.
 */
export const CaseUpdateRequestRt = rt.intersection([
  rt.partial(CaseBasicRt.props),
  rt.type({ id: rt.string, version: rt.string }),
]);

export const CaseConvertRequestRt = rt.type({ id: rt.string, version: rt.string });

export const CasesPatchRequestRt = rt.type({ cases: rt.array(CasePatchRequestRt) });
export const CasesResponseRt = rt.array(CaseResponseRt);
export const CasesUpdateRequestRt = rt.type({ cases: rt.array(CaseUpdateRequestRt) });

export type CaseAttributes = rt.TypeOf<typeof CaseAttributesRt>;
// TODO: document how this is different from the CasePostRequest
export type CaseClientPostRequest = rt.TypeOf<typeof CaseClientPostRequestRt>;
export type CasePostRequest = rt.TypeOf<typeof CasePostRequestRt>;
export type CaseResponse = rt.TypeOf<typeof CaseResponseRt>;
export type CasesResponse = rt.TypeOf<typeof CasesResponseRt>;
export type CasesFindRequest = rt.TypeOf<typeof CasesFindRequestRt>;
export type CasesFindResponse = rt.TypeOf<typeof CasesFindResponseRt>;
export type CasePatchRequest = rt.TypeOf<typeof CasePatchRequestRt>;
// The update request is different from the patch request in that it allow updating the type field
export type CasesUpdateRequest = rt.TypeOf<typeof CasesUpdateRequestRt>;
export type CasesPatchRequest = rt.TypeOf<typeof CasesPatchRequestRt>;
export type CaseExternalServiceRequest = rt.TypeOf<typeof CaseExternalServiceRequestRt>;
export type CaseFullExternalService = rt.TypeOf<typeof CaseFullExternalServiceRt>;
export type CaseSettings = rt.TypeOf<typeof SettingsRt>;

export type ESCaseAttributes = Omit<CaseAttributes, 'connector'> & { connector: ESCaseConnector };
export type ESCasePatchRequest = Omit<CasePatchRequest, 'connector'> & {
  connector?: ESCaseConnector;
};

export type CaseConvertRequest = rt.TypeOf<typeof CaseConvertRequestRt>;
