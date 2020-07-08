/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { TimelineType, TimelineStatus } from '../../../../common/types/timeline';

import { Direction } from '../../../graphql/types';
import { DEFAULT_TIMELINE_WIDTH } from '../../components/timeline/body/constants';
import { defaultHeaders } from '../../components/timeline/body/column_headers/default_headers';
import { SubsetTimelineModel, TimelineModel } from './model';

export const timelineDefaults: SubsetTimelineModel & Pick<TimelineModel, 'filters'> = {
  columns: defaultHeaders,
  dataProviders: [],
  deletedEventIds: [],
  description: '',
  eventType: 'all',
  eventIdToNoteIds: {},
  highlightedDropAndProviderId: '',
  historyIds: [],
  filters: [],
  isFavorite: false,
  isLive: false,
  isSelectAllChecked: false,
  isLoading: false,
  isSaving: false,
  itemsPerPage: 25,
  itemsPerPageOptions: [10, 25, 50, 100],
  kqlMode: 'filter',
  kqlQuery: {
    filterQuery: null,
    filterQueryDraft: null,
  },
  loadingEventIds: [],
  title: '',
  timelineType: TimelineType.default,
  templateTimelineId: null,
  templateTimelineVersion: null,
  noteIds: [],
  pinnedEventIds: {},
  pinnedEventsSaveObject: {},
  dateRange: {
    start: '2020-07-07T08:20:18.966Z',
    end: '2020-07-08T08:20:18.966Z',
  },
  savedObjectId: null,
  selectedEventIds: {},
  show: false,
  showCheckboxes: false,
  showRowRenderers: true,
  sort: {
    columnId: '@timestamp',
    sortDirection: Direction.desc,
  },
  status: TimelineStatus.draft,
  width: DEFAULT_TIMELINE_WIDTH,
  version: null,
};
