/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';

export const screenReaderOnlyStyle: React.CSSProperties = {
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

/**
 * This component exists because, when there are too many instances of
 * `EuiScreenReaderOnly` on the same page, layouts become very expensive,
 * resulting in very long layout times and jank. For example, when a user
 * hovers over an `EuiTooltip`, the forced layout causes flashing.
 *
 * This component uses the "CSS clip" technique, described here:
 * https://webaim.org/techniques/css/invisiblecontent/
 */
const ScreenReaderComponent: React.FC<Props> = ({ text }) => (
  <p style={screenReaderOnlyStyle}>{text}</p>
);

export const ScreenReader = React.memo(ScreenReaderComponent);
ScreenReader.displayName = 'ScreenReader';
