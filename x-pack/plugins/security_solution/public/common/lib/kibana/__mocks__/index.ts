/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { notificationServiceMock } from '../../../../../../../../src/core/public/mocks';
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
import { useDraggableKeyboardWrapper } from '../../../../../../timelines/public/components';
import {
  useAddToTimeline,
  useAddToTimelineSensor,
} from '../../../../../../timelines/public/hooks/use_add_to_timeline';
import {
  createKibanaContextProviderMock,
  createUseUiSettingMock,
  createUseUiSetting$Mock,
  createStartServicesMock,
  createWithKibanaMock,
} from '../kibana_react.mock';
const mockStartServicesMock = createStartServicesMock();
export const KibanaServices = { get: jest.fn(), getKibanaVersion: jest.fn(() => '8.0.0') };
export const useKibana = jest.fn().mockReturnValue({
  services: {
    ...mockStartServicesMock,
    data: {
      ...mockStartServicesMock.data,
      search: {
        ...mockStartServicesMock.data.search,
        search: jest.fn().mockImplementation(() => ({
          subscribe: jest.fn().mockImplementation(() => ({
            error: jest.fn(),
            next: jest.fn(),
            unsubscribe: jest.fn(),
          })),
        })),
      },
    },
    timelines: {
      // getTGrid
      getUseAddToTimeline: () => useAddToTimeline,
      getUseAddToTimelineSensor: () => useAddToTimelineSensor,
      getUseDraggableKeyboardWrapper: () => useDraggableKeyboardWrapper,
    },
  },
});
export const useUiSetting = jest.fn(createUseUiSettingMock());
export const useUiSetting$ = jest.fn(createUseUiSetting$Mock());
export const useHttp = jest.fn().mockReturnValue(createStartServicesMock().http);
export const useTimeZone = jest.fn();
export const useDateFormat = jest.fn();
export const useBasePath = jest.fn(() => '/test/base/path');
export const useToasts = jest
  .fn()
  .mockReturnValue(notificationServiceMock.createStartContract().toasts);
export const useCurrentUser = jest.fn();
export const withKibana = jest.fn(createWithKibanaMock());
export const KibanaContextProvider = jest.fn(createKibanaContextProviderMock());
export const useGetUserSavedObjectPermissions = jest.fn();
