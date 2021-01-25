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
import { CaseAttributesRt, CaseStatusRt } from './case';

// TODO: comments

const SubCaseBasicRt = rt.type({
  status: CaseStatusRt,
});

export const SubCaseAttributesRt = rt.intersection([
  SubCaseBasicRt,
  rt.type({
    closed_at: rt.union([rt.string, rt.null]),
    closed_by: rt.union([UserRT, rt.null]),
    created_at: rt.string,
    updated_at: rt.union([rt.string, rt.null]),
    updated_by: rt.union([UserRT, rt.null]),
  }),
]);

export const CollectionSubCaseAttributesRt = rt.type({
  subCase: rt.union([SubCaseAttributesRt, rt.null]),
  caseCollection: CaseAttributesRt,
});

export const SubCasesFindRequestRt = rt.partial({
  status: CaseStatusRt,
  defaultSearchOperator: rt.union([rt.literal('AND'), rt.literal('OR')]),
  fields: rt.array(rt.string),
  page: NumberFromString,
  perPage: NumberFromString,
  search: rt.string,
  searchFields: rt.array(rt.string),
  sortField: rt.string,
  sortOrder: rt.union([rt.literal('desc'), rt.literal('asc')]),
});

export const CollectWithSubCaseResponseRt = rt.intersection([
  CollectionSubCaseAttributesRt,
  rt.type({
    id: rt.string,
    totalComment: rt.number,
    version: rt.string,
  }),
  rt.partial({
    totalAlerts: rt.number,
    comments: rt.array(CommentResponseRt),
  }),
]);

export const SubCaseResponseRt = rt.intersection([
  SubCaseAttributesRt,
  rt.type({
    id: rt.string,
    totalComment: rt.number,
    totalAlerts: rt.number,
    version: rt.string,
  }),
  rt.partial({
    comments: rt.array(CommentResponseRt),
  }),
]);

export const SubCasesFindResponseRt = rt.intersection([
  rt.type({
    cases: rt.array(SubCaseResponseRt),
    page: rt.number,
    per_page: rt.number,
    total: rt.number,
  }),
  CasesStatusResponseRt,
]);

export const SubCasePatchRequestRt = rt.intersection([
  rt.partial(SubCaseBasicRt.props),
  rt.type({ id: rt.string, version: rt.string }),
]);

export const SubCasesPatchRequestRt = rt.type({ cases: rt.array(SubCasePatchRequestRt) });
export const SubCasesResponseRt = rt.array(SubCaseResponseRt);

// TODO: extract these to their own file and rename the types
export type CollectionWithSubCaseAttributes = rt.TypeOf<typeof CollectionSubCaseAttributesRt>;
export type CollectionWithSubCaseResponse = rt.TypeOf<typeof CollectWithSubCaseResponseRt>;

export type SubCaseAttributes = rt.TypeOf<typeof SubCaseAttributesRt>;
export type SubCaseResponse = rt.TypeOf<typeof SubCaseResponseRt>;
export type SubCasesResponse = rt.TypeOf<typeof SubCasesResponseRt>;
export type SubCasesFindResponse = rt.TypeOf<typeof SubCasesFindResponseRt>;
export type SubCasePatchRequest = rt.TypeOf<typeof SubCasePatchRequestRt>;
export type SubCasesPatchRequest = rt.TypeOf<typeof SubCasesPatchRequestRt>;
