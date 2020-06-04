/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiButtonEmpty, EuiHorizontalRule, EuiTitle } from '@elastic/eui';
import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { updateTimelineGraphEventId } from '../../../timelines/store/timeline/actions';

const OverlayContainer = styled.div<{ bodyHeight?: number }>`
  height: ${({ bodyHeight }) => (bodyHeight ? `${bodyHeight}px` : 'auto')};
  width: 100%;
`;

export const GraphOverlay = ({
  bodyHeight,
  graphEventId,
  timelineId,
}: {
  bodyHeight?: number;
  graphEventId?: string;
  timelineId: string;
}) => {
  const dispatch = useDispatch();
  const onCloseOverlay = useCallback(() => {
    dispatch(updateTimelineGraphEventId({ id: timelineId, graphEventId: '' }));
  }, [dispatch, timelineId]);

  return (
    <OverlayContainer bodyHeight={bodyHeight}>
      <EuiHorizontalRule margin="none" />
      <EuiButtonEmpty onClick={onCloseOverlay}>{'< Back to events'}</EuiButtonEmpty>
      <EuiHorizontalRule margin="none" />
      <EuiTitle>
        <>{`Resolver graph for event _id ${graphEventId}`}</>
      </EuiTitle>
    </OverlayContainer>
  );
};
