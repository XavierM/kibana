/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import Boom from '@hapi/boom';
import { pipe } from 'fp-ts/lib/pipeable';
import { fold } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';

import {
  KibanaRequest,
  SavedObject,
  SavedObjectsClientContract,
  SavedObjectsFindResponse,
} from 'src/core/server';
import {
  decodeComment,
  flattenCommentableCaseSavedObject,
  flattenSubCaseSavedObject,
  getAlertIds,
  isAlertGroupContext,
  transformNewComment,
} from '../../routes/api/utils';

import {
  throwErrors,
  CommentRequestRt,
  CaseResponse,
  CommentType,
  CaseStatuses,
  AssociationType,
  CaseType,
  SubCaseAttributes,
  SubCaseResponseRt,
  SubCaseResponse,
  CommentRequest,
  CollectWithSubCaseResponseRt,
  CollectionWithSubCaseResponse,
  ContextTypeAlertGroupRt,
  CommentRequestAlertGroupType,
  CommentAttributes,
} from '../../../common/api';
import { buildCommentUserActionItem } from '../../services/user_actions/helpers';

import { CaseClientAddComment, CaseClientFactoryArguments } from '../types';
import { CASE_SAVED_OBJECT, SUB_CASE_SAVED_OBJECT } from '../../saved_object_types';
import { CaseServiceSetup, CaseUserActionServiceSetup } from '../../services';
import { CommentableCase } from '../../common';
import { CaseClientImpl } from '..';

async function getSubCase({
  caseService,
  savedObjectsClient,
  caseId,
  createdAt,
}: {
  caseService: CaseServiceSetup;
  savedObjectsClient: SavedObjectsClientContract;
  caseId: string;
  createdAt: string;
}): Promise<SavedObject<SubCaseAttributes>> {
  const mostRecentSubCase = await caseService.getMostRecentSubCase(savedObjectsClient, caseId);
  if (mostRecentSubCase && mostRecentSubCase.attributes.status !== CaseStatuses.closed) {
    return mostRecentSubCase;
  }

  // else need to create a new sub case
  return caseService.createSubCase(savedObjectsClient, createdAt, caseId);
}

function countAlerts(comments: SavedObjectsFindResponse<CommentAttributes>): number {
  let totalAlerts = 0;
  for (const comment of comments.saved_objects) {
    if (
      comment.attributes.type === CommentType.alert ||
      comment.attributes.type === CommentType.alertGroup
    ) {
      if (Array.isArray(comment.attributes.alertId)) {
        totalAlerts += comment.attributes.alertId.length;
      } else {
        totalAlerts++;
      }
    }
  }
  return totalAlerts;
}

interface AddCommentFromRuleArgs {
  caseClient: CaseClientImpl;
  caseId: string;
  comment: CommentRequestAlertGroupType;
  savedObjectsClient: SavedObjectsClientContract;
  caseService: CaseServiceSetup;
  userActionService: CaseUserActionServiceSetup;
}

export const addAlertGroup = async ({
  savedObjectsClient,
  caseService,
  userActionService,
  caseClient,
  caseId,
  comment,
}: AddCommentFromRuleArgs): Promise<CollectionWithSubCaseResponse> => {
  const query = pipe(
    ContextTypeAlertGroupRt.decode(comment),
    fold(throwErrors(Boom.badRequest), identity)
  );

  decodeComment(comment);
  const createdDate = new Date().toISOString();

  const myCase = await caseService.getCase({
    client: savedObjectsClient,
    id: caseId,
  });

  if (query.type === CommentType.alertGroup && myCase.attributes.type !== CaseType.parent) {
    throw Boom.badRequest('Sub case style alert comment cannot be added to an individual case');
  }

  const subCase = await getSubCase({
    caseService,
    savedObjectsClient,
    caseId,
    createdAt: createdDate,
  });

  const userDetails = {
    username: myCase.attributes.converted_by?.username,
    full_name: myCase.attributes.converted_by?.full_name,
    email: myCase.attributes.converted_by?.email,
  };

  const [newComment, updatedCase, updatedSubCase] = await Promise.all([
    // TODO: probably move this to the service layer
    caseService.postNewComment({
      client: savedObjectsClient,
      attributes: transformNewComment({
        associationType: AssociationType.subCase,
        createdDate,
        ...query,
        ...userDetails,
      }),
      references: [
        {
          type: CASE_SAVED_OBJECT,
          name: `associated-${CASE_SAVED_OBJECT}`,
          id: myCase.id,
        },
        {
          type: SUB_CASE_SAVED_OBJECT,
          name: `associated-${SUB_CASE_SAVED_OBJECT}`,
          id: subCase.id,
        },
      ],
    }),
    caseService.patchCase({
      client: savedObjectsClient,
      caseId,
      updatedAttributes: {
        updated_at: createdDate,
        updated_by: {
          ...userDetails,
        },
      },
      version: myCase.version,
    }),
    caseService.patchSubCase({
      client: savedObjectsClient,
      subCaseId: subCase.id,
      updatedAttributes: {
        updated_at: createdDate,
        updated_by: {
          ...userDetails,
        },
      },
      version: subCase.version,
    }),
  ]);

  if (
    (newComment.attributes.type === CommentType.alert ||
      newComment.attributes.type === CommentType.alertGroup) &&
    myCase.attributes.settings.syncAlerts
  ) {
    const ids = getAlertIds(query);
    caseClient.updateAlertsStatus({
      ids,
      status: myCase.attributes.status,
      indices: new Set([newComment.attributes.index]),
    });
  }

  const totalCommentsFindBySubCase = await caseService.getAllCaseComments({
    client: savedObjectsClient,
    id: subCase.id,
    options: {
      fields: [],
      page: 1,
      perPage: 1,
    },
  });

  const [comments] = await Promise.all([
    caseService.getAllCaseComments({
      client: savedObjectsClient,
      id: subCase.id,
      options: {
        fields: [],
        page: 1,
        perPage: totalCommentsFindBySubCase.total,
      },
    }),
    userActionService.postUserActions({
      client: savedObjectsClient,
      actions: [
        buildCommentUserActionItem({
          action: 'create',
          actionAt: createdDate,
          actionBy: { ...userDetails },
          caseId: subCase.id,
          commentId: newComment.id,
          fields: ['comment'],
          newValue: JSON.stringify(query),
        }),
      ],
    }),
  ]);

  return CollectWithSubCaseResponseRt.encode(
    flattenCommentableCaseSavedObject({
      totalAlerts: countAlerts(comments),
      comments: comments.saved_objects,
      combinedCase: new CommentableCase(
        {
          ...myCase,
          ...updatedCase,
          attributes: {
            ...myCase.attributes,
            ...updatedCase.attributes,
          },
          version: updatedCase.version ?? myCase.version,
          references: myCase.references,
        },
        {
          ...subCase,
          ...updatedSubCase,
          attributes: { ...subCase.attributes, ...updatedSubCase.attributes },
          version: updatedSubCase.version ?? subCase.version,
          references: subCase.references,
        }
      ),
    })
  );
};

async function getCombinedCase(
  service: CaseServiceSetup,
  client: SavedObjectsClientContract,
  id: string
): Promise<CommentableCase> {
  const [casePromise, subCasePromise] = await Promise.allSettled([
    service.getCase({
      client,
      id,
    }),
    service.getSubCase({
      client,
      id,
    }),
  ]);

  if (subCasePromise.status === 'fulfilled') {
    if (subCasePromise.value.references.length > 0) {
      const caseValue = await service.getCase({
        client,
        id: subCasePromise.value.references[0].id,
      });
      return new CommentableCase(caseValue, subCasePromise.value);
    } else {
      // TODO: throw a boom instead?
      throw Error('Sub case found without reference to collection');
    }
  }

  if (casePromise.status === 'rejected') {
    throw casePromise.reason;
  } else {
    return new CommentableCase(casePromise.value);
  }
}

interface AddCommentArgs {
  caseClient: CaseClientImpl;
  caseId: string;
  comment: CommentRequest;
  savedObjectsClient: SavedObjectsClientContract;
  caseService: CaseServiceSetup;
  userActionService: CaseUserActionServiceSetup;
  request: KibanaRequest;
}

export const addComment = async ({
  savedObjectsClient,
  caseService,
  userActionService,
  request,
  caseClient,
  caseId,
  comment,
}: AddCommentArgs): Promise<CollectionWithSubCaseResponse> => {
  const query = pipe(
    CommentRequestRt.decode(comment),
    fold(throwErrors(Boom.badRequest), identity)
  );

  if (isAlertGroupContext(comment)) {
    return caseClient.addAlertGroup(caseId, comment);
  }

  decodeComment(comment);
  const createdDate = new Date().toISOString();

  const combinedCase = await getCombinedCase(caseService, savedObjectsClient, caseId);

  // An alert cannot be attach to a closed case.
  if (query.type === CommentType.alert && combinedCase.status === CaseStatuses.closed) {
    throw Boom.badRequest('Alert cannot be attached to a closed case');
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { username, full_name, email } = await caseService.getUser({ request });

  const [newComment, updatedCase] = await Promise.all([
    caseService.postNewComment({
      client: savedObjectsClient,
      attributes: transformNewComment({
        associationType: AssociationType.case,
        createdDate,
        ...query,
        username,
        full_name,
        email,
      }),
      references: combinedCase.buildRefsToCase(),
    }),
    // This will return a full new CombinedCase object that has the updated and base fields
    // merged together so let's use the return value from now on
    combinedCase.update({
      service: caseService,
      soClient: savedObjectsClient,
      date: createdDate,
      user: { username, full_name, email },
    }),
  ]);

  if (newComment.attributes.type === CommentType.alert && updatedCase.settings.syncAlerts) {
    const ids = Array.isArray(newComment.attributes.alertId)
      ? newComment.attributes.alertId
      : [newComment.attributes.alertId];
    caseClient.updateAlertsStatus({
      ids,
      status: updatedCase.status,
      indices: new Set([newComment.attributes.index]),
    });
  }

  const totalCommentsFindByCases = await caseService.getAllCaseComments({
    client: savedObjectsClient,
    id: caseId,
    options: {
      fields: [],
      page: 1,
      perPage: 1,
    },
  });

  const [comments] = await Promise.all([
    caseService.getAllCaseComments({
      client: savedObjectsClient,
      id: caseId,
      options: {
        fields: [],
        page: 1,
        perPage: totalCommentsFindByCases.total,
      },
    }),
    userActionService.postUserActions({
      client: savedObjectsClient,
      actions: [
        buildCommentUserActionItem({
          action: 'create',
          actionAt: createdDate,
          actionBy: { username, full_name, email },
          caseId: updatedCase.id,
          commentId: newComment.id,
          fields: ['comment'],
          newValue: JSON.stringify(query),
        }),
      ],
    }),
  ]);

  return CollectWithSubCaseResponseRt.encode(
    flattenCommentableCaseSavedObject({
      combinedCase: updatedCase,
      comments: comments.saved_objects,
      totalAlerts: countAlerts(comments),
    })
  );
};
