/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { shallow } from 'enzyme';
import React from 'react';

import { ScreenReader, screenReaderOnlyStyle } from '.';

describe('ScreenReader', () => {
  const text = 'This text is only visible to screenreader users';

  test('it renders the provided text', () => {
    const wrapper = shallow(<ScreenReader text={text} />);
    expect(wrapper.text()).toBe(text);
  });

  test('it renders the paragraph with style rules for screenreaders', () => {
    const wrapper = shallow(<ScreenReader text={text} />);
    const paragraph = wrapper.find('p').first();

    expect(paragraph.props().style).toEqual(screenReaderOnlyStyle);
  });
});
