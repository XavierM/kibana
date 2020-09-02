/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { TimelineId } from '../../../../../common/types/timeline';
import { TimelineNonEcsData, Ecs } from '../../../../../public/graphql/types';
import { timelineActions } from '../../../../timelines/store/timeline';
import { useApolloClient } from '../../../../common/utils/apollo_context';
import { sendAlertToTimelineAction } from '../actions';
import { dispatchUpdateTimeline } from '../../../../timelines/components/open_timeline/helpers';
import { ActionIconItem } from '../../../../timelines/components/timeline/body/actions/action_icon_item';

import { CreateTimelineProps } from '../types';
import {
  ACTION_INVESTIGATE_IN_TIMELINE,
  ACTION_INVESTIGATE_IN_TIMELINE_ARIA_LABEL,
} from '../translations';

interface InvestigateInTimelineActionProps {
  ecsRowData: Ecs;
  nonEcsRowData: TimelineNonEcsData[];
}

const InvestigateInTimelineActionComponent: React.FC<InvestigateInTimelineActionProps> = ({
  ecsRowData,
  nonEcsRowData,
}) => {
  const dispatch = useDispatch();
  const apolloClient = useApolloClient();

  const updateTimelineIsLoading = useCallback(
    (payload) => dispatch(timelineActions.updateIsLoading(payload)),
    [dispatch]
  );

  const createTimeline = useCallback(
    ({ from: fromTimeline, timeline, to: toTimeline, ruleNote }: CreateTimelineProps) => {
      updateTimelineIsLoading({ id: TimelineId.active, isLoading: false });
      dispatchUpdateTimeline(dispatch)({
        duplicate: true,
        from: fromTimeline,
        id: TimelineId.active,
        notes: [],
        timeline: {
          ...timeline,
          show: true,
        },
        to: toTimeline,
        ruleNote,
      })();
    },
    [dispatch, updateTimelineIsLoading]
  );

  const investigateInTimelineAlertClick = useCallback(
    () =>
      sendAlertToTimelineAction({
        apolloClient,
        createTimeline,
        ecsData: ecsRowData,
        nonEcsData: nonEcsRowData,
        updateTimelineIsLoading,
      }),
    [apolloClient, createTimeline, ecsRowData, nonEcsRowData, updateTimelineIsLoading]
  );

  return (
    <ActionIconItem
      ariaLabel={ACTION_INVESTIGATE_IN_TIMELINE_ARIA_LABEL}
      content={ACTION_INVESTIGATE_IN_TIMELINE}
      dataTestSubj="send-alert-to-timeline"
      iconType="timeline"
      id="sendAlertToTimeline"
      onClick={investigateInTimelineAlertClick}
      isDisabled={false}
    />
  );
};

export const InvestigateInTimelineAction = React.memo(InvestigateInTimelineActionComponent);
