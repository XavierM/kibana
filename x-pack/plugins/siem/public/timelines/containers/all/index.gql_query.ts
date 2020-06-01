/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import gql from 'graphql-tag';

export const allTimelinesQuery = gql`
  query GetAllTimeline(
    $pageInfo: PageInfoTimeline!
    $search: String
    $sort: SortTimeline
    $onlyUserFavorite: Boolean
    $timelineType: TimelineType
  ) {
    getAllTimeline(
      pageInfo: $pageInfo
      search: $search
      sort: $sort
      onlyUserFavorite: $onlyUserFavorite
      timelineType: $timelineType
    ) {
      totalCount
      timeline {
        savedObjectId
        description
        favorite {
          fullName
          userName
          favoriteDate
        }
        eventIdToNoteIds {
          eventId
          note
          timelineId
          noteId
          created
          createdBy
          timelineVersion
          updated
          updatedBy
          version
        }
        notes {
          eventId
          note
          timelineId
          timelineVersion
          noteId
          created
          createdBy
          updated
          updatedBy
          version
        }
        noteIds
        pinnedEventIds
        title
        status
        timelineType
        templateTimelineId
        templateTimelineVersion
        created
        createdBy
        updated
        updatedBy
        version
      }
    }
  }
`;
