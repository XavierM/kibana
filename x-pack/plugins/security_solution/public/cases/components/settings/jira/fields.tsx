/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useEffect, useState, useMemo } from 'react';
import { map } from 'lodash/fp';
import {
  EuiFormRow,
  EuiSelectOption,
  EuiSelect,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';

import { JiraFieldsType } from '../../../../../../case/common/api/connectors';
import { useKibana } from '../../../../common/lib/kibana';
import { SettingFieldsProps } from '../types';
import { useGetIssueTypes } from './use_get_issue_types';
import { useGetFieldsByIssueType } from './use_get_fields_by_issue_type';
import { SearchIssues } from './search_issues';

const JiraSettingFieldsComponent: React.FunctionComponent<SettingFieldsProps<JiraFieldsType>> = ({
  fields,
  connector,
  onChange,
}) => {
  const { issueType = null, priority = null, parent = null } = fields || {};

  const [issueTypesSelectOptions, setIssueTypesSelectOptions] = useState<EuiSelectOption[]>([]);
  const [firstLoad, setFirstLoad] = useState(false);
  const [prioritiesSelectOptions, setPrioritiesSelectOptions] = useState<EuiSelectOption[]>([]);
  const { http, notifications } = useKibana().services;

  useEffect(() => {
    setFirstLoad(true);
    onChange({ issueType: null, priority: null, parent: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { isLoading: isLoadingIssueTypes, issueTypes } = useGetIssueTypes({
    http,
    toastNotifications: notifications.toasts,
    connector,
  });

  const { isLoading: isLoadingFields, fields: fieldsByIssueType } = useGetFieldsByIssueType({
    http,
    toastNotifications: notifications.toasts,
    connector,
    issueType,
  });

  const hasPriority = useMemo(
    () => Object.prototype.hasOwnProperty.call(fieldsByIssueType, 'priority'),
    [fieldsByIssueType]
  );

  const hasParent = useMemo(
    () => Object.prototype.hasOwnProperty.call(fieldsByIssueType, 'parent'),
    [fieldsByIssueType]
  );

  useEffect(() => {
    const options = issueTypes.map((type) => ({
      value: type.id ?? '',
      text: type.name ?? '',
    }));

    setIssueTypesSelectOptions(options);
  }, [issueTypes]);

  useEffect(() => {
    if (issueType != null && fieldsByIssueType != null) {
      const priorities = fieldsByIssueType.priority?.allowedValues ?? [];
      const options = map(
        (p) => ({
          value: p.name,
          text: p.name,
        }),
        priorities
      );
      setPrioritiesSelectOptions(options);
    }
  }, [fieldsByIssueType, issueType]);

  // Reset parameters when changing connector
  useEffect(() => {
    if (!firstLoad) {
      return;
    }

    setIssueTypesSelectOptions([]);
    onChange({ issueType: null, priority: null, parent: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector]);

  // Reset fieldsByIssueType when changing connector or issue type
  useEffect(() => {
    if (!firstLoad) {
      return;
    }

    setPrioritiesSelectOptions([]);
    onChange({ issueType, priority: null, parent: null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issueType]);

  // Set default issue type
  useEffect(() => {
    if (!issueType && issueTypesSelectOptions.length > 0) {
      onChange({ ...fields, issueType: issueTypesSelectOptions[0].value as string });
    }
  }, [issueTypes, issueType, issueTypesSelectOptions, onChange, fields]);

  return (
    <>
      <EuiFormRow
        fullWidth
        label={i18n.translate(
          'xpack.securitySolution.case.settings.jira.issueTypesSelectFieldLabel',
          {
            defaultMessage: 'Issue type',
          }
        )}
      >
        <EuiSelect
          fullWidth
          isLoading={isLoadingIssueTypes}
          disabled={isLoadingIssueTypes || isLoadingFields}
          data-test-subj="issueTypeSelect"
          options={issueTypesSelectOptions}
          value={issueType ?? ''}
          onChange={(e) => {
            onChange({ ...fields, issueType: e.target.value });
          }}
        />
      </EuiFormRow>
      <EuiSpacer size="m" />
      <>
        {hasParent && (
          <>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFormRow
                  fullWidth
                  label={i18n.translate(
                    'xpack.triggersActionsUI.components.builtinActionTypes.jira.parentIssueSearchLabel',
                    {
                      defaultMessage: 'Parent issue',
                    }
                  )}
                >
                  <SearchIssues
                    selectedValue={parent}
                    http={http}
                    toastNotifications={notifications.toasts}
                    actionConnector={connector}
                    onChange={(parentIssueKey) => {
                      onChange({ ...fields, parent: parentIssueKey });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
            <EuiSpacer size="m" />
          </>
        )}
        {hasPriority && (
          <>
            <EuiFlexGroup>
              <EuiFlexItem>
                <EuiFormRow
                  fullWidth
                  label={i18n.translate(
                    'xpack.securitySolution.case.settings.jira.prioritySelectFieldLabel',
                    {
                      defaultMessage: 'Priority',
                    }
                  )}
                >
                  <EuiSelect
                    fullWidth
                    isLoading={isLoadingFields}
                    disabled={isLoadingIssueTypes || isLoadingFields}
                    data-test-subj="prioritySelect"
                    options={prioritiesSelectOptions}
                    value={priority ?? ''}
                    hasNoInitialSelection
                    onChange={(e) => {
                      onChange({ ...fields, priority: e.target.value });
                    }}
                  />
                </EuiFormRow>
              </EuiFlexItem>
            </EuiFlexGroup>
          </>
        )}
      </>
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export { JiraSettingFieldsComponent as default };
