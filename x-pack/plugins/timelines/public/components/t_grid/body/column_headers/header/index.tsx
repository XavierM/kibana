/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { ColumnHeaderOptions } from '../../../../../../../security_solution/common/types/timeline';
import { Sort } from '../../sort';
import { Actions } from '../actions';
import { getNewSortDirectionOnClick } from './helpers';
import { HeaderContent } from './header_content';
import { useManageTimeline } from '../../../../manage_timeline';
import { tGridActions } from '../../../../../store/t_grid';

interface Props {
  header: ColumnHeaderOptions;
  sort: Sort[];
  timelineId: string;
}

export const HeaderComponent: React.FC<Props> = ({ header, sort, timelineId }) => {
  const dispatch = useDispatch();

  const onColumnSort = useCallback(() => {
    const columnId = header.id;
    const columnType = header.type ?? 'text';
    const sortDirection = getNewSortDirectionOnClick({
      clickedHeader: header,
      currentSort: sort,
    });
    const headerIndex = sort.findIndex((col) => col.columnId === columnId);
    let newSort = [];
    if (headerIndex === -1) {
      newSort = [
        ...sort,
        {
          columnId,
          columnType,
          sortDirection,
        },
      ];
    } else {
      newSort = [
        ...sort.slice(0, headerIndex),
        {
          columnId,
          columnType,
          sortDirection,
        },
        ...sort.slice(headerIndex + 1),
      ];
    }
    dispatch(
      tGridActions.updateSort({
        id: timelineId,
        sort: newSort,
      })
    );
  }, [dispatch, header, sort, timelineId]);

  const onColumnRemoved = useCallback(
    (columnId) => dispatch(tGridActions.removeColumn({ id: timelineId, columnId })),
    [dispatch, timelineId]
  );

  const { getManageTimelineById } = useManageTimeline();

  const isLoading = useMemo(() => getManageTimelineById(timelineId).isLoading, [
    getManageTimelineById,
    timelineId,
  ]);
  const showSortingCapability = !(header.subType && header.subType.nested);

  return (
    <>
      <HeaderContent
        header={header}
        isLoading={isLoading}
        isResizing={false}
        onClick={onColumnSort}
        showSortingCapability={showSortingCapability}
        sort={sort}
      >
        <Actions
          header={header}
          isLoading={isLoading}
          onColumnRemoved={onColumnRemoved}
          sort={sort}
        />
      </HeaderContent>
    </>
  );
};

export const Header = React.memo(HeaderComponent);
