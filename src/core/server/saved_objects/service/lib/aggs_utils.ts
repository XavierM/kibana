/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { IndexMapping } from '../../mappings';

import { SavedObjectsErrorHelpers } from './errors';
import { hasFilterKeyError } from './filter_utils';
import { SavedObjectAggs, validateSavedObjectTypeAggs } from './saved_object_aggs_types';

export const validateSavedObjectAggs = (
  allowedTypes: string[],
  aggs: SavedObjectAggs,
  indexMapping: IndexMapping
) => {
  validateSavedObjectTypeAggs(aggs);
  validateAggFieldValue(allowedTypes, aggs, indexMapping);
};

const validateAggFieldValue = (allowedTypes: string[], aggs: any, indexMapping: IndexMapping) => {
  Object.keys(aggs).forEach(key => {
    if (key === 'field') {
      const error = hasFilterKeyError(key, allowedTypes, indexMapping);
      if (error != null) {
        throw SavedObjectsErrorHelpers.createBadRequestError(error);
      }
    } else if (typeof aggs[key] === 'object') {
      validateAggFieldValue(allowedTypes, aggs[key], indexMapping);
    }
  });
};
