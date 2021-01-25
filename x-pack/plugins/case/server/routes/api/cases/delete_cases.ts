/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { schema } from '@kbn/config-schema';

import { SavedObjectsClientContract } from 'src/core/server';
import { CaseType } from '../../../../common/api';
import { buildCaseUserActionItem } from '../../../services/user_actions/helpers';
import { RouteDeps } from '../types';
import { wrapError } from '../utils';
import { CASES_URL } from '../../../../common/constants';
import { CaseServiceSetup } from '../../../services';

// TODO: move this to the service layer
async function unremovableCases({
  caseService,
  client,
  ids,
  force,
}: {
  caseService: CaseServiceSetup;
  client: SavedObjectsClientContract;
  ids: string[];
  force: boolean | undefined;
}): Promise<string[]> {
  // if the force flag was included then we can skip checking whether the cases are collections and go ahead
  // and delete them
  if (force) {
    return [];
  }

  const cases = await caseService.getCases({ caseIds: ids, client });
  const parentCases = cases.saved_objects.filter(
    (caseObj) => caseObj.attributes.type === CaseType.parent
  );

  return parentCases.map((parentCase) => parentCase.id);
}

// TODO: move this to the service layer
async function deleteSubCases({
  caseService,
  client,
  caseIds,
}: {
  caseService: CaseServiceSetup;
  client: SavedObjectsClientContract;
  caseIds: string[];
}) {
  const subCasesForCaseIds = await Promise.all(
    caseIds.map((id) => caseService.findSubCasesByCaseId(client, id))
  );

  const commentsForSubCases = await Promise.all(
    caseIds.map((id) => caseService.getAllCaseComments({ client, id }))
  );

  await Promise.all(
    commentsForSubCases
      .flatMap((comment) => comment.saved_objects)
      .map((commentSO) => caseService.deleteComment({ client, commentId: commentSO.id }))
  );

  await Promise.all(
    subCasesForCaseIds
      .flatMap((subCase) => subCase.saved_objects)
      .map((subCaseSO) => caseService.deleteSubCase(client, subCaseSO.id))
  );
}

export function initDeleteCasesApi({ caseService, router, userActionService }: RouteDeps) {
  router.delete(
    {
      path: CASES_URL,
      validate: {
        query: schema.object({
          ids: schema.arrayOf(schema.string()),
          force: schema.maybe(schema.boolean()),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.savedObjects.client;
        const unremovable = await unremovableCases({
          caseService,
          client,
          ids: request.query.ids,
          force: request.query.force,
        });

        if (unremovable.length > 0) {
          return response.badRequest({
            body: `Case IDs: [${unremovable.join(' ,')}] are not removable`,
          });
        }

        await Promise.all(
          request.query.ids.map((id) =>
            caseService.deleteCase({
              client,
              id,
            })
          )
        );
        const comments = await Promise.all(
          request.query.ids.map((id) =>
            caseService.getAllCaseComments({
              client,
              id,
            })
          )
        );

        if (comments.some((c) => c.saved_objects.length > 0)) {
          await Promise.all(
            comments.map((c) =>
              Promise.all(
                c.saved_objects.map(({ id }) =>
                  caseService.deleteComment({
                    client,
                    commentId: id,
                  })
                )
              )
            )
          );
        }

        await deleteSubCases({ caseService, client, caseIds: request.query.ids });

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { username, full_name, email } = await caseService.getUser({ request, response });
        const deleteDate = new Date().toISOString();

        await userActionService.postUserActions({
          client,
          actions: request.query.ids.map((id) =>
            buildCaseUserActionItem({
              action: 'create',
              actionAt: deleteDate,
              actionBy: { username, full_name, email },
              caseId: id,
              fields: ['comment', 'description', 'status', 'tags', 'title'],
            })
          ),
        });

        return response.noContent();
      } catch (error) {
        return response.customError(wrapError(error));
      }
    }
  );
}
