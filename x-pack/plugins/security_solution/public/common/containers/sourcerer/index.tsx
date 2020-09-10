/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import deepEqual from 'fast-deep-equal';
import isEqual from 'lodash/isEqual';
import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DEFAULT_INDEX_KEY, SecurityPageName } from '../../../../common/constants';
import { useUiSetting$ } from '../../lib/kibana';

import { sourcererActions, sourcererModel, sourcererSelectors } from '../../store/sourcerer';
import { useRouteSpy } from '../../utils/route/use_route_spy';
import { KibanaIndexPatterns, ManageScope, SourcererScopeName } from '../../store/sourcerer/model';
import { useIndexFields } from '../source';
import { State } from '../../store';

export const dedupeIndexName = (kibanaIndex: string[], configIndex: string[]) => {
  return [
    ...configIndex.filter((ci) =>
      kibanaIndex.reduce<boolean>((acc, kip) => {
        if (kip.includes(ci) || ci.includes(kip)) {
          return false;
        }
        return acc;
      }, true)
    ),
    ...kibanaIndex,
  ];
};

export const getSourcererScopeName = (pageName: string): sourcererModel.SourcererScopeName => {
  switch (pageName) {
    case SecurityPageName.detections:
    case SecurityPageName.overview:
    case SecurityPageName.hosts:
    case SecurityPageName.network:
    case SecurityPageName.timelines:
    case SecurityPageName.case:
    case SecurityPageName.administration:
      return sourcererModel.SourcererScopeName.default;
    default:
      return sourcererModel.SourcererScopeName.default;
  }
};

export const useInitSourcerer = () => {
  const dispatch = useDispatch();
  const [{ pageName }] = useRouteSpy();
  const [configIndex] = useUiSetting$<string[]>(DEFAULT_INDEX_KEY);
  const getkibanaIndexPatternsSelector = useMemo(() => sourcererSelectors.kibanaIndexPatternsSelector(), []);
  const kibanaIndexPatterns = useSelector(getkibanaIndexPatternsSelector, isEqual);
  useIndexFields(getSourcererScopeName(pageName));

  const setIndexPatternsList = useCallback(
    (kibanaIndexPatternsToPersist: KibanaIndexPatterns, allIndexPatternsToPersist: string[]) => {
      dispatch(
        sourcererActions.setIndexPatternsList({
          kibanaIndexPatterns: kibanaIndexPatternsToPersist,
          allIndexPatterns: allIndexPatternsToPersist,
        })
      );
    },
    [dispatch]
  );

  useEffect(() => {
    const allIndexPatterns = dedupeIndexName(
      kibanaIndexPatterns.map((kip) => kip.title),
      configIndex
    );
    setIndexPatternsList(kibanaIndexPatterns, allIndexPatterns);
  }, [configIndex, kibanaIndexPatterns, setIndexPatternsList]);
};

export const useSourcererScope = (scope: SourcererScopeName = SourcererScopeName.default) => {
  const sourcererScopeSelector = useMemo(() => sourcererSelectors.getSourcererScopeSelector(), []);
  const SourcererScope = useSelector<State, ManageScope>(
    (state) => sourcererScopeSelector(state, scope),
    deepEqual
  );
  return SourcererScope;
};
