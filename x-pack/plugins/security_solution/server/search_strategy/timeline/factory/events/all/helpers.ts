/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { merge, uniq } from 'lodash/fp';
import {
  EventHit,
  TimelineEdges,
  TimelineNonEcsData,
} from '../../../../../../common/search_strategy';
import { toStringArray } from '../../../../helpers/to_array';
import { getDataSafety, getDataFromFieldsHits } from '../details/helpers';

interface MergeTimelineFieldsWithHit {
  fieldName: string;
  flattenedFields: TimelineEdges;
  hit: EventHit;
  dataFields: readonly string[];
  ecsFields: readonly string[];
}

const getTimestamp = (hit: EventHit): string => {
  if (hit.fields && hit.fields['@timestamp']) {
    return `${hit.fields['@timestamp'][0] ?? ''}`;
  } else if (hit._source && hit._source['@timestamp']) {
    return hit._source['@timestamp'];
  }
  return '';
};

export const formatTimelineData = async (
  dataFields: readonly string[],
  ecsFields: readonly string[],
  hit: EventHit
) =>
  uniq([...ecsFields, ...dataFields]).reduce<Promise<TimelineEdges>>(
    async (acc, fieldName) => {
      const flattenedFields: TimelineEdges = await acc;
      flattenedFields.node._id = hit._id;
      flattenedFields.node._index = hit._index;
      flattenedFields.node.ecs._id = hit._id;
      flattenedFields.node.ecs.timestamp = getTimestamp(hit);
      flattenedFields.node.ecs._index = hit._index;
      if (hit.sort && hit.sort.length > 1) {
        flattenedFields.cursor.value = hit.sort[0];
        flattenedFields.cursor.tiebreaker = hit.sort[1];
      }
      return getDataSafety<MergeTimelineFieldsWithHit, TimelineEdges>(mergeTimelineFieldsWithHit, {
        fieldName,
        flattenedFields,
        hit,
        dataFields,
        ecsFields,
      });
    },
    Promise.resolve({
      node: { ecs: { _id: '' }, data: [], _id: '', _index: '' },
      cursor: {
        value: '',
        tiebreaker: null,
      },
    })
  );

const getValuesFromFields = (
  fieldName: string,
  hit: EventHit,
  nestedParentFieldName?: string
): TimelineNonEcsData[] => {
  if (specialFields.includes(fieldName)) {
    return [{ field: fieldName, value: toStringArray(hit[fieldName]) }];
  }

  let fieldToEval;
  if (hit._source[fieldName]) {
    fieldToEval = {
      [fieldName]: hit._source[fieldName],
    };
  } else {
    if (nestedParentFieldName == null || nestedParentFieldName === fieldName) {
      fieldToEval = {
        [fieldName]: hit.fields[fieldName],
      };
    } else if (nestedParentFieldName != null) {
      fieldToEval = {
        [nestedParentFieldName]: hit.fields[nestedParentFieldName],
      };
    } else {
      // fallback, should never hit
      fieldToEval = {
        [fieldName]: [],
      };
    }
  }
  const formattedData = getDataFromFieldsHits(fieldToEval);
  return formattedData.reduce(
    (acc: TimelineNonEcsData[], { field, values }) =>
      // nested fields return all field values, pick only the one we asked for
      field.includes(fieldName) ? [...acc, { field, value: values }] : acc,
    []
  );
};

const specialFields = ['_id', '_index', '_type', '_score'];

const mergeTimelineFieldsWithHit = ({
  fieldName,
  flattenedFields,
  hit,
  dataFields,
  ecsFields,
}: MergeTimelineFieldsWithHit) => {
  if (fieldName != null || dataFields.includes(fieldName)) {
    const fieldNameAsArray = fieldName.split('.');
    const nestedParentFieldName = Object.keys(hit.fields ?? []).find((f) => {
      return f === fieldNameAsArray.slice(0, f.split('.').length).join('.');
    });
    if (
      hit._source[fieldName] ||
      hit.fields[fieldName] ||
      nestedParentFieldName != null ||
      specialFields.includes(fieldName)
    ) {
      const objectWithProperty = {
        node: {
          ...flattenedFields.node,
          data: dataFields.includes(fieldName)
            ? [
                ...flattenedFields.node.data,
                ...getValuesFromFields(fieldName, hit, nestedParentFieldName),
              ]
            : flattenedFields.node.data,
          ecs: ecsFields.includes(fieldName)
            ? {
                ...flattenedFields.node.ecs,
                // @ts-expect-error
                ...fieldName.split('.').reduceRight(
                  // @ts-expect-error
                  (obj, next) => ({ [next]: obj }),
                  toStringArray(
                    hit._source[fieldName] ? hit._source[fieldName] : hit.fields[fieldName]
                  )
                ),
              }
            : flattenedFields.node.ecs,
        },
      };
      return merge(flattenedFields, objectWithProperty);
    } else {
      return flattenedFields;
    }
  } else {
    return flattenedFields;
  }
};
