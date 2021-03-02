/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { CaseStatuses } from '../../../../case/common/api';
import { DEFAULT_TABLE_ACTIVE_PAGE, DEFAULT_TABLE_LIMIT } from './constants';
import { AllCases, SortFieldCase, FilterOptions, QueryParams, Case, UpdateByKey } from './types';
import { errorToToaster, useStateToaster } from '../../common/components/toasters';
import * as i18n from './translations';
import { getCases, patchCase } from './api';

export interface UseGetCasesState {
  data: AllCases;
  filterOptions: FilterOptions;
  isError: boolean;
  loading: string[];
  queryParams: QueryParams;
  selectedCases: Case[];
}

export interface UpdateCase extends Omit<UpdateByKey, 'caseData'> {
  caseId: string;
  version: string;
  refetchCasesStatus: () => void;
}

export type Action =
  | { type: 'FETCH_INIT'; payload: string }
  | {
      type: 'FETCH_CASES_SUCCESS';
      payload: AllCases;
    }
  | { type: 'FETCH_FAILURE'; payload: string }
  | { type: 'FETCH_UPDATE_CASE_SUCCESS' }
  | { type: 'UPDATE_FILTER_OPTIONS'; payload: Partial<FilterOptions> }
  | { type: 'UPDATE_QUERY_PARAMS'; payload: Partial<QueryParams> }
  | { type: 'UPDATE_TABLE_SELECTIONS'; payload: Case[] };

const dataFetchReducer = (state: UseGetCasesState, action: Action): UseGetCasesState => {
  switch (action.type) {
    case 'FETCH_INIT':
      return {
        ...state,
        isError: false,
        loading: [...state.loading.filter((e) => e !== action.payload), action.payload],
      };
    case 'FETCH_UPDATE_CASE_SUCCESS':
      return {
        ...state,
        loading: state.loading.filter((e) => e !== 'caseUpdate'),
      };
    case 'FETCH_CASES_SUCCESS':
      return {
        ...state,
        data: action.payload,
        isError: false,
        loading: state.loading.filter((e) => e !== 'cases'),
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        isError: true,
        loading: state.loading.filter((e) => e !== action.payload),
      };
    case 'UPDATE_FILTER_OPTIONS':
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          ...action.payload,
        },
      };
    case 'UPDATE_QUERY_PARAMS':
      return {
        ...state,
        queryParams: {
          ...state.queryParams,
          ...action.payload,
        },
      };
    case 'UPDATE_TABLE_SELECTIONS':
      return {
        ...state,
        selectedCases: action.payload,
      };
    default:
      return state;
  }
};

export const DEFAULT_FILTER_OPTIONS: FilterOptions = {
  search: '',
  reporters: [],
  status: CaseStatuses.open,
  tags: [],
  onlyCollectionType: false,
};

export const DEFAULT_QUERY_PARAMS: QueryParams = {
  page: DEFAULT_TABLE_ACTIVE_PAGE,
  perPage: DEFAULT_TABLE_LIMIT,
  sortField: SortFieldCase.createdAt,
  sortOrder: 'desc',
};

export const initialData: AllCases = {
  cases: [],
  countClosedCases: null,
  countInProgressCases: null,
  countOpenCases: null,
  page: 0,
  perPage: 0,
  total: 0,
};
export interface UseGetCases extends UseGetCasesState {
  dispatchUpdateCaseProperty: ({
    updateKey,
    updateValue,
    caseId,
    version,
    refetchCasesStatus,
  }: UpdateCase) => void;
  refetchCases: () => void;
  setFilters: (filters: Partial<FilterOptions>) => void;
  setQueryParams: (queryParams: Partial<QueryParams>) => void;
  setSelectedCases: (mySelectedCases: Case[]) => void;
}

export const useGetCases = (
  initialQueryParams?: QueryParams,
  initialFilterOptions?: FilterOptions
): UseGetCases => {
  const [state, dispatch] = useReducer(dataFetchReducer, {
    data: initialData,
    filterOptions: initialFilterOptions ?? DEFAULT_FILTER_OPTIONS,
    isError: false,
    loading: [],
    queryParams: initialQueryParams ?? DEFAULT_QUERY_PARAMS,
    selectedCases: [],
  });
  const [, dispatchToaster] = useStateToaster();
  const didCancelFetchCases = useRef(false);
  const didCancelUpdateCases = useRef(false);
  const abortCtrlFetchCases = useRef(new AbortController());
  const abortCtrlUpdateCases = useRef(new AbortController());

  const setSelectedCases = useCallback((mySelectedCases: Case[]) => {
    dispatch({ type: 'UPDATE_TABLE_SELECTIONS', payload: mySelectedCases });
  }, []);

  const setQueryParams = useCallback((newQueryParams: Partial<QueryParams>) => {
    dispatch({ type: 'UPDATE_QUERY_PARAMS', payload: newQueryParams });
  }, []);

  const setFilters = useCallback((newFilters: Partial<FilterOptions>) => {
    dispatch({ type: 'UPDATE_FILTER_OPTIONS', payload: newFilters });
  }, []);

  const fetchCases = useCallback(async (filterOptions: FilterOptions, queryParams: QueryParams) => {
    try {
      didCancelFetchCases.current = false;
      abortCtrlFetchCases.current.abort();
      abortCtrlFetchCases.current = new AbortController();
      dispatch({ type: 'FETCH_INIT', payload: 'cases' });

      const response = await getCases({
        filterOptions,
        queryParams,
        signal: abortCtrlFetchCases.current.signal,
      });

      if (!didCancelFetchCases.current) {
        dispatch({
          type: 'FETCH_CASES_SUCCESS',
          payload: response,
        });
      }
    } catch (error) {
      if (!didCancelFetchCases.current) {
        if (error.name !== 'AbortError') {
          errorToToaster({
            title: i18n.ERROR_TITLE,
            error: error.body && error.body.message ? new Error(error.body.message) : error,
            dispatchToaster,
          });
        }
        dispatch({ type: 'FETCH_FAILURE', payload: 'cases' });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dispatchUpdateCaseProperty = useCallback(
    async ({ updateKey, updateValue, caseId, refetchCasesStatus, version }: UpdateCase) => {
      try {
        didCancelUpdateCases.current = false;
        abortCtrlUpdateCases.current.abort();
        abortCtrlUpdateCases.current = new AbortController();
        dispatch({ type: 'FETCH_INIT', payload: 'caseUpdate' });

        await patchCase(
          caseId,
          { [updateKey]: updateValue },
          // saved object versions are typed as string | undefined, hope that's not true
          version ?? '',
          abortCtrlUpdateCases.current.signal
        );

        if (!didCancelUpdateCases.current) {
          dispatch({ type: 'FETCH_UPDATE_CASE_SUCCESS' });
          fetchCases(state.filterOptions, state.queryParams);
          refetchCasesStatus();
        }
      } catch (error) {
        if (!didCancelUpdateCases.current) {
          if (error.name !== 'AbortError') {
            errorToToaster({ title: i18n.ERROR_TITLE, error, dispatchToaster });
          }
          dispatch({ type: 'FETCH_FAILURE', payload: 'caseUpdate' });
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state.filterOptions, state.queryParams]
  );

  const refetchCases = useCallback(() => {
    fetchCases(state.filterOptions, state.queryParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.filterOptions, state.queryParams]);

  useEffect(() => {
    fetchCases(state.filterOptions, state.queryParams);
    return () => {
      didCancelFetchCases.current = true;
      didCancelUpdateCases.current = true;
      abortCtrlFetchCases.current.abort();
      abortCtrlUpdateCases.current.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.queryParams, state.filterOptions]);

  return {
    ...state,
    dispatchUpdateCaseProperty,
    refetchCases,
    setFilters,
    setQueryParams,
    setSelectedCases,
  };
};
