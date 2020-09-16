/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getOr } from 'lodash/fp';
import React from 'react';
import { Query } from 'react-apollo';
import { connect, ConnectedProps } from 'react-redux';

import { GetKpiNetworkQuery, KpiNetworkData } from '../../../graphql/types';
import { inputsModel, inputsSelectors, State } from '../../../common/store';
import { createFilter, getDefaultFetchPolicy } from '../../../common/containers/helpers';
import { QueryTemplateProps } from '../../../common/containers/query_template';

import { kpiNetworkQuery } from './index.gql_query';

const ID = 'kpiNetworkQuery';

export interface KpiNetworkArgs {
  id: string;
  inspect: inputsModel.InspectQuery;
  kpiNetwork: KpiNetworkData;
  loading: boolean;
  refetch: inputsModel.Refetch;
}

export interface KpiNetworkProps extends QueryTemplateProps {
  children: (args: KpiNetworkArgs) => React.ReactNode;
}

const KpiNetworkComponentQuery = React.memo<KpiNetworkProps & PropsFromRedux>(
  ({
    id = ID,
    children,
    filterQuery,
    isInspected,
    indexNames,
    skip,
    sourceId,
    startDate,
    endDate,
  }) => (
    <Query<GetKpiNetworkQuery.Query, GetKpiNetworkQuery.Variables>
      query={kpiNetworkQuery}
      fetchPolicy={getDefaultFetchPolicy()}
      notifyOnNetworkStatusChange
      skip={skip}
      variables={{
        sourceId,
        timerange: {
          interval: '12h',
          from: startDate!,
          to: endDate!,
        },
        filterQuery: createFilter(filterQuery),
        defaultIndex: indexNames,
        inspect: isInspected,
      }}
    >
      {({ data, loading, refetch }) => {
        const kpiNetwork = getOr({}, `source.KpiNetwork`, data);
        return children({
          id,
          inspect: getOr(null, 'source.KpiNetwork.inspect', data),
          kpiNetwork,
          loading,
          refetch,
        });
      }}
    </Query>
  )
);

KpiNetworkComponentQuery.displayName = 'KpiNetworkComponentQuery';

const makeMapStateToProps = () => {
  const getQuery = inputsSelectors.globalQueryByIdSelector();
  const mapStateToProps = (state: State, { id = ID }: KpiNetworkProps) => {
    const { isInspected } = getQuery(state, id);
    return {
      isInspected,
    };
  };
  return mapStateToProps;
};

const connector = connect(makeMapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const KpiNetworkQuery = connector(KpiNetworkComponentQuery);
