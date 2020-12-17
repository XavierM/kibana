/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';

const screenReaderOnlyStyle: React.CSSProperties = {
  clip: 'rect(1px, 1px, 1px, 1px)',
  clipPath: 'inset(50%)',
  height: '1px',
  margin: '-1px',
  overflow: 'hidden',
  padding: '0',
  position: 'absolute',
  width: '1px',
};

interface Props {
  text: string;
}

const ScreenReaderComponent: React.FC<Props> = ({ text }) => (
  <p style={screenReaderOnlyStyle} tabIndex={-1}>
    {text}
  </p>
);

export const ScreenReader = React.memo(ScreenReaderComponent);
ScreenReader.displayName = 'ScreenReader';
