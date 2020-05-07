/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { isString } from 'lodash/fp';
import { DropResult } from 'react-beautiful-dnd';
import { Dispatch } from 'redux';
import { ActionCreator } from 'typescript-fsa';

import { BrowserField, BrowserFields, getAllFieldsByName } from '../../containers/source';
import { IdToDataProvider } from '../../store/drag_and_drop/model';
import { ColumnHeaderOptions } from '../../store/timeline/model';
import { DEFAULT_COLUMN_MIN_WIDTH } from '../../../timelines/components/timeline/body/constants';

import { DataProvider } from '../../../timelines/components/timeline/data_providers/data_provider';
import { dragAndDropActions, timelineActions } from '../../store/actions';

export const draggableIdPrefix = 'draggableId';

export const droppableIdPrefix = 'droppableId';

export const draggableContentPrefix = `${draggableIdPrefix}.content.`;

export const draggableFieldPrefix = `${draggableIdPrefix}.field.`;

export const droppableContentPrefix = `${droppableIdPrefix}.content.`;

export const droppableFieldPrefix = `${droppableIdPrefix}.field.`;

export const droppableTimelineProvidersPrefix = `${droppableIdPrefix}.timelineProviders.`;

export const droppableTimelineColumnsPrefix = `${droppableIdPrefix}.timelineColumns.`;

export const droppableTimelineFlyoutButtonPrefix = `${droppableIdPrefix}.flyoutButton.`;

export const getDraggableId = (dataProviderId: string): string =>
  `${draggableContentPrefix}${dataProviderId}`;

export const getDraggableFieldId = ({
  contextId,
  fieldId,
}: {
  contextId: string;
  fieldId: string;
}): string => `${draggableFieldPrefix}${escapeContextId(contextId)}.${escapeFieldId(fieldId)}`;

export const getDroppableId = (visualizationPlaceholderId: string): string =>
  `${droppableContentPrefix}${visualizationPlaceholderId}`;

export const sourceIsContent = (result: DropResult): boolean =>
  result.source.droppableId.startsWith(droppableContentPrefix);

export const draggableIsContent = (result: DropResult | { draggableId: string }): boolean =>
  result.draggableId.startsWith(draggableContentPrefix);

export const draggableIsField = (result: DropResult | { draggableId: string }): boolean =>
  result.draggableId.startsWith(draggableFieldPrefix);

export const reasonIsDrop = (result: DropResult): boolean => result.reason === 'DROP';

export const destinationIsTimelineProviders = (result: DropResult): boolean =>
  result.destination != null &&
  result.destination.droppableId.startsWith(droppableTimelineProvidersPrefix);

export const destinationIsTimelineColumns = (result: DropResult): boolean =>
  result.destination != null &&
  result.destination.droppableId.startsWith(droppableTimelineColumnsPrefix);

export const destinationIsTimelineButton = (result: DropResult): boolean =>
  result.destination != null &&
  result.destination.droppableId.startsWith(droppableTimelineFlyoutButtonPrefix);

export const getTimelineIdFromDestination = (result: DropResult): string =>
  result.destination != null &&
  (destinationIsTimelineProviders(result) ||
    destinationIsTimelineButton(result) ||
    destinationIsTimelineColumns(result))
    ? result.destination.droppableId.substring(result.destination.droppableId.lastIndexOf('.') + 1)
    : '';

export const getProviderIdFromDraggable = (result: DropResult): string =>
  result.draggableId.substring(result.draggableId.lastIndexOf('.') + 1);

export const getFieldIdFromDraggable = (result: DropResult): string =>
  unEscapeFieldId(result.draggableId.substring(result.draggableId.lastIndexOf('.') + 1));

export const escapeDataProviderId = (path: string) => path.replace(/\./g, '_');

export const escapeContextId = (path: string) => path.replace(/\./g, '_');

export const escapeFieldId = (path: string) => path.replace(/\./g, '!!!DOT!!!');

export const unEscapeFieldId = (path: string) => path.replace(/!!!DOT!!!/g, '.');

export const providerWasDroppedOnTimeline = (result: DropResult): boolean =>
  reasonIsDrop(result) &&
  draggableIsContent(result) &&
  sourceIsContent(result) &&
  destinationIsTimelineProviders(result);

export const fieldWasDroppedOnTimelineColumns = (result: DropResult): boolean =>
  reasonIsDrop(result) && draggableIsField(result) && destinationIsTimelineColumns(result);

export const providerWasDroppedOnTimelineButton = (result: DropResult): boolean =>
  reasonIsDrop(result) &&
  draggableIsContent(result) &&
  sourceIsContent(result) &&
  destinationIsTimelineButton(result);

interface AddProviderToTimelineParams {
  dataProviders: IdToDataProvider;
  result: DropResult;
  dispatch: Dispatch;
  addProvider?: ActionCreator<{
    id: string;
    provider: DataProvider;
  }>;
  noProviderFound?: ActionCreator<{
    id: string;
  }>;
}

interface AddFieldToTimelineColumnsParams {
  upsertColumn?: ActionCreator<{
    column: ColumnHeaderOptions;
    id: string;
    index: number;
  }>;
  browserFields: BrowserFields;
  dispatch: Dispatch;
  result: DropResult;
}

export const addProviderToTimeline = ({
  dataProviders,
  result,
  dispatch,
  addProvider = timelineActions.addProvider,
  noProviderFound = dragAndDropActions.noProviderFound,
}: AddProviderToTimelineParams): void => {
  const timeline = getTimelineIdFromDestination(result);
  const providerId = getProviderIdFromDraggable(result);
  const provider = dataProviders[providerId];

  if (provider) {
    dispatch(addProvider({ id: timeline, provider }));
  } else {
    dispatch(noProviderFound({ id: providerId }));
  }
};

export const addFieldToTimelineColumns = ({
  upsertColumn = timelineActions.upsertColumn,
  browserFields,
  dispatch,
  result,
}: AddFieldToTimelineColumnsParams): void => {
  const timeline = getTimelineIdFromDestination(result);
  const fieldId = getFieldIdFromDraggable(result);
  const allColumns = getAllFieldsByName(browserFields);
  const column = allColumns[fieldId];

  if (column != null) {
    dispatch(
      upsertColumn({
        column: {
          category: column.category,
          columnHeaderType: 'not-filtered',
          description: isString(column.description) ? column.description : undefined,
          example: isString(column.example) ? column.example : undefined,
          id: fieldId,
          type: column.type,
          aggregatable: column.aggregatable,
          width: DEFAULT_COLUMN_MIN_WIDTH,
        },
        id: timeline,
        index: result.destination != null ? result.destination.index : 0,
      })
    );
  } else {
    // create a column definition, because it doesn't exist in the browserFields:
    dispatch(
      upsertColumn({
        column: {
          columnHeaderType: 'not-filtered',
          id: fieldId,
          width: DEFAULT_COLUMN_MIN_WIDTH,
        },
        id: timeline,
        index: result.destination != null ? result.destination.index : 0,
      })
    );
  }
};

interface ShowTimelineParams {
  result: DropResult;
  show: boolean;
  dispatch: Dispatch;
  showTimeline?: ActionCreator<{
    id: string;
    show: boolean;
  }>;
}

export const updateShowTimeline = ({
  result,
  show,
  dispatch,
  showTimeline = timelineActions.showTimeline,
}: ShowTimelineParams): void => {
  const timeline = getTimelineIdFromDestination(result);

  dispatch(showTimeline({ id: timeline, show }));
};

/**
 * Prevents fields from being dragged or dropped to any area other than column
 * header drop zone in the timeline
 */
export const DRAG_TYPE_FIELD = 'drag-type-field';

/** This class is added to the document body while dragging */
export const IS_DRAGGING_CLASS_NAME = 'is-dragging';

/** This class is added to the document body while timeline field dragging */
export const IS_TIMELINE_FIELD_DRAGGING_CLASS_NAME = 'is-timeline-field-dragging';

export const allowTopN = ({
  browserField,
  fieldName,
}: {
  browserField: Partial<BrowserField> | undefined;
  fieldName: string;
}): boolean => {
  const isAggregatable = browserField?.aggregatable ?? false;
  const fieldType = browserField?.type ?? '';
  const isAllowedType = [
    'boolean',
    'geo-point',
    'geo-shape',
    'ip',
    'keyword',
    'number',
    'numeric',
    'string',
  ].includes(fieldType);

  // TODO: remove this explicit whitelist when the ECS documentation includes signals
  const isWhitelistedNonBrowserField = [
    'signal.ancestors.depth',
    'signal.ancestors.id',
    'signal.ancestors.rule',
    'signal.ancestors.type',
    'signal.original_event.action',
    'signal.original_event.category',
    'signal.original_event.code',
    'signal.original_event.created',
    'signal.original_event.dataset',
    'signal.original_event.duration',
    'signal.original_event.end',
    'signal.original_event.hash',
    'signal.original_event.id',
    'signal.original_event.kind',
    'signal.original_event.module',
    'signal.original_event.original',
    'signal.original_event.outcome',
    'signal.original_event.provider',
    'signal.original_event.risk_score',
    'signal.original_event.risk_score_norm',
    'signal.original_event.sequence',
    'signal.original_event.severity',
    'signal.original_event.start',
    'signal.original_event.timezone',
    'signal.original_event.type',
    'signal.original_time',
    'signal.parent.depth',
    'signal.parent.id',
    'signal.parent.index',
    'signal.parent.rule',
    'signal.parent.type',
    'signal.rule.created_by',
    'signal.rule.description',
    'signal.rule.enabled',
    'signal.rule.false_positives',
    'signal.rule.filters',
    'signal.rule.from',
    'signal.rule.id',
    'signal.rule.immutable',
    'signal.rule.index',
    'signal.rule.interval',
    'signal.rule.language',
    'signal.rule.max_signals',
    'signal.rule.name',
    'signal.rule.note',
    'signal.rule.output_index',
    'signal.rule.query',
    'signal.rule.references',
    'signal.rule.risk_score',
    'signal.rule.rule_id',
    'signal.rule.saved_id',
    'signal.rule.severity',
    'signal.rule.size',
    'signal.rule.tags',
    'signal.rule.threat',
    'signal.rule.threat.tactic.id',
    'signal.rule.threat.tactic.name',
    'signal.rule.threat.tactic.reference',
    'signal.rule.threat.technique.id',
    'signal.rule.threat.technique.name',
    'signal.rule.threat.technique.reference',
    'signal.rule.timeline_id',
    'signal.rule.timeline_title',
    'signal.rule.to',
    'signal.rule.type',
    'signal.rule.updated_by',
    'signal.rule.version',
    'signal.status',
  ].includes(fieldName);

  return isWhitelistedNonBrowserField || (isAggregatable && isAllowedType);
};
