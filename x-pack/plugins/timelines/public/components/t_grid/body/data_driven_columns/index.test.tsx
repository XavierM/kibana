/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { shallow } from 'enzyme';

import React from 'react';

import '../../../../../common/mock/match_media';
import { defaultHeaders } from '../column_headers/default_headers';

import { DataDrivenColumns } from '.';
import { mockTimelineData } from '../../../../mock/mock_timeline_data';

describe('Columns', () => {
  const headersSansTimestamp = defaultHeaders.filter((h) => h.id !== '@timestamp');

  test('it renders the expected columns', () => {
    const wrapper = shallow(
      <DataDrivenColumns
        ariaRowindex={2}
        id={mockTimelineData[0]._id}
        actionsColumnWidth={50}
        checked={false}
        columnHeaders={headersSansTimestamp}
        data={mockTimelineData[0].data}
        ecsData={mockTimelineData[0].ecs}
        hasRowRenderers={false}
        notesCount={0}
        renderCellValue={DefaultCellRenderer}
        timelineId="test"
        columnValues={'abc def'}
        showCheckboxes={false}
        selectedEventIds={{}}
        loadingEventIds={[]}
        onEventDetailsPanelOpened={jest.fn()}
        onRowSelected={jest.fn()}
        showNotes={false}
        isEventPinned={false}
        toggleShowNotes={jest.fn()}
        eventIdToNoteIds={{}}
        leadingControlColumns={[]}
        trailingControlColumns={[]}
      />
    );

    expect(wrapper).toMatchSnapshot();
  });
});
