/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useCallback, useMemo } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import deepEqual from 'fast-deep-equal';

import { networkActions } from '../../../../store/actions';
import {
  Direction,
  NetworkDnsEdges,
  NetworkDnsFields,
  NetworkDnsSortField,
} from '../../../../../graphql/types';
import { networkModel, networkSelectors, State } from '../../../../store';
import { Criteria, ItemsPerRow, PaginatedTable } from '../../../paginated_table';

import { getNetworkDnsColumns } from './columns';
import { IsPtrIncluded } from './is_ptr_included';
import * as i18n from './translations';

const tableType = networkModel.NetworkTableType.dns;

interface OwnProps {
  data: NetworkDnsEdges[];
  fakeTotalCount: number;
  id: string;
  isInspect: boolean;
  loading: boolean;
  loadPage: (newActivePage: number) => void;
  showMorePagesIndicator: boolean;
  totalCount: number;
  type: networkModel.NetworkType;
}

type NetworkDnsTableProps = OwnProps & PropsFromRedux;

const rowItems: ItemsPerRow[] = [
  {
    text: i18n.ROWS_5,
    numberOfRow: 5,
  },
  {
    text: i18n.ROWS_10,
    numberOfRow: 10,
  },
];

export const NetworkDnsTableComponent = React.memo<NetworkDnsTableProps>(
  ({
    activePage,
    data,
    fakeTotalCount,
    id,
    isInspect,
    isPtrIncluded,
    limit,
    loading,
    loadPage,
    showMorePagesIndicator,
    sort,
    totalCount,
    type,
    updateNetworkTable,
  }) => {
    const updateLimitPagination = useCallback(
      newLimit =>
        updateNetworkTable({
          networkType: type,
          tableType,
          updates: { limit: newLimit },
        }),
      [type, updateNetworkTable]
    );

    const updateActivePage = useCallback(
      newPage =>
        updateNetworkTable({
          networkType: type,
          tableType,
          updates: { activePage: newPage },
        }),
      [type, updateNetworkTable]
    );

    const onChange = useCallback(
      (criteria: Criteria) => {
        if (criteria.sort != null) {
          const newDnsSortField: NetworkDnsSortField = {
            field: criteria.sort.field.split('.')[1] as NetworkDnsFields,
            direction: criteria.sort.direction as Direction,
          };
          if (!deepEqual(newDnsSortField, sort)) {
            updateNetworkTable({
              networkType: type,
              tableType,
              updates: { sort: newDnsSortField },
            });
          }
        }
      },
      [sort, type, updateNetworkTable]
    );

    const onChangePtrIncluded = useCallback(
      () =>
        updateNetworkTable({
          networkType: type,
          tableType,
          updates: { isPtrIncluded: !isPtrIncluded },
        }),
      [type, updateNetworkTable, isPtrIncluded]
    );

    const columns = useMemo(() => getNetworkDnsColumns(), []);

    return (
      <PaginatedTable
        activePage={activePage}
        columns={columns}
        dataTestSubj={`table-${tableType}`}
        headerCount={totalCount}
        headerSupplement={
          <IsPtrIncluded isPtrIncluded={isPtrIncluded} onChange={onChangePtrIncluded} />
        }
        headerTitle={i18n.TOP_DNS_DOMAINS}
        headerTooltip={i18n.TOOLTIP}
        headerUnit={i18n.UNIT(totalCount)}
        id={id}
        itemsPerRow={rowItems}
        isInspect={isInspect}
        limit={limit}
        loading={loading}
        loadPage={loadPage}
        onChange={onChange}
        pageOfItems={data}
        showMorePagesIndicator={showMorePagesIndicator}
        sorting={{
          field: `node.${sort.field}`,
          direction: sort.direction,
        }}
        totalCount={fakeTotalCount}
        updateActivePage={updateActivePage}
        updateLimitPagination={updateLimitPagination}
      />
    );
  }
);

NetworkDnsTableComponent.displayName = 'NetworkDnsTableComponent';

const makeMapStateToProps = () => {
  const getNetworkDnsSelector = networkSelectors.dnsSelector();
  const mapStateToProps = (state: State) => getNetworkDnsSelector(state);
  return mapStateToProps;
};

const mapDispatchToProps = {
  updateNetworkTable: networkActions.updateNetworkTable,
};

const connector = connect(makeMapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const NetworkDnsTable = connector(NetworkDnsTableComponent);
