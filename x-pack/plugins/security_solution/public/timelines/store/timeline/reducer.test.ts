/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { set } from '@elastic/safer-lodash-set/fp';
import { cloneDeep } from 'lodash/fp';

import { TimelineType, TimelineStatus } from '../../../../common/types/timeline';

import {
  IS_OPERATOR,
  DataProvider,
  DataProviderType,
  DataProvidersAnd,
} from '../../../timelines/components/timeline/data_providers/data_provider';
import { defaultColumnHeaderType } from '../../../timelines/components/timeline/body/column_headers/default_headers';
import {
  DEFAULT_COLUMN_MIN_WIDTH,
  DEFAULT_TIMELINE_WIDTH,
} from '../../../timelines/components/timeline/body/constants';
import { getColumnWidthFromType } from '../../../timelines/components/timeline/body/column_headers/helpers';
import { Direction } from '../../../graphql/types';
import { defaultHeaders } from '../../../common/mock';

import {
  addNewTimeline,
  addTimelineProvider,
  addTimelineToStore,
  applyDeltaToTimelineColumnWidth,
  removeTimelineColumn,
  removeTimelineProvider,
  updateTimelineColumns,
  updateTimelineDescription,
  updateTimelineItemsPerPage,
  updateTimelinePerPageOptions,
  updateTimelineProviderEnabled,
  updateTimelineProviderExcluded,
  updateTimelineProviderType,
  updateTimelineProviders,
  updateTimelineRange,
  updateTimelineShowTimeline,
  updateTimelineSort,
  updateTimelineTitle,
  upsertTimelineColumn,
} from './helpers';
import { ColumnHeaderOptions, TimelineModel } from './model';
import { timelineDefaults } from './defaults';
import { TimelineById } from './types';

jest.mock('../../../common/components/url_state/normalize_time_range.ts');

const basicDataProvider: DataProvider = {
  and: [],
  id: '123',
  name: 'data provider 1',
  enabled: true,
  queryMatch: {
    field: '',
    value: '',
    operator: IS_OPERATOR,
  },
  excluded: false,
  kqlQuery: '',
};
const basicTimeline: TimelineModel = {
  columns: [],
  dataProviders: [basicDataProvider],
  dateRange: {
    start: '2020-07-07T08:20:18.966Z',
    end: '2020-07-08T08:20:18.966Z',
  },
  deletedEventIds: [],
  description: '',
  eventIdToNoteIds: {},
  excludedRowRendererIds: [],
  highlightedDropAndProviderId: '',
  historyIds: [],
  id: 'foo',
  indexNames: [],
  isFavorite: false,
  isLive: false,
  isLoading: false,
  isSaving: false,
  isSelectAllChecked: false,
  itemsPerPage: 25,
  itemsPerPageOptions: [10, 25, 50],
  kqlMode: 'filter',
  kqlQuery: { filterQuery: null, filterQueryDraft: null },
  loadingEventIds: [],
  noteIds: [],
  pinnedEventIds: {},
  pinnedEventsSaveObject: {},
  savedObjectId: null,
  selectedEventIds: {},
  show: true,
  showCheckboxes: false,
  sort: {
    columnId: '@timestamp',
    sortDirection: Direction.desc,
  },
  status: TimelineStatus.active,
  templateTimelineId: null,
  templateTimelineVersion: null,
  timelineType: TimelineType.default,
  title: '',
  version: null,
  width: DEFAULT_TIMELINE_WIDTH,
};
const timelineByIdMock: TimelineById = {
  foo: basicTimeline,
};

const timelineByIdTemplateMock: TimelineById = {
  foo: {
    ...basicTimeline,
    timelineType: TimelineType.template,
  },
};

const columnsMock: ColumnHeaderOptions[] = [
  defaultHeaders[0],
  defaultHeaders[1],
  defaultHeaders[2],
];

describe('Timeline', () => {
  describe('#add saved object Timeline to store ', () => {
    test('should return a timelineModel with default value and not just a timelineResult ', () => {
      const update = addTimelineToStore({
        id: 'foo',
        timeline: {
          ...basicTimeline,
        },
        timelineById: timelineByIdMock,
      });

      expect(update).toEqual({
        foo: {
          ...basicTimeline,
          show: true,
        },
      });
    });
  });

  describe('#addNewTimeline', () => {
    test('should return a new reference and not the same reference', () => {
      const update = addNewTimeline({
        id: 'bar',
        columns: defaultHeaders,
        timelineById: timelineByIdMock,
        timelineType: TimelineType.default,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should add a new timeline', () => {
      const update = addNewTimeline({
        id: 'bar',
        columns: timelineDefaults.columns,
        timelineById: timelineByIdMock,
        timelineType: TimelineType.default,
      });
      expect(update).toEqual({
        foo: basicTimeline,
        bar: set('id', 'bar', timelineDefaults),
      });
    });

    test('should add the specified columns to the timeline', () => {
      const barWithEmptyColumns = set('id', 'bar', timelineDefaults);
      const barWithPopulatedColumns = set('columns', defaultHeaders, barWithEmptyColumns);

      const update = addNewTimeline({
        id: 'bar',
        columns: defaultHeaders,
        timelineById: timelineByIdMock,
        timelineType: TimelineType.default,
      });
      expect(update).toEqual({
        foo: basicTimeline,
        bar: barWithPopulatedColumns,
      });
    });
  });

  describe('#updateTimelineShowTimeline', () => {
    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineShowTimeline({
        id: 'foo',
        show: false,
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should change show from true to false', () => {
      const update = updateTimelineShowTimeline({
        id: 'foo',
        show: false, // value we are changing from true to false
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.show', false, timelineByIdMock));
    });
  });

  describe('#upsertTimelineColumn', () => {
    let timelineById: TimelineById = {};
    let columns: ColumnHeaderOptions[] = [];
    let columnToAdd: ColumnHeaderOptions;

    beforeEach(() => {
      timelineById = cloneDeep(timelineByIdMock);
      columns = cloneDeep(columnsMock);
      columnToAdd = {
        category: 'event',
        columnHeaderType: defaultColumnHeaderType,
        description:
          'The action captured by the event.\nThis describes the information in the event. It is more specific than `event.category`. Examples are `group-add`, `process-started`, `file-created`. The value is normally defined by the implementer.',
        example: 'user-password-change',
        id: 'event.action',
        type: 'keyword',
        aggregatable: true,
        width: DEFAULT_COLUMN_MIN_WIDTH,
      };
    });

    test('should return a new reference and not the same reference', () => {
      const update = upsertTimelineColumn({
        column: columnToAdd,
        id: 'foo',
        index: 0,
        timelineById,
      });

      expect(update).not.toBe(timelineById);
    });

    test('should add a new column to an empty collection of columns', () => {
      const expectedColumns = [columnToAdd];
      const update = upsertTimelineColumn({
        column: columnToAdd,
        id: 'foo',
        index: 0,
        timelineById,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, timelineById));
    });

    test('should add a new column to an existing collection of columns at the beginning of the collection', () => {
      const expectedColumns = [columnToAdd, ...columns];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columnToAdd,
        id: 'foo',
        index: 0,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should add a new column to an existing collection of columns in the middle of the collection', () => {
      const expectedColumns = [columns[0], columnToAdd, columns[1], columns[2]];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columnToAdd,
        id: 'foo',
        index: 1,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should add a new column to an existing collection of columns at the end of the collection', () => {
      const expectedColumns = [...columns, columnToAdd];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columnToAdd,
        id: 'foo',
        index: expectedColumns.length - 1,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    columns.forEach((column, i) => {
      test(`should upsert (NOT add a new column) a column when already exists at the same index (${i})`, () => {
        const mockWithExistingColumns = set('foo.columns', columns, timelineById);

        const update = upsertTimelineColumn({
          column,
          id: 'foo',
          index: i,
          timelineById: mockWithExistingColumns,
        });

        expect(update).toEqual(set('foo.columns', columns, mockWithExistingColumns));
      });
    });

    test('should allow the 1st column to be moved to the 2nd column', () => {
      const expectedColumns = [columns[1], columns[0], columns[2]];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columns[0],
        id: 'foo',
        index: 1,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should allow the 1st column to be moved to the 3rd column', () => {
      const expectedColumns = [columns[1], columns[2], columns[0]];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columns[0],
        id: 'foo',
        index: 2,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should allow the 2nd column to be moved to the 1st column', () => {
      const expectedColumns = [columns[1], columns[0], columns[2]];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columns[1],
        id: 'foo',
        index: 0,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should allow the 2nd column to be moved to the 3rd column', () => {
      const expectedColumns = [columns[0], columns[2], columns[1]];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columns[1],
        id: 'foo',
        index: 2,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should allow the 3rd column to be moved to the 1st column', () => {
      const expectedColumns = [columns[2], columns[0], columns[1]];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columns[2],
        id: 'foo',
        index: 0,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should allow the 3rd column to be moved to the 2nd column', () => {
      const expectedColumns = [columns[0], columns[2], columns[1]];
      const mockWithExistingColumns = set('foo.columns', columns, timelineById);

      const update = upsertTimelineColumn({
        column: columns[2],
        id: 'foo',
        index: 1,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });
  });

  describe('#addTimelineProvider', () => {
    const providerToAdd: DataProvider = {
      ...basicDataProvider,
      id: '567',
      name: 'data provider 2',
    };
    test('should return a new reference and not the same reference', () => {
      const update = addTimelineProvider({
        id: 'foo',
        provider: providerToAdd,
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should add a new timeline provider', () => {
      const update = addTimelineProvider({
        id: 'foo',
        provider: providerToAdd,
        timelineById: timelineByIdMock,
      });
      const addedDataProvider = basicTimeline.dataProviders.concat(providerToAdd);
      expect(update).toEqual(set('foo.dataProviders', addedDataProvider, timelineByIdMock));
    });

    test('should NOT add a new timeline provider if it already exists and the attributes "and" is empty', () => {
      const update = addTimelineProvider({
        id: 'foo',
        provider: basicDataProvider,
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(timelineByIdMock);
    });

    test('should add a new timeline provider if it already exists and the attributes "and" is NOT empty', () => {
      const myMockTimelineByIdMock = cloneDeep(timelineByIdMock);
      myMockTimelineByIdMock.foo.dataProviders[0].and = [
        {
          ...basicDataProvider,
          id: '456',
          name: 'and data provider 1',
        },
      ];
      const update = addTimelineProvider({
        id: 'foo',
        provider: basicDataProvider,
        timelineById: myMockTimelineByIdMock,
      });
      expect(update).toEqual(
        set('foo.dataProviders[1]', basicDataProvider, myMockTimelineByIdMock)
      );
    });

    test('should UPSERT an existing timeline provider if it already exists', () => {
      const update = addTimelineProvider({
        id: 'foo',
        provider: {
          ...basicDataProvider,
          name: 'my name changed',
        },
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.dataProviders[0].name', 'my name changed', timelineByIdMock));
    });
  });

  describe('#removeTimelineColumn', () => {
    test('should return a new reference and not the same reference', () => {
      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = removeTimelineColumn({
        id: 'foo',
        columnId: columnsMock[0].id,
        timelineById: mockWithExistingColumns,
      });

      expect(update).not.toBe(timelineByIdMock);
    });

    test('should remove just the first column when the id matches', () => {
      const expectedColumns = [columnsMock[1], columnsMock[2]];

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = removeTimelineColumn({
        id: 'foo',
        columnId: columnsMock[0].id,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should remove just the last column when the id matches', () => {
      const expectedColumns = [columnsMock[0], columnsMock[1]];

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = removeTimelineColumn({
        id: 'foo',
        columnId: columnsMock[2].id,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should remove just the middle column when the id matches', () => {
      const expectedColumns = [columnsMock[0], columnsMock[2]];

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = removeTimelineColumn({
        id: 'foo',
        columnId: columnsMock[1].id,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should not modify the columns if the id to remove was not found', () => {
      const expectedColumns = cloneDeep(columnsMock);

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = removeTimelineColumn({
        id: 'foo',
        columnId: 'does.not.exist',
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });
  });

  describe('#applyDeltaToColumnWidth', () => {
    test('should return a new reference and not the same reference', () => {
      const delta = 50;
      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = applyDeltaToTimelineColumnWidth({
        id: 'foo',
        columnId: columnsMock[0].id,
        delta,
        timelineById: mockWithExistingColumns,
      });

      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update (just) the specified column of type `date` when the id matches, and the result of applying the delta is greater than the min width for a date column', () => {
      const aDateColumn = columnsMock[0];
      const delta = 50;
      const expectedToHaveNewWidth = {
        ...aDateColumn,
        width: getColumnWidthFromType(aDateColumn.type!) + delta,
      };
      const expectedColumns = [expectedToHaveNewWidth, columnsMock[1], columnsMock[2]];

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = applyDeltaToTimelineColumnWidth({
        id: 'foo',
        columnId: aDateColumn.id,
        delta,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should NOT update (just) the specified column of type `date` when the id matches, because the result of applying the delta is less than the min width for a date column', () => {
      const aDateColumn = columnsMock[0];
      const delta = -50; // this will be less than the min
      const expectedToHaveNewWidth = {
        ...aDateColumn,
        width: getColumnWidthFromType(aDateColumn.type!), // we expect the minimum
      };
      const expectedColumns = [expectedToHaveNewWidth, columnsMock[1], columnsMock[2]];

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = applyDeltaToTimelineColumnWidth({
        id: 'foo',
        columnId: aDateColumn.id,
        delta,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should update (just) the specified non-date column when the id matches, and the result of applying the delta is greater than the min width for the column', () => {
      const aNonDateColumn = columnsMock[1];
      const delta = 50;
      const expectedToHaveNewWidth = {
        ...aNonDateColumn,
        width: getColumnWidthFromType(aNonDateColumn.type!) + delta,
      };
      const expectedColumns = [columnsMock[0], expectedToHaveNewWidth, columnsMock[2]];

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = applyDeltaToTimelineColumnWidth({
        id: 'foo',
        columnId: aNonDateColumn.id,
        delta,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });

    test('should NOT update the specified non-date column when the id matches, because the result of applying the delta is less than the min width for the column', () => {
      const aNonDateColumn = columnsMock[1];
      const delta = -50;
      const expectedToHaveNewWidth = {
        ...aNonDateColumn,
        width: getColumnWidthFromType(aNonDateColumn.type!),
      };
      const expectedColumns = [columnsMock[0], expectedToHaveNewWidth, columnsMock[2]];

      // pre-populate a new mock with existing columns:
      const mockWithExistingColumns = set('foo.columns', columnsMock, timelineByIdMock);

      const update = applyDeltaToTimelineColumnWidth({
        id: 'foo',
        columnId: aNonDateColumn.id,
        delta,
        timelineById: mockWithExistingColumns,
      });

      expect(update).toEqual(set('foo.columns', expectedColumns, mockWithExistingColumns));
    });
  });

  describe('#addAndProviderToTimelineProvider', () => {
    test('should add a new and provider to an existing timeline provider', () => {
      const providerToAdd: DataProvider = {
        ...basicDataProvider,
        id: '567',
        name: 'data provider 2',
        queryMatch: {
          field: 'handsome',
          value: 'xavier',
          operator: IS_OPERATOR,
        },
      };

      const newTimeline = addTimelineProvider({
        id: 'foo',
        provider: providerToAdd,
        timelineById: timelineByIdMock,
      });

      newTimeline.foo.highlightedDropAndProviderId = '567';

      const andProviderToAdd: DataProvider = {
        ...basicDataProvider,
        id: '568',
        name: 'And Data Provider',
        queryMatch: {
          field: 'smart',
          value: 'steph',
          operator: IS_OPERATOR,
        },
      };

      const update = addTimelineProvider({
        id: 'foo',
        provider: andProviderToAdd,
        timelineById: newTimeline,
      });
      const indexProvider = update.foo.dataProviders.findIndex((i) => i.id === '567');
      const addedAndDataProvider = update.foo.dataProviders[indexProvider].and[0];
      const { and, ...expectedResult } = andProviderToAdd;
      expect(addedAndDataProvider).toEqual(expectedResult);
      newTimeline.foo.highlightedDropAndProviderId = '';
    });

    test('should add another and provider because it is not a duplicate', () => {
      const providerToAdd: DataProvider = {
        ...basicDataProvider,
        and: [
          {
            ...basicDataProvider,
            id: '568',
            name: 'And Data Provider',
            queryMatch: {
              field: 'smart',
              value: 'xavier',
              operator: IS_OPERATOR,
            },
          },
        ],
        id: '567',
        queryMatch: {
          field: 'handsome',
          value: 'steph',
          operator: IS_OPERATOR,
        },
      };

      const newTimeline = addTimelineProvider({
        id: 'foo',
        provider: providerToAdd,
        timelineById: timelineByIdMock,
      });

      newTimeline.foo.highlightedDropAndProviderId = '567';

      const andProviderToAdd: DataProvider = {
        ...basicDataProvider,
        id: '569',
        name: 'And Data Provider',
        queryMatch: {
          field: 'happy',
          value: 'andrewG',
          operator: IS_OPERATOR,
        },
      };
      // temporary, we will have to decouple DataProvider & DataProvidersAnd
      // that's bigger a refactor than just fixing a bug
      // @ts-expect-error
      delete andProviderToAdd.and;
      const update = addTimelineProvider({
        id: 'foo',
        provider: andProviderToAdd,
        timelineById: newTimeline,
      });

      expect(update).toEqual(set('foo.dataProviders[1].and[1]', andProviderToAdd, newTimeline));
      newTimeline.foo.highlightedDropAndProviderId = '';
    });

    test('should NOT add another and provider because it is a duplicate', () => {
      const providerToAdd: DataProvider = {
        ...basicDataProvider,
        and: [
          {
            ...basicDataProvider,
            id: '568',
            name: 'And Data Provider',
            queryMatch: {
              field: 'smart',
              value: 'xavier',
              operator: IS_OPERATOR,
            },
          },
        ],
        id: '567',
        queryMatch: {
          field: 'handsome',
          value: 'steph',
          operator: IS_OPERATOR,
        },
      };

      const newTimeline = addTimelineProvider({
        id: 'foo',
        provider: providerToAdd,
        timelineById: timelineByIdMock,
      });

      newTimeline.foo.highlightedDropAndProviderId = '567';

      const andProviderToAdd: DataProvider = {
        ...basicDataProvider,
        id: '569',
        name: 'And Data Provider',
        queryMatch: {
          field: 'smart',
          value: 'xavier',
          operator: IS_OPERATOR,
        },
      };
      const update = addTimelineProvider({
        id: 'foo',
        provider: andProviderToAdd,
        timelineById: newTimeline,
      });

      expect(update).toEqual(newTimeline);
      newTimeline.foo.highlightedDropAndProviderId = '';
    });
  });

  describe('#updateTimelineColumns', () => {
    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineColumns({
        id: 'foo',
        columns: columnsMock,
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update a timeline with new columns', () => {
      const update = updateTimelineColumns({
        id: 'foo',
        columns: columnsMock,
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.columns', [...columnsMock], timelineByIdMock));
    });
  });

  describe('#updateTimelineDescription', () => {
    const newDescription = 'a new description';

    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineDescription({
        id: 'foo',
        description: newDescription,
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update the timeline description', () => {
      const update = updateTimelineDescription({
        id: 'foo',
        description: newDescription,
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.description', newDescription, timelineByIdMock));
    });

    test('should always trim all leading whitespace and allow only one trailing space', () => {
      const update = updateTimelineDescription({
        id: 'foo',
        description: '      breathing room      ',
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.description', 'breathing room ', timelineByIdMock));
    });
  });

  describe('#updateTimelineTitle', () => {
    const newTitle = 'a new title';

    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineTitle({
        id: 'foo',
        title: newTitle,
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update the timeline title', () => {
      const update = updateTimelineTitle({
        id: 'foo',
        title: newTitle,
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.title', newTitle, timelineByIdMock));
    });

    test('should always trim all leading whitespace and allow only one trailing space', () => {
      const update = updateTimelineTitle({
        id: 'foo',
        title: '      room at the back      ',
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.title', 'room at the back ', timelineByIdMock));
    });
  });

  describe('#updateTimelineProviders', () => {
    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineProviders({
        id: 'foo',
        providers: [
          {
            ...basicDataProvider,
            id: '567',
            name: 'data provider 2',
          },
        ],
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should add update a timeline with new providers', () => {
      const providerToAdd: DataProvider = {
        ...basicDataProvider,
        id: '567',
        name: 'data provider 2',
      };
      const update = updateTimelineProviders({
        id: 'foo',
        providers: [providerToAdd],
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.dataProviders', [providerToAdd], timelineByIdMock));
    });
  });

  describe('#updateTimelineRange', () => {
    let update: TimelineById;
    beforeAll(() => {
      update = updateTimelineRange({
        id: 'foo',
        start: '2020-07-07T08:20:18.966Z',
        end: '2020-07-08T08:20:18.966Z',
        timelineById: timelineByIdMock,
      });
    });
    test('should return a new reference and not the same reference', () => {
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update the timeline range', () => {
      expect(update).toEqual(
        set(
          'foo.dateRange',
          {
            start: '2020-07-07T08:20:18.966Z',
            end: '2020-07-08T08:20:18.966Z',
          },
          timelineByIdMock
        )
      );
    });
  });

  describe('#updateTimelineSort', () => {
    let update: TimelineById;
    beforeAll(() => {
      update = updateTimelineSort({
        id: 'foo',
        sort: {
          columnId: 'some column',
          sortDirection: Direction.desc,
        },
        timelineById: timelineByIdMock,
      });
    });
    test('should return a new reference and not the same reference', () => {
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update the timeline range', () => {
      expect(update).toEqual(
        set(
          'foo.sort',
          { columnId: 'some column', sortDirection: Direction.desc },
          timelineByIdMock
        )
      );
    });
  });

  describe('#updateTimelineProviderEnabled', () => {
    let update: TimelineById = updateTimelineProviderEnabled({
      id: 'foo',
      providerId: '123',
      enabled: false, // value we are updating from true to false
      timelineById: timelineByIdMock,
    });
    test('should return a new reference and not the same reference', () => {
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should return a new reference for data provider and not the same reference of data provider', () => {
      expect(update.foo.dataProviders).not.toBe(basicTimeline.dataProviders);
    });

    test('should update the timeline provider enabled from true to false', () => {
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          dataProviders: [
            {
              ...basicDataProvider,
              enabled: false,
            },
          ],
        },
      };
      expect(update).toEqual(expected);
    });

    test('should update only one data provider and not two data providers', () => {
      const multiDataProvider = basicTimeline.dataProviders.concat({
        ...basicDataProvider,
        id: '456',
      });
      const multiDataProviderMock = {
        ...timelineByIdMock,
        foo: {
          ...timelineByIdMock.foo,
          dataProviders: multiDataProvider,
        },
      };
      update = updateTimelineProviderEnabled({
        id: 'foo',
        providerId: '123',
        enabled: false, // value we are updating from true to false
        timelineById: multiDataProviderMock,
      });
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          dataProviders: [
            {
              ...basicDataProvider,
              enabled: false,
            },
            {
              ...basicDataProvider,
              id: '456',
            },
          ],
        },
      };
      console.log('expected', expected.foo.dataProviders[0]);
      expect(update).toEqual(expected);
    });
  });

  describe('#updateTimelineAndProviderEnabled', () => {
    let timelineByIdwithAndMock: TimelineById = timelineByIdMock;
    let update: TimelineById;
    beforeEach(() => {
      const providerToAdd: DataProvider = {
        ...basicDataProvider,
        and: [
          {
            ...basicDataProvider,
            id: '568',
            name: 'And Data Provider',
          },
        ],
        id: '567',
      };

      timelineByIdwithAndMock = addTimelineProvider({
        id: 'foo',
        provider: providerToAdd,
        timelineById: timelineByIdMock,
      });

      update = updateTimelineProviderEnabled({
        id: 'foo',
        providerId: '567',
        enabled: false, // value we are updating from true to false
        timelineById: timelineByIdwithAndMock,
        andProviderId: '568',
      });
    });

    test('should return a new reference and not the same reference', () => {
      expect(update).not.toBe(timelineByIdwithAndMock);
    });

    test('should return a new reference for and data provider and not the same reference of data and provider', () => {
      expect(update.foo.dataProviders).not.toBe(basicTimeline.dataProviders);
    });

    test('should update the timeline and provider enabled from true to false', () => {
      const indexProvider = update.foo.dataProviders.findIndex((i) => i.id === '567');
      expect(update.foo.dataProviders[indexProvider].and[0].enabled).toEqual(false);
    });

    test('should update only one and data provider and not two and data providers', () => {
      const indexProvider = timelineByIdwithAndMock.foo.dataProviders.findIndex(
        (i) => i.id === '567'
      );
      const multiAndDataProvider = timelineByIdwithAndMock.foo.dataProviders[
        indexProvider
      ].and.concat({
        id: '456',
        name: 'new and data provider',
        enabled: true,
        queryMatch: {
          field: '',
          value: '',
          operator: IS_OPERATOR,
        },

        excluded: false,
        kqlQuery: '',
      });
      const multiAndDataProviderMock = set(
        `foo.dataProviders[${indexProvider}].and`,
        multiAndDataProvider,
        timelineByIdwithAndMock
      );
      update = updateTimelineProviderEnabled({
        id: 'foo',
        providerId: '567',
        enabled: false, // value we are updating from true to false
        timelineById: multiAndDataProviderMock,
        andProviderId: '568',
      });
      const oldAndProvider = update.foo.dataProviders[indexProvider].and.find(
        (i) => i.id === '568'
      );
      const newAndProvider = update.foo.dataProviders[indexProvider].and.find(
        (i) => i.id === '456'
      );
      expect(oldAndProvider!.enabled).toEqual(false);
      expect(newAndProvider!.enabled).toEqual(true);
    });
  });

  describe('#updateTimelineProviderExcluded', () => {
    let update: TimelineById;
    beforeAll(() => {
      update = updateTimelineProviderExcluded({
        id: 'foo',
        providerId: '123',
        excluded: true, // value we are updating from false to true
        timelineById: timelineByIdMock,
      });
    });
    test('should return a new reference and not the same reference', () => {
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should return a new reference for data provider and not the same reference of data provider', () => {
      expect(update.foo.dataProviders).not.toBe(basicTimeline.dataProviders);
    });

    test('should update the timeline provider excluded from true to false', () => {
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          dataProviders: [
            {
              ...basicDataProvider,
              excluded: true,
            },
          ],
        },
      };
      expect(update).toEqual(expected);
    });

    test('should update only one data provider and not two data providers', () => {
      const multiDataProvider = basicTimeline.dataProviders.concat({
        ...basicDataProvider,
        id: '456',
      });
      const multiDataProviderMock = {
        ...timelineByIdMock,
        foo: {
          ...timelineByIdMock.foo,
          dataProviders: multiDataProvider,
        },
      };
      update = updateTimelineProviderExcluded({
        id: 'foo',
        providerId: '123',
        excluded: true, // value we are updating from false to true
        timelineById: multiDataProviderMock,
      });
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          dataProviders: [
            {
              ...basicDataProvider,
              excluded: true, // value we are updating from false to true
            },
            {
              ...basicDataProvider,
              id: '456',
            },
          ],
        },
      };
      expect(update).toEqual(expected);
    });
  });

  describe('#updateTimelineProviderType', () => {
    test('should return the same reference if run on timelineType default', () => {
      const update = updateTimelineProviderType({
        id: 'foo',
        providerId: '123',
        type: DataProviderType.template, // value we are updating from default to template
        timelineById: timelineByIdMock,
      });
      expect(update).toBe(timelineByIdMock);
    });

    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineProviderType({
        id: 'foo',
        providerId: '123',
        type: DataProviderType.template, // value we are updating from default to template
        timelineById: timelineByIdTemplateMock,
      });
      expect(update).not.toBe(timelineByIdTemplateMock);
    });

    test('should return a new reference for data provider and not the same reference of data provider', () => {
      const update = updateTimelineProviderType({
        id: 'foo',
        providerId: '123',
        type: DataProviderType.template, // value we are updating from default to template
        timelineById: timelineByIdTemplateMock,
      });
      expect(update.foo.dataProviders).not.toBe(timelineByIdTemplateMock.foo.dataProviders);
    });

    test('should update the timeline provider type from default to template', () => {
      const update = updateTimelineProviderType({
        id: 'foo',
        providerId: '123',
        type: DataProviderType.template,
        timelineById: timelineByIdTemplateMock,
      });
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          dataProviders: [
            {
              ...basicDataProvider,
              name: '',
              queryMatch: {
                field: '',
                value: '{}',
                operator: IS_OPERATOR,
              },
              type: DataProviderType.template,
            },
          ],
          timelineType: TimelineType.template,
        },
      };

      expect(update).toEqual(expected);
    });

    test('should update only one data provider and not two data providers', () => {
      const multiDataProvider = timelineByIdTemplateMock.foo.dataProviders.concat({
        ...basicDataProvider,
        id: '456',
        queryMatch: {
          field: '',
          value: '',
          operator: IS_OPERATOR,
        },
        type: DataProviderType.template,
      });
      const multiDataProviderMock = set(
        'foo.dataProviders',
        multiDataProvider,
        timelineByIdTemplateMock
      );
      const update = updateTimelineProviderType({
        id: 'foo',
        providerId: '123',
        type: DataProviderType.template, // value we are updating from default to template
        timelineById: multiDataProviderMock,
      });
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          dataProviders: [
            {
              ...basicDataProvider,
              name: '',
              type: DataProviderType.template,
            },
            {
              ...basicDataProvider,
              id: '456',
              type: DataProviderType.template,
            },
          ],
          timelineType: TimelineType.template,
        },
      };
      expect(update).toEqual(expected);
    });
  });

  describe('#updateTimelineAndProviderExcluded', () => {
    let timelineByIdwithAndMock: TimelineById = timelineByIdMock;
    beforeEach(() => {
      const providerToAdd: DataProvider = {
        ...basicDataProvider,
        and: [
          {
            ...basicDataProvider,
            id: '568',
            name: 'And Data Provider',
          },
        ],
        id: '567',
      };

      timelineByIdwithAndMock = addTimelineProvider({
        id: 'foo',
        provider: providerToAdd,
        timelineById: timelineByIdMock,
      });
    });

    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineProviderExcluded({
        id: 'foo',
        providerId: '567',
        excluded: true, // value we are updating from true to false
        timelineById: timelineByIdwithAndMock,
        andProviderId: '568',
      });
      expect(update).not.toBe(timelineByIdwithAndMock);
    });

    test('should return a new reference for and data provider and not the same reference of data and provider', () => {
      const update = updateTimelineProviderExcluded({
        id: 'foo',
        providerId: '567',
        excluded: true, // value we are updating from false to true
        timelineById: timelineByIdwithAndMock,
        andProviderId: '568',
      });
      expect(update.foo.dataProviders).not.toBe(basicTimeline.dataProviders);
    });

    test('should update the timeline and provider excluded from true to false', () => {
      const update = updateTimelineProviderExcluded({
        id: 'foo',
        providerId: '567',
        excluded: true, // value we are updating from true to false
        timelineById: timelineByIdwithAndMock,
        andProviderId: '568',
      });
      const indexProvider = update.foo.dataProviders.findIndex((i) => i.id === '567');
      expect(update.foo.dataProviders[indexProvider].and[0].enabled).toEqual(true);
    });

    test('should update only one and data provider and not two and data providers', () => {
      const indexProvider = timelineByIdwithAndMock.foo.dataProviders.findIndex(
        (i) => i.id === '567'
      );
      const multiAndDataProvider = timelineByIdwithAndMock.foo.dataProviders[
        indexProvider
      ].and.concat({
        ...basicDataProvider,
        id: '456',
        name: 'new and data provider',
      });
      const multiAndDataProviderMock = set(
        `foo.dataProviders[${indexProvider}].and`,
        multiAndDataProvider,
        timelineByIdwithAndMock
      );
      const update = updateTimelineProviderExcluded({
        id: 'foo',
        providerId: '567',
        excluded: true, // value we are updating from true to false
        timelineById: multiAndDataProviderMock,
        andProviderId: '568',
      });
      const oldAndProvider = update.foo.dataProviders[indexProvider].and.find(
        (i) => i.id === '568'
      );
      const newAndProvider = update.foo.dataProviders[indexProvider].and.find(
        (i) => i.id === '456'
      );
      expect(oldAndProvider!.excluded).toEqual(true);
      expect(newAndProvider!.excluded).toEqual(false);
    });
  });

  describe('#updateTimelineItemsPerPage', () => {
    test('should return a new reference and not the same reference', () => {
      const update = updateTimelineItemsPerPage({
        id: 'foo',
        itemsPerPage: 10, // value we are updating from 5 to 10
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update the items per page from 25 to 50', () => {
      const update = updateTimelineItemsPerPage({
        id: 'foo',
        itemsPerPage: 50, // value we are updating from 25 to 50
        timelineById: timelineByIdMock,
      });
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          itemsPerPage: 50,
        },
      };
      expect(update).toEqual(expected);
    });
  });

  describe('#updateTimelinePerPageOptions', () => {
    test('should return a new reference and not the same reference', () => {
      const update = updateTimelinePerPageOptions({
        id: 'foo',
        itemsPerPageOptions: [100, 200, 300], // value we are updating from [5, 10, 20]
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should update the items per page options from [10, 25, 50] to [100, 200, 300]', () => {
      const update = updateTimelinePerPageOptions({
        id: 'foo',
        itemsPerPageOptions: [100, 200, 300], // value we are updating from [10, 25, 50]
        timelineById: timelineByIdMock,
      });
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          itemsPerPageOptions: [100, 200, 300], // updated
        },
      };
      expect(update).toEqual(expected);
    });
  });

  describe('#removeTimelineProvider', () => {
    test('should return a new reference and not the same reference', () => {
      const update = removeTimelineProvider({
        id: 'foo',
        providerId: '123',
        timelineById: timelineByIdMock,
      });
      expect(update).not.toBe(timelineByIdMock);
    });

    test('should remove a timeline provider', () => {
      const update = removeTimelineProvider({
        id: 'foo',
        providerId: '123',
        timelineById: timelineByIdMock,
      });
      expect(update).toEqual(set('foo.dataProviders', [], timelineByIdMock));
    });

    test('should remove only one data provider and not two data providers', () => {
      const multiDataProvider = basicTimeline.dataProviders.concat({
        ...basicDataProvider,
        id: '456',
        name: 'data provider 2',
      });
      const multiDataProviderMock = {
        ...timelineByIdMock,
        foo: {
          ...timelineByIdMock.foo,
          dataProviders: multiDataProvider,
        },
      };
      const update = removeTimelineProvider({
        id: 'foo',
        providerId: '123',
        timelineById: multiDataProviderMock,
      });
      const expected: TimelineById = {
        foo: {
          ...basicTimeline,
          dataProviders: [
            {
              ...basicDataProvider,
              id: '456',
              name: 'data provider 2',
            },
          ],
        },
      };
      expect(update).toEqual(expected);
    });

    test('should remove only first provider and not nested andProvider', () => {
      const dataProviders: DataProvider[] = [
        {
          ...basicDataProvider,
          id: '111',
        },
        {
          ...basicDataProvider,
          id: '222',
          name: 'data provider 2',
        },
        {
          ...basicDataProvider,
          id: '333',
          name: 'data provider 3',
        },
      ];

      const multiDataProviderMock = set('foo.dataProviders', dataProviders, timelineByIdMock);

      const andDataProvider: DataProvidersAnd = {
        ...basicDataProvider,
        id: '211',
        name: 'And Data Provider',
      };

      const nestedMultiAndDataProviderMock = set(
        'foo.dataProviders[1].and',
        [andDataProvider],
        multiDataProviderMock
      );

      const update = removeTimelineProvider({
        id: 'foo',
        providerId: '222',
        timelineById: nestedMultiAndDataProviderMock,
      });
      expect(update).toEqual(
        set(
          'foo.dataProviders',
          [
            nestedMultiAndDataProviderMock.foo.dataProviders[0],
            { ...andDataProvider, and: [] },
            nestedMultiAndDataProviderMock.foo.dataProviders[2],
          ],
          timelineByIdMock
        )
      );
    });

    test('should remove only the first provider and keep multiple nested andProviders', () => {
      const multiDataProvider: DataProvider[] = [
        {
          ...basicDataProvider,
          and: [
            {
              ...basicDataProvider,
              id: 'socket_closed-MSoH7GoB9v5HJNSHRYj1-user_name-root',
              name: 'root',
              queryMatch: {
                field: 'user.name',
                value: 'root',
                operator: ':',
              },
            },
            {
              ...basicDataProvider,
              id: 'executed-yioH7GoB9v5HJNSHKnp5-auditd_result-success',
              name: 'success',
              queryMatch: {
                field: 'auditd.result',
                value: 'success',
                operator: ':',
              },
            },
          ],
          id: 'hosts-table-hostName-suricata-iowa',
          name: 'suricata-iowa',
          queryMatch: {
            field: 'host.name',
            value: 'suricata-iowa',
            operator: ':',
          },
        },
      ];

      const multiDataProviderMock = {
        ...timelineByIdMock,
        foo: {
          ...timelineByIdMock.foo,
          dataProviders: multiDataProvider,
        },
      };

      const update = removeTimelineProvider({
        id: 'foo',
        providerId: 'hosts-table-hostName-suricata-iowa',
        timelineById: multiDataProviderMock,
      });

      expect(update).toEqual(
        set(
          'foo.dataProviders',
          [
            {
              ...basicDataProvider,
              id: 'socket_closed-MSoH7GoB9v5HJNSHRYj1-user_name-root',
              name: 'root',
              queryMatch: {
                field: 'user.name',
                value: 'root',
                operator: ':',
              },
              and: [
                {
                  ...basicDataProvider,
                  id: 'executed-yioH7GoB9v5HJNSHKnp5-auditd_result-success',
                  name: 'success',
                  queryMatch: {
                    field: 'auditd.result',
                    value: 'success',
                    operator: ':',
                  },
                },
              ],
            },
          ],
          timelineByIdMock
        )
      );
    });
    test('should remove only the first AND provider when the first AND is deleted, and there are multiple andProviders', () => {
      const multiDataProvider: DataProvider[] = [
        {
          ...basicDataProvider,
          and: [
            {
              ...basicDataProvider,
              id: 'socket_closed-MSoH7GoB9v5HJNSHRYj1-user_name-root',
              name: 'root',
              queryMatch: {
                field: 'user.name',
                value: 'root',
                operator: ':',
              },
            },
            {
              ...basicDataProvider,
              id: 'executed-yioH7GoB9v5HJNSHKnp5-auditd_result-success',
              name: 'success',
              queryMatch: {
                field: 'auditd.result',
                value: 'success',
                operator: ':',
              },
            },
          ],
          id: 'hosts-table-hostName-suricata-iowa',
          name: 'suricata-iowa',
          queryMatch: {
            field: 'host.name',
            value: 'suricata-iowa',
            operator: ':',
          },
        },
      ];

      const multiDataProviderMock = {
        ...timelineByIdMock,
        foo: {
          ...timelineByIdMock.foo,
          dataProviders: multiDataProvider,
        },
      };

      const update = removeTimelineProvider({
        andProviderId: 'socket_closed-MSoH7GoB9v5HJNSHRYj1-user_name-root',
        id: 'foo',
        providerId: 'hosts-table-hostName-suricata-iowa',
        timelineById: multiDataProviderMock,
      });

      expect(update).toEqual(
        set(
          'foo.dataProviders',
          [
            {
              ...basicDataProvider,
              and: [
                {
                  ...basicDataProvider,
                  id: 'executed-yioH7GoB9v5HJNSHKnp5-auditd_result-success',
                  name: 'success',
                  queryMatch: {
                    field: 'auditd.result',
                    value: 'success',
                    operator: ':',
                  },
                },
              ],
              id: 'hosts-table-hostName-suricata-iowa',
              name: 'suricata-iowa',
              queryMatch: {
                field: 'host.name',
                value: 'suricata-iowa',
                operator: ':',
              },
            },
          ],
          timelineByIdMock
        )
      );
    });

    test('should remove only the second AND provider when the second AND is deleted, and there are multiple andProviders', () => {
      const multiDataProvider: DataProvider[] = [
        {
          ...basicDataProvider,
          and: [
            {
              ...basicDataProvider,
              id: 'socket_closed-MSoH7GoB9v5HJNSHRYj1-user_name-root',
              name: 'root',
              queryMatch: {
                field: 'user.name',
                value: 'root',
                operator: ':',
              },
            },
            {
              ...basicDataProvider,
              id: 'executed-yioH7GoB9v5HJNSHKnp5-auditd_result-success',
              name: 'success',
              queryMatch: {
                field: 'auditd.result',
                value: 'success',
                operator: ':',
              },
            },
          ],
          id: 'hosts-table-hostName-suricata-iowa',
          name: 'suricata-iowa',
          queryMatch: {
            field: 'host.name',
            value: 'suricata-iowa',
            operator: ':',
          },
        },
      ];

      const multiDataProviderMock = {
        ...timelineByIdMock,
        foo: {
          ...timelineByIdMock.foo,
          dataProviders: multiDataProvider,
        },
      };

      const update = removeTimelineProvider({
        andProviderId: 'executed-yioH7GoB9v5HJNSHKnp5-auditd_result-success',
        id: 'foo',
        providerId: 'hosts-table-hostName-suricata-iowa',
        timelineById: multiDataProviderMock,
      });

      expect(update).toEqual(
        set(
          'foo.dataProviders',
          [
            {
              ...basicDataProvider,
              and: [
                {
                  ...basicDataProvider,
                  id: 'socket_closed-MSoH7GoB9v5HJNSHRYj1-user_name-root',
                  name: 'root',
                  queryMatch: {
                    field: 'user.name',
                    value: 'root',
                    operator: ':',
                  },
                },
              ],
              id: 'hosts-table-hostName-suricata-iowa',
              name: 'suricata-iowa',
              queryMatch: {
                field: 'host.name',
                value: 'suricata-iowa',
                operator: ':',
              },
            },
          ],
          timelineByIdMock
        )
      );
    });
  });
});
