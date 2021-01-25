/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import * as rt from 'io-ts';

import { UserRT } from '../user';

/**
 * this is used to differentiate between an alert attached to a top-level case and a group of alerts that should only
 * be attached to a sub case. The reason we need this is because an alert group comment will have references to both a case and
 * sub case when it is created. For us to be able to filter out alert groups in a top-level case we need a field to
 * use as a filter.
 */
export enum AssociationType {
  case = 'case',
  subCase = 'sub_case',
}

export const CommentAttributesBasicRt = rt.type({
  associationType: rt.union([
    rt.literal(AssociationType.case),
    rt.literal(AssociationType.subCase),
  ]),
  created_at: rt.string,
  created_by: UserRT,
  pushed_at: rt.union([rt.string, rt.null]),
  pushed_by: rt.union([UserRT, rt.null]),
  updated_at: rt.union([rt.string, rt.null]),
  updated_by: rt.union([UserRT, rt.null]),
});

export enum CommentType {
  user = 'user',
  alert = 'alert',
  alertGroup = 'alert_group',
}

export const ContextTypeUserRt = rt.type({
  comment: rt.string,
  type: rt.literal(CommentType.user),
});

export const ContextTypeAlertRt = rt.type({
  type: rt.literal(CommentType.alert),
  alertId: rt.union([rt.array(rt.string), rt.string]),
  index: rt.string,
});

const AlertIDRt = rt.type({
  _id: rt.string,
});

export const ContextTypeAlertGroupRt = rt.type({
  type: rt.literal(CommentType.alertGroup),
  alerts: rt.union([rt.array(AlertIDRt), AlertIDRt]),
  index: rt.string,
  ruleId: rt.string,
});

export const ContextTypeAlertGroupAttributesRt = rt.type({
  type: rt.literal(CommentType.alertGroup),
  alertId: rt.union([rt.array(rt.string), rt.string]),
  index: rt.string,
  ruleId: rt.string,
});

const AttributesTypeUserRt = rt.intersection([ContextTypeUserRt, CommentAttributesBasicRt]);
const AttributesTypeAlertsRt = rt.intersection([ContextTypeAlertRt, CommentAttributesBasicRt]);
const AttributesTypeAlertGroupRt = rt.intersection([
  ContextTypeAlertGroupAttributesRt,
  CommentAttributesBasicRt,
]);
const CommentAttributesRt = rt.union([
  AttributesTypeUserRt,
  AttributesTypeAlertsRt,
  AttributesTypeAlertGroupRt,
]);

const ContextBasicRt = rt.union([ContextTypeUserRt, ContextTypeAlertRt, ContextTypeAlertGroupRt]);

export const CommentRequestRt = ContextBasicRt;

export const CommentResponseRt = rt.intersection([
  CommentAttributesRt,
  rt.type({
    id: rt.string,
    version: rt.string,
  }),
]);

export const AllCommentsResponseRT = rt.array(CommentResponseRt);

export const CommentPatchRequestRt = rt.intersection([
  /**
   * Partial updates are not allowed.
   * We want to prevent the user for changing the type without removing invalid fields.
   */
  ContextBasicRt,
  rt.type({ id: rt.string, version: rt.string }),
]);

/**
 * This type is used by the CaseService.
 * Because the type for the attributes of savedObjectClient update function is Partial<T>
 * we need to make all of our attributes partial too.
 * We ensure that partial updates of CommentContext is not going to happen inside the patch comment route.
 */
export const CommentPatchAttributesRt = rt.intersection([
  rt.union([
    rt.partial(CommentAttributesBasicRt.props),
    rt.partial(ContextTypeAlertRt.props),
    rt.partial(ContextTypeAlertGroupAttributesRt.props),
  ]),
  rt.partial(CommentAttributesBasicRt.props),
]);

export const CommentsResponseRt = rt.type({
  comments: rt.array(CommentResponseRt),
  page: rt.number,
  per_page: rt.number,
  total: rt.number,
});

export const AllCommentsResponseRt = rt.array(CommentResponseRt);

export type CommentAttributes = rt.TypeOf<typeof CommentAttributesRt>;
export type CommentRequest = rt.TypeOf<typeof CommentRequestRt>;
export type CommentResponse = rt.TypeOf<typeof CommentResponseRt>;
export type AllCommentsResponse = rt.TypeOf<typeof AllCommentsResponseRt>;
export type CommentsResponse = rt.TypeOf<typeof CommentsResponseRt>;
export type CommentPatchRequest = rt.TypeOf<typeof CommentPatchRequestRt>;
export type CommentPatchAttributes = rt.TypeOf<typeof CommentPatchAttributesRt>;
export type CommentRequestUserType = rt.TypeOf<typeof ContextTypeUserRt>;
export type CommentRequestAlertType = rt.TypeOf<typeof ContextTypeAlertRt>;

export type CommentRequestAlertGroupType = rt.TypeOf<typeof ContextTypeAlertGroupRt>;
export type CommentAlertGroupAttributesType = rt.TypeOf<typeof ContextTypeAlertGroupAttributesRt>;
