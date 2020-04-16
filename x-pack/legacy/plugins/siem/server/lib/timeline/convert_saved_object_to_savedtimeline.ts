/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { failure } from 'io-ts/lib/PathReporter';
import { pipe } from 'fp-ts/lib/pipeable';
import { map, fold } from 'fp-ts/lib/Either';
import { identity } from 'fp-ts/lib/function';
import { TimelineSavedObjectRuntimeType, TimelineSavedObject } from './types';
import { TimelineType } from '../../graphql/types';

export const convertSavedObjectToSavedTimeline = (savedObject: unknown): TimelineSavedObject => {
  const timeline = pipe(
    TimelineSavedObjectRuntimeType.decode(savedObject),
    map(savedTimeline => {
      return {
        savedObjectId: savedTimeline.id,
        version: savedTimeline.version,
        timelineType: savedTimeline.timelineType ?? TimelineType.default,
        ...savedTimeline.attributes,
      };
    }),
    fold(errors => {
      throw new Error(failure(errors).join('\n'));
    }, identity)
  );

  return timeline;
};
