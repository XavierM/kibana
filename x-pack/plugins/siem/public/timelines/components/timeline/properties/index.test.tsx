/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { mount } from 'enzyme';
import React from 'react';
import { Provider as ReduxStoreProvider } from 'react-redux';

import { mockGlobalState, apolloClientObservable } from '../../../../common/mock';
import { createStore, State } from '../../../../common/store';
import { useThrottledResizeObserver } from '../../../../common/components/utils';
import { timelineReducer } from '../../../store/timeline/reducer';
import { Properties, showDescriptionThreshold, showNotesThreshold } from '.';

jest.mock('../../../../common/lib/kibana');

let mockedWidth = 1000;
jest.mock('../../utils');
(useThrottledResizeObserver as jest.Mock).mockImplementation(() => ({
  width: mockedWidth,
}));

describe('Properties', () => {
  const usersViewing = ['elastic'];

  const state: State = mockGlobalState;
  let store = createStore(state, { timeline: timelineReducer }, apolloClientObservable);

  beforeEach(() => {
    jest.clearAllMocks();
    store = createStore(state, { timeline: timelineReducer }, apolloClientObservable);
    mockedWidth = 1000;
  });

  test('renders correctly', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );
    expect(wrapper.find('[data-test-subj="timeline-properties"]').exists()).toEqual(true);
  });

  test('it renders an empty star icon when it is NOT a favorite', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(wrapper.find('[data-test-subj="timeline-favorite-empty-star"]').exists()).toEqual(true);
  });

  test('it renders a filled star icon when it is a favorite', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={true}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(wrapper.find('[data-test-subj="timeline-favorite-filled-star"]').exists()).toEqual(true);
  });

  test('it renders the title of the timeline', () => {
    const title = 'foozle';

    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title={title}
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(
      wrapper
        .find('[data-test-subj="timeline-title"]')
        .first()
        .props().value
    ).toEqual(title);
  });

  test('it renders the date picker with the lock icon', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(
      wrapper
        .find('[data-test-subj="properties-left"]')
        .find('[data-test-subj="timeline-date-picker-container"]')
        .exists()
    ).toEqual(true);
  });

  test('it renders the lock icon when isDatepickerLocked is true', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={true}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );
    expect(
      wrapper
        .find('[data-test-subj="properties-left"]')
        .find('[data-test-subj="timeline-date-picker-lock-button"]')
        .exists()
    ).toEqual(true);
  });

  test('it renders the unlock icon when isDatepickerLocked is false', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );
    expect(
      wrapper
        .find('[data-test-subj="properties-left"]')
        .find('[data-test-subj="timeline-date-picker-unlock-button"]')
        .exists()
    ).toEqual(true);
  });

  test('it renders a description on the left when the width is at least as wide as the threshold', () => {
    const description = 'strange';
    mockedWidth = showDescriptionThreshold;

    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description={description}
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(
      wrapper
        .find('[data-test-subj="properties-left"]')
        .find('[data-test-subj="timeline-description"]')
        .first()
        .props().value
    ).toEqual(description);
  });

  test('it does NOT render a description on the left when the width is less than the threshold', () => {
    const description = 'strange';
    mockedWidth = showDescriptionThreshold - 1;

    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description={description}
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(
      wrapper
        .find('[data-test-subj="properties-left"]')
        .find('[data-test-subj="timeline-description"]')
        .exists()
    ).toEqual(false);
  });

  test('it renders a notes button on the left when the width is at least as wide as the threshold', () => {
    mockedWidth = showNotesThreshold;

    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(
      wrapper
        .find('[data-test-subj="properties-left"]')
        .find('[data-test-subj="timeline-notes-button-large"]')
        .exists()
    ).toEqual(true);
  });

  test('it does NOT render a a notes button on the left when the width is less than the threshold', () => {
    mockedWidth = showNotesThreshold - 1;

    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(
      wrapper
        .find('[data-test-subj="properties-left"]')
        .find('[data-test-subj="timeline-notes-button-large"]')
        .exists()
    ).toEqual(false);
  });

  test('it renders a settings icon', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(wrapper.find('[data-test-subj="settings-gear"]').exists()).toEqual(true);
  });

  test('it renders an avatar for the current user viewing the timeline when it has a title', () => {
    const title = 'port scan';

    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title={title}
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(wrapper.find('[data-test-subj="avatar"]').exists()).toEqual(true);
  });

  test('it does NOT render an avatar for the current user viewing the timeline when it does NOT have a title', () => {
    const wrapper = mount(
      <ReduxStoreProvider store={store}>
        <Properties
          associateNote={jest.fn()}
          createTimeline={jest.fn()}
          isDataInTimeline={false}
          isDatepickerLocked={false}
          isFavorite={false}
          title=""
          description=""
          getNotesByIds={jest.fn()}
          noteIds={[]}
          timelineId="abc"
          toggleLock={jest.fn()}
          updateDescription={jest.fn()}
          updateIsFavorite={jest.fn()}
          updateTitle={jest.fn()}
          updateNote={jest.fn()}
          usersViewing={usersViewing}
        />
      </ReduxStoreProvider>
    );

    expect(wrapper.find('[data-test-subj="avatar"]').exists()).toEqual(false);
  });
});
