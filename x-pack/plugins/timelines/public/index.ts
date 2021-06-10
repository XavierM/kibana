/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { PluginInitializerContext } from '../../../../src/core/public';

import { TimelinesPlugin } from './plugin';

export {
  tGridActions,
  tGridSelectors,
  tGridReducer,
  TGridModelForTimeline,
  TimelineState,
  TimelinesUIStart,
} from './types';
export {
  ARIA_COLINDEX_ATTRIBUTE,
  ARIA_ROWINDEX_ATTRIBUTE,
  DATA_COLINDEX_ATTRIBUTE,
  DATA_ROWINDEX_ATTRIBUTE,
  FIRST_ARIA_INDEX,
  OnColumnFocused,
  arrayIndexToAriaIndex,
  elementOrChildrenHasFocus,
  isArrowDownOrArrowUp,
  isArrowUp,
  isEscape,
  isTab,
  focusColumn,
  getFocusedAriaColindexCell,
  getFocusedDataColindexCell,
  getNotesContainerClassName,
  getRowRendererClassName,
  getTableSkipFocus,
  handleSkipFocus,
  onFocusReFocusDraggable,
  onKeyDownFocusHandler,
  skipFocusInContainerTo,
  stopPropagationAndPreventDefault,
} from '../common/utils/accessibility';
export {
  addFieldToTimelineColumns,
  getTimelineIdFromColumnDroppableId,
} from './components/drag_and_drop/helpers';

// This exports static code and TypeScript types,
// as well as, Kibana Platform `plugin()` initializer.
export function plugin(initializerContext: PluginInitializerContext) {
  return new TimelinesPlugin(initializerContext);
}
<<<<<<< Updated upstream
=======
export { TimelinesPluginSetup } from './types';
export * as TGridActions from './store/t_grid/actions';
export * from '../common/utils/accessibility';
export { tGridSelectors } from './store/t_grid';
>>>>>>> Stashed changes
