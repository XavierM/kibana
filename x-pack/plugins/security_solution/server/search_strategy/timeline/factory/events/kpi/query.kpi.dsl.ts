/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { isEmpty } from 'lodash/fp';

import {
  TimerangeFilter,
  TimerangeInput,
  TimelineRequestBasicOptions,
} from '../../../../../../common/search_strategy';
import { createQueryFilterClauses } from '../../../../../utils/build_query';

export const buildTimelineKpiQuery = ({
  defaultIndex,
  filterQuery,
  timerange,
}: TimelineRequestBasicOptions) => {
  const filterClause = [...createQueryFilterClauses(filterQuery)];

  const getTimerangeFilter = (timerangeOption: TimerangeInput | undefined): TimerangeFilter[] => {
    if (timerangeOption) {
      const { to, from } = timerangeOption;
      return !isEmpty(to) && !isEmpty(from)
        ? [
            {
              range: {
                '@timestamp': {
                  gte: from,
                  lte: to,
                  format: 'strict_date_optional_time',
                },
              },
            },
          ]
        : [];
    }
    return [];
  };

  const filter = [...filterClause, ...getTimerangeFilter(timerange), { match_all: {} }];

  const dslQuery = {
    allowNoIndices: true,
    index: defaultIndex,
    ignoreUnavailable: true,
    body: {
      aggs: {
        userCount: {
          cardinality: {
            field: 'user.id',
          },
        },
      },
      query: {
        bool: {
          filter,
        },
      },
      track_total_hits: true,
    },
  };

  return dslQuery;
};
