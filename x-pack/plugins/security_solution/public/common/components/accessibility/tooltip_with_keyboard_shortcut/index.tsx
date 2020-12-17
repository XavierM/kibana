/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiText } from '@elastic/eui';
import React from 'react';

import { ScreenReader } from '../screenreader';

import * as i18n from './translations';

interface Props {
  additionalScreenReaderOnlyContext?: string;
  content: React.ReactNode;
  shortcut: string;
  showShortcut: boolean;
}

const TooltipWithKeyboardShortcutComponent = ({
  additionalScreenReaderOnlyContext = '',
  content,
  shortcut,
  showShortcut,
}: Props) => (
  <>
    <div data-test-subj="content">{content}</div>
    {additionalScreenReaderOnlyContext !== '' && (
      <ScreenReader
        text={additionalScreenReaderOnlyContext}
        data-test-subj="additionalScreenReaderOnlyContext"
      />
    )}
    {showShortcut && (
      <EuiText color="subdued" data-test-subj="shortcut" size="s" textAlign="center">
        <span>{i18n.PRESS}</span>
        {'\u00a0'}
        <span className="euiBadge euiBadge--hollow">{shortcut}</span>
      </EuiText>
    )}
  </>
);

export const TooltipWithKeyboardShortcut = React.memo(TooltipWithKeyboardShortcutComponent);
TooltipWithKeyboardShortcut.displayName = 'TooltipWithKeyboardShortcut';
