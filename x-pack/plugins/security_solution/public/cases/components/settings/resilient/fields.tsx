/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { useEffect, useState } from 'react';
import {
  EuiFormRow,
  EuiComboBox,
  EuiSelect,
  EuiSpacer,
  EuiComboBoxOptionOption,
  EuiSelectOption,
} from '@elastic/eui';
import { i18n } from '@kbn/i18n';

import { useKibana } from '../../../../common/lib/kibana';
import { SettingFieldsProps } from '../types';
import { ResilientSettingFields } from './types';

import { useGetIncidentTypes } from './use_get_incident_types';
import { useGetSeverity } from './use_get_severity';

const ResilientSettingFieldsComponent: React.FunctionComponent<SettingFieldsProps<
  ResilientSettingFields
>> = ({ fields, connector, onChange }) => {
  const { incidentTypes, severityCode } = fields || {};

  const [firstLoad, setFirstLoad] = useState(false);
  const [incidentTypesComboBoxOptions, setIncidentTypesComboBoxOptions] = useState<
    Array<EuiComboBoxOptionOption<string>>
  >([]);

  const [selectedIncidentTypesComboBoxOptions, setSelectedIncidentTypesComboBoxOptions] = useState<
    Array<EuiComboBoxOptionOption<string>>
  >([]);

  const [severitySelectOptions, setSeveritySelectOptions] = useState<EuiSelectOption[]>([]);

  const { http, notifications } = useKibana().services;

  useEffect(() => {
    setFirstLoad(true);
  }, []);

  const {
    isLoading: isLoadingIncidentTypes,
    incidentTypes: allIncidentTypes,
  } = useGetIncidentTypes({
    http,
    toastNotifications: notifications.toasts,
    connector,
  });

  const { isLoading: isLoadingSeverity, severity } = useGetSeverity({
    http,
    toastNotifications: notifications.toasts,
    connector,
  });

  useEffect(() => {
    const options = severity.map((s) => ({
      value: s.id.toString(),
      text: s.name,
    }));

    setSeveritySelectOptions(options);
  }, [connector, severity]);

  // Reset parameters when changing connector
  useEffect(() => {
    if (!firstLoad) {
      return;
    }

    setIncidentTypesComboBoxOptions([]);
    setSelectedIncidentTypesComboBoxOptions([]);
    setSeveritySelectOptions([]);
    onChange('incidentTypes', null);
    onChange('severityCode', null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector]);

  useEffect(() => {
    setIncidentTypesComboBoxOptions(
      allIncidentTypes
        ? allIncidentTypes.map((type: { id: number; name: string }) => ({
            label: type.name,
            value: type.id.toString(),
          }))
        : []
    );

    const allIncidentTypesAsObject = allIncidentTypes.reduce(
      (acc, type) => ({ ...acc, [type.id.toString()]: type.name }),
      {} as Record<string, string>
    );

    setSelectedIncidentTypesComboBoxOptions(
      incidentTypes
        ? incidentTypes
            .map((type) => ({
              label: allIncidentTypesAsObject[type.toString()],
              value: type.toString(),
            }))
            .filter((type) => type.label != null)
        : []
    );
  }, [connector, allIncidentTypes, incidentTypes]);

  // Set default severity
  useEffect(() => {
    if (!severityCode && severitySelectOptions.length > 0) {
      onChange('severityCode', severitySelectOptions[0].value as string);
    }
  }, [severityCode, severitySelectOptions, onChange]);

  return (
    <>
      <EuiFormRow
        fullWidth
        label={i18n.translate(
          'xpack.securitySolution.case.settings.resilient.incidentComboBoxLabel',
          {
            defaultMessage: 'Incident Type',
          }
        )}
      >
        <EuiComboBox
          fullWidth
          isLoading={isLoadingIncidentTypes}
          isDisabled={isLoadingIncidentTypes}
          data-test-subj="incidentTypeComboBox"
          options={incidentTypesComboBoxOptions}
          selectedOptions={selectedIncidentTypesComboBoxOptions}
          onChange={(selectedOptions: Array<{ label: string; value?: string }>) => {
            setSelectedIncidentTypesComboBoxOptions(
              selectedOptions.map((selectedOption) => ({
                label: selectedOption.label,
                value: selectedOption.value,
              }))
            );

            onChange(
              'incidentTypes',
              selectedOptions.map((selectedOption) => selectedOption.value ?? selectedOption.label)
            );
          }}
          onBlur={() => {
            if (!incidentTypes) {
              onChange('incidentTypes', []);
            }
          }}
          isClearable={true}
        />
      </EuiFormRow>
      <EuiSpacer size="m" />
      <EuiFormRow
        fullWidth
        label={i18n.translate(
          'xpack.securitySolution.case.settings.resilient.severitySelectFieldLabel',
          {
            defaultMessage: 'Severity',
          }
        )}
      >
        <EuiSelect
          isLoading={isLoadingSeverity}
          disabled={isLoadingSeverity}
          fullWidth
          data-test-subj="severitySelect"
          options={severitySelectOptions}
          value={severityCode}
          onChange={(e) => {
            onChange('severityCode', e.target.value);
          }}
        />
      </EuiFormRow>
      <EuiSpacer size="m" />
    </>
  );
};

// eslint-disable-next-line import/no-default-export
export { ResilientSettingFieldsComponent as default };
