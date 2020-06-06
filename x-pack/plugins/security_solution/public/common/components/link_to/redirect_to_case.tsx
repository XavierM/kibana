/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { appendSearch } from './helpers';
import { RedirectWrapper } from './redirect_wrapper';
import { SecurityPageName } from '../../../app/types';

export type CaseComponentProps = RouteComponentProps<{
  detailName: string;
}>;

export const RedirectToCasePage = ({
  match: {
    params: { detailName },
  },
}: CaseComponentProps) => (
  <RedirectWrapper
    to={detailName ? `/${SecurityPageName.case}/${detailName}` : `/${SecurityPageName.case}`}
  />
);

export const RedirectToCreatePage = () => (
  <RedirectWrapper to={`/${SecurityPageName.case}/create`} />
);
export const RedirectToConfigureCasesPage = () => (
  <RedirectWrapper to={`/${SecurityPageName.case}/configure`} />
);

const baseCaseUrl = `#/link-to/${SecurityPageName.case}`;

export const getCaseUrl = (search: string | null) =>
  `${baseCaseUrl}${appendSearch(search ?? undefined)}`;

export const getCaseDetailsUrl = ({ id, search }: { id: string; search: string | null }) =>
  `${baseCaseUrl}/${encodeURIComponent(id)}${appendSearch(search ?? undefined)}`;

export const getCreateCaseUrl = (search: string | null) =>
  `${baseCaseUrl}/create${appendSearch(search ?? undefined)}`;

export const getConfigureCasesUrl = (search: string) =>
  `${baseCaseUrl}/configure${appendSearch(search ?? undefined)}`;
