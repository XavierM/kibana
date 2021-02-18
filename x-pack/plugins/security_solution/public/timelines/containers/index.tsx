/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import deepEqual from 'fast-deep-equal';
import { isEmpty, noop } from 'lodash/fp';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ESQuery } from '../../../common/typed_json';
import { isCompleteResponse, isErrorResponse } from '../../../../../../src/plugins/data/public';
import { inputsModel, KueryFilterQueryKind } from '../../common/store';
import { useKibana } from '../../common/lib/kibana';
import { createFilter } from '../../common/containers/helpers';
import { DocValueFields } from '../../common/containers/query_template';
import { timelineActions } from '../../timelines/store/timeline';
import { detectionsTimelineIds, skipQueryForDetectionsPage } from './helpers';
import { getInspectResponse } from '../../helpers';
import {
  Direction,
  PaginationInputPaginated,
  TimelineEventsQueries,
  TimelineEventsAllStrategyResponse,
  TimelineEventsAllRequestOptions,
  TimelineEdges,
  TimelineItem,
  TimelineRequestSortField,
} from '../../../common/search_strategy';
import { InspectResponse } from '../../types';
import * as i18n from './translations';
import { TimelineId } from '../../../common/types/timeline';
import { useRouteSpy } from '../../common/utils/route/use_route_spy';
import { activeTimeline } from './active_timeline_context';
import {
  EqlOptionsSelected,
  TimelineEqlRequestOptions,
  TimelineEqlResponse,
} from '../../../common/search_strategy/timeline/events/eql';

export interface TimelineArgs {
  events: TimelineItem[];
  id: string;
  inspect: InspectResponse;
  loadPage: LoadPage;
  pageInfo: Pick<PaginationInputPaginated, 'activePage' | 'querySize'>;
  refetch: inputsModel.Refetch;
  totalCount: number;
  updatedAt: number;
}

type LoadPage = (newActivePage: number) => void;

type TimelineRequest<T extends KueryFilterQueryKind> = T extends 'kuery'
  ? TimelineEventsAllRequestOptions
  : T extends 'lucene'
  ? TimelineEventsAllRequestOptions
  : T extends 'eql'
  ? TimelineEqlRequestOptions
  : TimelineEventsAllRequestOptions;

type TimelineResponse<T extends KueryFilterQueryKind> = T extends 'kuery'
  ? TimelineEventsAllStrategyResponse
  : T extends 'lucene'
  ? TimelineEventsAllStrategyResponse
  : T extends 'eql'
  ? TimelineEqlResponse
  : TimelineEventsAllStrategyResponse;

export interface UseTimelineEventsProps {
  docValueFields?: DocValueFields[];
  filterQuery?: ESQuery | string;
  skip?: boolean;
  endDate: string;
  eqlOptions?: EqlOptionsSelected;
  id: string;
  fields: string[];
  indexNames: string[];
  language?: KueryFilterQueryKind;
  limit: number;
  sort?: TimelineRequestSortField[];
  startDate: string;
  timerangeKind?: 'absolute' | 'relative';
}

const getTimelineEvents = (timelineEdges: TimelineEdges[]): TimelineItem[] =>
  timelineEdges.map((e: TimelineEdges) => e.node);

const ID = 'timelineEventsQuery';
export const initSortDefault = [
  {
    field: '@timestamp',
    direction: Direction.asc,
    type: 'number',
  },
];

export const useTimelineEvents = ({
  docValueFields,
  endDate,
  eqlOptions = undefined,
  id = ID,
  indexNames,
  fields,
  filterQuery,
  startDate,
  language = 'kuery',
  limit,
  sort = initSortDefault,
  skip = false,
  timerangeKind,
}: UseTimelineEventsProps): [boolean, TimelineArgs] => {
  const [{ pageName }] = useRouteSpy();
  const dispatch = useDispatch();
  const { data, notifications } = useKibana().services;
  const refetch = useRef<inputsModel.Refetch>(noop);
  const abortCtrl = useRef(new AbortController());
  const didCancel = useRef(false);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState(
    id === TimelineId.active ? activeTimeline.getActivePage() : 0
  );
  const [timelineRequest, setTimelineRequest] = useState<TimelineRequest<typeof language> | null>(
    null
  );
  const prevTimelineRequest = useRef<TimelineRequest<typeof language> | null>(null);

  const clearSignalsState = useCallback(() => {
    if (id != null && detectionsTimelineIds.some((timelineId) => timelineId === id)) {
      dispatch(timelineActions.clearEventsLoading({ id }));
      dispatch(timelineActions.clearEventsDeleted({ id }));
    }
  }, [dispatch, id]);

  const wrappedLoadPage = useCallback(
    (newActivePage: number) => {
      clearSignalsState();

      if (id === TimelineId.active) {
        activeTimeline.setExpandedDetail({});
        activeTimeline.setActivePage(newActivePage);
      }

      setActivePage(newActivePage);
    },
    [clearSignalsState, id]
  );

  const refetchGrid = useCallback(() => {
    if (refetch.current != null) {
      refetch.current();
    }
    wrappedLoadPage(0);
  }, [wrappedLoadPage]);

  const [timelineResponse, setTimelineResponse] = useState<TimelineArgs>({
    id,
    inspect: {
      dsl: [],
      response: [],
    },
    refetch: refetchGrid,
    totalCount: -1,
    pageInfo: {
      activePage: 0,
      querySize: 0,
    },
    events: [],
    loadPage: wrappedLoadPage,
    updatedAt: 0,
  });

  const timelineSearch = useCallback(
    (request: TimelineRequest<typeof language> | null) => {
      if (request == null || pageName === '' || skip) {
        return;
      }
      didCancel.current = false;
      const asyncSearch = async () => {
        prevTimelineRequest.current = request;
        abortCtrl.current = new AbortController();
        setLoading(true);
        const searchSubscription$ = data.search
          .search<TimelineRequest<typeof language>, TimelineResponse<typeof language>>(request, {
            strategy:
              request.language === 'eql'
                ? 'securitySolutionTimelineEqlSearchStrategy'
                : 'securitySolutionTimelineSearchStrategy',
            abortSignal: abortCtrl.current.signal,
          })
          .subscribe({
            next: (response) => {
              if (!didCancel.current) {
                if (isCompleteResponse(response)) {
                  setLoading(false);
                  setTimelineResponse((prevResponse) => {
                    const newTimelineResponse = {
                      ...prevResponse,
                      events: getTimelineEvents(response.edges),
                      inspect: getInspectResponse(response, prevResponse.inspect),
                      pageInfo: response.pageInfo,
                      totalCount: response.totalCount,
                      updatedAt: Date.now(),
                    };
                    if (id === TimelineId.active) {
                      activeTimeline.setExpandedDetail({});
                      activeTimeline.setPageName(pageName);
                      if (request.language === 'eql') {
                        activeTimeline.setEqlRequest(request as TimelineEqlRequestOptions);
                        activeTimeline.setEqlResponse(newTimelineResponse);
                      } else {
                        activeTimeline.setRequest(request);
                        activeTimeline.setResponse(newTimelineResponse);
                      }
                    }
                    return newTimelineResponse;
                  });
                  searchSubscription$.unsubscribe();
                } else if (isErrorResponse(response)) {
                  if (!didCancel.current) {
                    setLoading(false);
                    notifications.toasts.addWarning(i18n.ERROR_TIMELINE_EVENTS);
                  }
                  searchSubscription$.unsubscribe();
                }
              } else {
                searchSubscription$.unsubscribe();
              }
            },
            error: (msg) => {
              if (!didCancel.current) {
                setLoading(false);
                if (msg.message !== 'Aborted') {
                  notifications.toasts.addDanger({
                    title: i18n.FAIL_TIMELINE_EVENTS,
                    text: msg.message,
                  });
                }
              }
              searchSubscription$.unsubscribe();
            },
          });
      };

      if (
        id === TimelineId.active &&
        activeTimeline.getPageName() !== '' &&
        pageName !== activeTimeline.getPageName()
      ) {
        activeTimeline.setPageName(pageName);
        abortCtrl.current.abort();
        setLoading(false);

        if (request.language === 'eql') {
          prevTimelineRequest.current = activeTimeline.getEqlRequest();
          refetch.current = asyncSearch.bind(null, activeTimeline.getEqlRequest());
        } else {
          prevTimelineRequest.current = activeTimeline.getRequest();
          refetch.current = asyncSearch.bind(null, activeTimeline.getRequest());
        }

        setTimelineResponse((prevResp) => {
          const resp =
            request.language === 'eql'
              ? activeTimeline.getEqlResponse()
              : activeTimeline.getResponse();
          if (resp != null) {
            return {
              ...resp,
              refetch: refetchGrid,
              loadPage: wrappedLoadPage,
            };
          }
          return prevResp;
        });
        if (request.language !== 'eql' && activeTimeline.getResponse() != null) {
          return;
        } else if (request.language === 'eql' && activeTimeline.getEqlResponse() != null) {
          return;
        }
      }

      abortCtrl.current.abort();
      asyncSearch();
      refetch.current = asyncSearch;
    },
    [data.search, id, notifications.toasts, pageName, refetchGrid, skip, wrappedLoadPage]
  );

  useEffect(() => {
    if (skipQueryForDetectionsPage(id, indexNames) || indexNames.length === 0) {
      return;
    }

    setTimelineRequest((prevRequest) => {
      const prevEqlRequest = prevRequest as TimelineEqlRequestOptions;
      const prevSearchParameters = {
        defaultIndex: prevRequest?.defaultIndex ?? [],
        filterQuery: prevRequest?.filterQuery ?? '',
        querySize: prevRequest?.pagination.querySize ?? 0,
        sort: prevRequest?.sort ?? initSortDefault,
        timerange: prevRequest?.timerange ?? {},
        ...(prevEqlRequest?.eventCategoryField
          ? {
              eventCategoryField: prevEqlRequest?.eventCategoryField,
            }
          : {}),
        ...(prevEqlRequest?.size
          ? {
              size: prevEqlRequest?.size,
            }
          : {}),
        ...(prevEqlRequest?.tiebreakerField
          ? {
              tiebreakerField: prevEqlRequest?.tiebreakerField,
            }
          : {}),
        ...(prevEqlRequest?.timestampField
          ? {
              timestampField: prevEqlRequest?.timestampField,
            }
          : {}),
      };

      const currentSearchParameters = {
        defaultIndex: indexNames,
        filterQuery: createFilter(filterQuery),
        querySize: limit,
        sort,
        timerange: {
          interval: '12h',
          from: startDate,
          to: endDate,
        },
        ...(eqlOptions ? eqlOptions : {}),
      };

      const newActivePage = deepEqual(prevSearchParameters, currentSearchParameters)
        ? activePage
        : 0;

      const currentRequest = {
        defaultIndex: indexNames,
        docValueFields: docValueFields ?? [],
        factoryQueryType: TimelineEventsQueries.all,
        fieldRequested: fields,
        fields: [],
        filterQuery: createFilter(filterQuery),
        pagination: {
          activePage: newActivePage,
          querySize: limit,
        },
        language,
        sort,
        timerange: {
          interval: '12h',
          from: startDate,
          to: endDate,
        },
        ...(eqlOptions ? eqlOptions : {}),
      };

      if (activePage !== newActivePage) {
        setActivePage(newActivePage);
        if (id === TimelineId.active) {
          activeTimeline.setActivePage(newActivePage);
        }
      }
      if (!skipQueryForDetectionsPage(id, indexNames) && !deepEqual(prevRequest, currentRequest)) {
        return currentRequest;
      }
      return prevRequest;
    });
  }, [
    dispatch,
    indexNames,
    activePage,
    docValueFields,
    endDate,
    eqlOptions,
    filterQuery,
    id,
    language,
    limit,
    startDate,
    sort,
    fields,
  ]);

  useEffect(() => {
    if (
      id !== TimelineId.active ||
      timerangeKind === 'absolute' ||
      !deepEqual(prevTimelineRequest.current, timelineRequest)
    ) {
      timelineSearch(timelineRequest);
    }
    return () => {
      didCancel.current = true;
      abortCtrl.current.abort();
    };
  }, [id, timelineRequest, timelineSearch, timerangeKind]);

  /*
    cleanup timeline events response when the filters were removed completely
    to avoid displaying previous query results
  */
  useEffect(() => {
    if (isEmpty(filterQuery)) {
      setTimelineResponse({
        id,
        inspect: {
          dsl: [],
          response: [],
        },
        refetch: refetchGrid,
        totalCount: -1,
        pageInfo: {
          activePage: 0,
          querySize: 0,
        },
        events: [],
        loadPage: wrappedLoadPage,
        updatedAt: 0,
      });
    }
  }, [filterQuery, id, refetchGrid, wrappedLoadPage]);

  return [loading, timelineResponse];
};
