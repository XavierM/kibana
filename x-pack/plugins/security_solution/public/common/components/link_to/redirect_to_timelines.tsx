/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { SecurityPageName } from '../../../app/types';

import { appendSearch } from './helpers';
import { RedirectWrapper } from './redirect_wrapper';
import { TimelineTypeLiteral, TimelineType } from '../../../../common/types/timeline';

export type TimelineComponentProps = RouteComponentProps<{
  tabName: TimelineTypeLiteral;
  search: string;
}>;

export const RedirectToTimelinesPage = ({
  match: {
    params: { tabName },
  },
  location: { search },
}: TimelineComponentProps) => (
  <RedirectWrapper
    to={
      tabName
        ? `/${SecurityPageName.timelines}/${tabName}${search}`
        : `/${SecurityPageName.timelines}/${TimelineType.default}${search}`
    }
  />
);

export const getTimelinesUrl = (search?: string) =>
  `#/link-to/${SecurityPageName.timelines}${appendSearch(search)}`;

export const getTimelineTabsUrl = (tabName: TimelineTypeLiteral, search?: string) =>
  `#/link-to/${SecurityPageName.timelines}/${tabName}${appendSearch(search)}`;
