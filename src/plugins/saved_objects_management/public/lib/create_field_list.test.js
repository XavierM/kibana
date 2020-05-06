"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const public_1 = require("../../../../core/public");
const mocks_1 = require("../../../../core/public/mocks");
const create_field_list_1 = require("./create_field_list");
const savedObjectClientMock = mocks_1.savedObjectsServiceMock.createStartContract().client;
const createObject = (attributes, references = []) => new public_1.SimpleSavedObject(savedObjectClientMock, {
    id: 'id',
    type: 'type',
    migrationVersion: {},
    attributes,
    references,
});
describe('createFieldList', () => {
    it('generate fields based on the object attributes', () => {
        const obj = createObject({
            textField: 'some text',
            numberField: 12,
            boolField: true,
        });
        expect(create_field_list_1.createFieldList(obj)).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "textField",
          "type": "text",
          "value": "some text",
        },
        Object {
          "name": "numberField",
          "type": "number",
          "value": 12,
        },
        Object {
          "name": "boolField",
          "type": "boolean",
          "value": true,
        },
      ]
    `);
    });
    it('detects json fields', () => {
        const obj = createObject({
            jsonField: `{"data": "value"}`,
        });
        expect(create_field_list_1.createFieldList(obj)).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "jsonField",
          "type": "json",
          "value": "{
        \\"data\\": \\"value\\"
      }",
        },
      ]
    `);
    });
    it('handles array fields', () => {
        const obj = createObject({
            someArray: [1, 2, 3],
        });
        expect(create_field_list_1.createFieldList(obj)).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "someArray",
          "type": "array",
          "value": "[
        1,
        2,
        3
      ]",
        },
      ]
    `);
    });
    it('recursively collect nested fields', () => {
        const obj = createObject({
            firstLevel: {
                firstLevelField: 'foo',
                secondLevel: {
                    secondLevelFieldA: 'A',
                    secondLevelFieldB: 'B',
                },
            },
        });
        expect(create_field_list_1.createFieldList(obj)).toMatchInlineSnapshot(`
      Array [
        Object {
          "name": "firstLevel.firstLevelField",
          "type": "text",
          "value": "foo",
        },
        Object {
          "name": "firstLevel.secondLevel.secondLevelFieldA",
          "type": "text",
          "value": "A",
        },
        Object {
          "name": "firstLevel.secondLevel.secondLevelFieldB",
          "type": "text",
          "value": "B",
        },
      ]
    `);
    });
});
