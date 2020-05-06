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
const tslib_1 = require("tslib");
const boom_1 = tslib_1.__importDefault(require("boom"));
const response_1 = require("./response");
const error_wrapper_1 = require("./error_wrapper");
const createHandler = (handler) => () => {
    return handler();
};
describe('wrapErrors', () => {
    let context;
    let request;
    let response;
    beforeEach(() => {
        context = {};
        request = {};
        response = response_1.kibanaResponseFactory;
    });
    it('should pass-though call parameters to the handler', async () => {
        const handler = jest.fn();
        const wrapped = error_wrapper_1.wrapErrors(handler);
        await wrapped(context, request, response);
        expect(handler).toHaveBeenCalledWith(context, request, response);
    });
    it('should pass-though result from the handler', async () => {
        const handler = createHandler(() => {
            return 'handler-response';
        });
        const wrapped = error_wrapper_1.wrapErrors(handler);
        const result = await wrapped(context, request, response);
        expect(result).toBe('handler-response');
    });
    it('should intercept and convert thrown Boom errors', async () => {
        const handler = createHandler(() => {
            throw boom_1.default.notFound('not there');
        });
        const wrapped = error_wrapper_1.wrapErrors(handler);
        const result = await wrapped(context, request, response);
        expect(result).toBeInstanceOf(response_1.KibanaResponse);
        expect(result.status).toBe(404);
        expect(result.payload).toEqual({
            error: 'Not Found',
            message: 'not there',
            statusCode: 404,
        });
    });
    it('should re-throw non-Boom errors', async () => {
        const handler = createHandler(() => {
            throw new Error('something went bad');
        });
        const wrapped = error_wrapper_1.wrapErrors(handler);
        await expect(wrapped(context, request, response)).rejects.toMatchInlineSnapshot(`[Error: something went bad]`);
    });
});
