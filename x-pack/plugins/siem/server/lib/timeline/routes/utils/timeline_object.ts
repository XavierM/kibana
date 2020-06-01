/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { isEmpty } from 'lodash/fp';
import {
  TimelineType,
  TimelineTypeLiteralWithNull,
  TimelineSavedObject,
} from '../../../../../common/types/timeline';
import { getTimeline, getTemplateTimeline } from './create_timelines';
import { FrameworkRequest } from '../../../framework';

interface TimelineObjectProps {
  id: string | null | undefined;
  type: TimelineTypeLiteralWithNull | undefined;
  title: string | null | undefined;
  version: string | number | null | undefined;
  frameworkRequest: FrameworkRequest;
}

export class TimelineObject {
  private id: string | null;
  private type: TimelineTypeLiteralWithNull;
  private title: string | null;
  private version: string | number | null;
  private frameworkRequest: FrameworkRequest;

  public data: TimelineSavedObject | null;

  constructor({
    id = null,
    type = TimelineType.default,
    title = null,
    version = null,
    frameworkRequest,
  }: TimelineObjectProps) {
    this.id = id;
    this.type = type;
    this.title = title;

    this.version = version;
    this.frameworkRequest = frameworkRequest;
    this.data = null;
  }

  public async getTimeline() {
    this.data =
      this.id != null
        ? this.type === TimelineType.template
          ? await getTemplateTimeline(this.frameworkRequest, this.id)
          : await getTimeline(this.frameworkRequest, this.id)
        : null;

    return this.data;
  }

  public get isTitleExists() {
    return !isEmpty(this.title);
  }

  public get isExists() {
    return this.data != null;
  }

  public get isUpdatable() {
    return this.isExists && !this.isVersionConflict() && this.isTitleExists;
  }

  public get isCreatable() {
    return !this.isExists && this.isTitleExists;
  }

  public get isUpdatableViaImport() {
    return this.type === TimelineType.template && this.isUpdatable;
  }

  public get getVersion() {
    return this.version;
  }

  public get getId() {
    return this.id;
  }

  private isVersionConflict() {
    const version = this.version;
    const existingVersion =
      this.type === TimelineType.template ? this.data?.templateTimelineVersion : this.data?.version;
    if (this.isExists && version != null) {
      return !(version === existingVersion);
    } else if (this.isExists && version == null) {
      return true;
    }
    return false;
  }
}
