/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { mountWithIntl } from '@kbn/test-jest-helpers';
import moment from 'moment';
import React from 'react';
import { RecurrenceScheduler } from '.';
import { RRuleFrequency } from '../../../../../../types';

describe('RecurrenceScheduler', () => {
  const onChange = jest.fn();

  beforeEach(() => {
    onChange.mockReset();
  });

  test('render at initialization', () => {
    const wrapper = mountWithIntl(
      <RecurrenceScheduler
        startDate={null}
        endDate={null}
        onChange={onChange}
        initialState={null}
      />
    );

    expect(wrapper.find('[data-test-subj="recurrenceScheduler"]').exists()).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSelector"]').exists()
    ).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRecurrenceEnds"]').exists()
    ).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSelector"]').first().props().value
    ).toEqual(RRuleFrequency.DAILY);
    expect(
      wrapper
        .find(
          '[data-test-subj="recurrenceSchedulerRecurrenceEnds"] label.euiButtonGroupButton-isSelected'
        )
        .first()
        .text()
    ).toEqual('Never');

    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSummary"]').first().text()
    ).toEqual('Repeats every day');
  });

  test('render at initialization with the same start date and end date', () => {
    const wrapper = mountWithIntl(
      <RecurrenceScheduler
        startDate={moment('11/23/2021')}
        endDate={moment('11/23/2021')}
        onChange={onChange}
        initialState={null}
      />
    );

    expect(wrapper.find('[data-test-subj="recurrenceScheduler"]').exists()).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSelector"]').exists()
    ).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRecurrenceEnds"]').exists()
    ).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSelector"]').first().props().value
    ).toEqual(RRuleFrequency.DAILY);
    expect(
      wrapper
        .find(
          '[data-test-subj="recurrenceSchedulerRecurrenceEnds"] label.euiButtonGroupButton-isSelected'
        )
        .first()
        .text()
    ).toEqual('Never');

    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSummary"]').first().text()
    ).toEqual('Repeats every day');
  });

  test('render at initialization with different start date and end date', () => {
    const wrapper = mountWithIntl(
      <RecurrenceScheduler
        startDate={moment('11/23/2021')}
        endDate={moment('11/25/2021')}
        onChange={onChange}
        initialState={null}
      />
    );

    expect(wrapper.find('[data-test-subj="recurrenceScheduler"]').exists()).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSelector"]').exists()
    ).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRecurrenceEnds"]').exists()
    ).toBeTruthy();
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSelector"]').first().props().value
    ).toEqual(RRuleFrequency.WEEKLY);
    expect(
      wrapper
        .find(
          '[data-test-subj="recurrenceSchedulerRecurrenceEnds"] label.euiButtonGroupButton-isSelected'
        )
        .first()
        .text()
    ).toEqual('Never');

    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSummary"]').first().text()
    ).toEqual('Repeats every week on Tuesday');
  });

  test('Should have a custom repeat', () => {
    const wrapper = mountWithIntl(
      <RecurrenceScheduler
        startDate={moment('11/23/2021')}
        endDate={moment('11/23/2021')}
        onChange={onChange}
        initialState={{
          freq: RRuleFrequency.DAILY,
          interval: 3,
          byweekday: [],
        }}
      />
    );

    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSelector"]').first().props().value
    ).toEqual('CUSTOM');
    expect(wrapper.find('[data-test-subj="customRecurrenceScheduler"] input').props().value).toBe(
      3
    );
    expect(
      wrapper.find('[data-test-subj="recurrenceSchedulerRepeatSummary"]').first().text()
    ).toEqual('Repeats every 3 days');
  });
});
