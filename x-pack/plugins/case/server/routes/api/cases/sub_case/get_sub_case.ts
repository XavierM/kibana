/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { schema } from '@kbn/config-schema';

import { SubCaseResponseRt } from '../../../../../common/api';
import { RouteDeps } from '../../types';
import { flattenSubCaseSavedObject, wrapError } from '../../utils';
import { SUB_CASE_DETAILS_URL } from '../../../../../common/constants';

export function initGetSubCaseApi({ caseService, router }: RouteDeps) {
  router.get(
    {
      path: SUB_CASE_DETAILS_URL,
      validate: {
        params: schema.object({
          case_id: schema.string(),
          sub_case_id: schema.string(),
        }),
        query: schema.object({
          includeComments: schema.string({ defaultValue: 'true' }),
        }),
      },
    },
    async (context, request, response) => {
      try {
        const client = context.core.savedObjects.client;
        const includeComments = JSON.parse(request.query.includeComments);

        const subCase = await caseService.getSubCase({
          client,
          id: request.params.sub_case_id,
        });

        if (!includeComments) {
          return response.ok({
            body: SubCaseResponseRt.encode(
              flattenSubCaseSavedObject({
                savedObject: subCase,
              })
            ),
          });
        }

        const theComments = await caseService.getAllCaseComments({
          client,
          id: request.params.case_id,
          options: {
            sortField: 'created_at',
            sortOrder: 'asc',
          },
          subCaseID: request.params.sub_case_id,
        });

        return response.ok({
          body: SubCaseResponseRt.encode(
            flattenSubCaseSavedObject({
              savedObject: subCase,
              comments: theComments.saved_objects,
              totalComment: theComments.total,
            })
          ),
        });
      } catch (error) {
        return response.customError(wrapError(error));
      }
    }
  );
}
