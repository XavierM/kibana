/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import {
  EuiButton,
  EuiButtonEmpty,
  EuiComboBox,
  EuiComboBoxOptionOption,
  EuiIcon,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPopover,
  EuiPopoverTitle,
  EuiSpacer,
  EuiText,
  EuiToolTip,
} from '@elastic/eui';
import deepEqual from 'fast-deep-equal';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import * as i18n from './translations';
import { SOURCERER_FEATURE_FLAG_ON } from '../../containers/sourcerer/constants';
import { sourcererActions, sourcererModel } from '../../store/sourcerer';
import { State } from '../../store';
import { getSourcererScopeSelector, SourcererScopeSelector } from './selectors';

const ResetButton = styled(EuiButtonEmpty)`
  width: fit-content;
`;
interface SourcererComponentProps {
  scope: sourcererModel.SourcererScopeName;
}

export const SourcererComponent = React.memo<SourcererComponentProps>(({ scope: scopeId }) => {
  const dispatch = useDispatch();
  const sourcererScopeSelector = useMemo(getSourcererScopeSelector, []);
  const { configIndexPatterns, kibanaIndexPatterns, sourcererScope } = useSelector<
    State,
    SourcererScopeSelector
  >((state) => sourcererScopeSelector(state, scopeId), deepEqual);
  const { selectedPatterns, loading } = sourcererScope;
  const [isPopoverOpen, setPopoverIsOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState<Array<EuiComboBoxOptionOption<string>>>(
    selectedPatterns.map((indexSelected) => ({
      label: indexSelected,
      value: indexSelected,
    }))
  );

  const setPopoverIsOpenCb = useCallback(() => setPopoverIsOpen((prevState) => !prevState), []);

  const onChangeIndexPattern = useCallback(
    (newSelectedPatterns: string[]) => {
      dispatch(
        sourcererActions.setSelectedIndexPatterns({
          id: scopeId,
          selectedPatterns: newSelectedPatterns,
        })
      );
    },
    [dispatch, scopeId]
  );

  const renderOption = useCallback(
    (option) => {
      const { value } = option;
      if (kibanaIndexPatterns.some((kip) => kip.title === value)) {
        return (
          <>
            <EuiIcon type="logoKibana" size="s" /> {value}
          </>
        );
      }
      return <>{value}</>;
    },
    [kibanaIndexPatterns]
  );

  const onChangeCombo = useCallback((newSelectedOptions) => {
    setSelectedOptions(newSelectedOptions);
  }, []);

  const resetDataSources = useCallback(() => {
    setSelectedOptions(
      configIndexPatterns.map((indexSelected) => ({
        label: indexSelected,
        value: indexSelected,
      }))
    );
  }, [configIndexPatterns]);

  const handleSaveIndices = useCallback(() => {
    onChangeIndexPattern(selectedOptions.map((so) => so.label));
    setPopoverIsOpen(false);
  }, [onChangeIndexPattern, selectedOptions]);

  const indexesPatternOptions = useMemo(
    () =>
      [...configIndexPatterns, ...kibanaIndexPatterns.map((kip) => kip.title)].reduce<
        Array<EuiComboBoxOptionOption<string>>
      >((acc, index) => {
        if (index != null && !acc.some((o) => o.label.includes(index))) {
          return [...acc, { label: index, value: index }];
        }
        return acc;
      }, []),
    [configIndexPatterns, kibanaIndexPatterns]
  );

  const trigger = useMemo(
    () => (
      <EuiButtonEmpty
        aria-label={i18n.SOURCERER}
        data-test-subj="sourcerer-trigger"
        flush="left"
        iconSide="right"
        iconType="arrowDown"
        isLoading={loading}
        onClick={setPopoverIsOpenCb}
        size="l"
        title={i18n.SOURCERER}
      >
        {i18n.SOURCERER}
      </EuiButtonEmpty>
    ),
    [setPopoverIsOpenCb, loading]
  );

  const comboBox = useMemo(
    () => (
      <EuiComboBox
        data-test-subj="indexPattern-switcher"
        placeholder="Pick index patterns"
        fullWidth
        options={indexesPatternOptions}
        selectedOptions={selectedOptions}
        onChange={debounce(onChangeCombo, 600, {
          leading: true,
          trailing: false,
        })}
        renderOption={renderOption}
      />
    ),
    [indexesPatternOptions, onChangeCombo, renderOption, selectedOptions]
  );

  useEffect(() => {
    const newSelecteOptions = selectedPatterns.map((indexSelected) => ({
      label: indexSelected,
      value: indexSelected,
    }));
    setSelectedOptions((prevSelectedOptions) => {
      if (!deepEqual(newSelecteOptions, prevSelectedOptions)) {
        return newSelecteOptions;
      }
      return prevSelectedOptions;
    });
  }, [selectedPatterns]);

  return (
    <EuiToolTip position="top" content={sourcererScope.selectedPatterns.sort().join(', ')}>
      <EuiPopover
        button={trigger}
        isOpen={isPopoverOpen}
        closePopover={() => setPopoverIsOpen(false)}
        display="block"
        panelPaddingSize="s"
        ownFocus
      >
        <div style={{ width: 600 }}>
          <EuiPopoverTitle>
            <>{i18n.SELECT_INDEX_PATTERNS}</>
          </EuiPopoverTitle>
          <EuiSpacer size="s" />
          <EuiText color="default">{i18n.INDEX_PATTERNS_SELECTION_LABEL}</EuiText>
          <EuiSpacer size="xs" />
          {comboBox}
          <EuiSpacer size="s" />
          <EuiFlexGroup alignItems="center" justifyContent="spaceBetween">
            <EuiFlexItem>
              <ResetButton
                aria-label={i18n.INDEX_PATTERNS_RESET}
                data-test-subj="sourcerer-reset"
                flush="left"
                onClick={resetDataSources}
                size="l"
                title={i18n.INDEX_PATTERNS_RESET}
              >
                {i18n.INDEX_PATTERNS_RESET}
              </ResetButton>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiButton
                onClick={handleSaveIndices}
                data-test-subj="add-index"
                fill
                fullWidth
                size="s"
              >
                {i18n.SAVE_INDEX_PATTERNS}
              </EuiButton>
            </EuiFlexItem>
          </EuiFlexGroup>
        </div>
      </EuiPopover>
    </EuiToolTip>
  );
});
SourcererComponent.displayName = 'Sourcerer';

export const Sourcerer = SOURCERER_FEATURE_FLAG_ON ? SourcererComponent : () => null;
