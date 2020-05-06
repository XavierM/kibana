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
const elasticsearch_1 = require("elasticsearch");
const decorate_es_error_1 = require("./decorate_es_error");
const errors_1 = require("./errors");
describe('savedObjectsClient/decorateEsError', () => {
    it('always returns the same error it receives', () => {
        const error = new Error();
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
    });
    it('makes es.ConnectionFault a SavedObjectsClient/EsUnavailable error', () => {
        const error = new elasticsearch_1.errors.ConnectionFault();
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(true);
    });
    it('makes es.ServiceUnavailable a SavedObjectsClient/EsUnavailable error', () => {
        const error = new elasticsearch_1.errors.ServiceUnavailable();
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(true);
    });
    it('makes es.NoConnections a SavedObjectsClient/EsUnavailable error', () => {
        const error = new elasticsearch_1.errors.NoConnections();
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(true);
    });
    it('makes es.RequestTimeout a SavedObjectsClient/EsUnavailable error', () => {
        const error = new elasticsearch_1.errors.RequestTimeout();
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(true);
    });
    it('makes es.Conflict a SavedObjectsClient/Conflict error', () => {
        const error = new elasticsearch_1.errors.Conflict();
        expect(errors_1.SavedObjectsErrorHelpers.isConflictError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isConflictError(error)).toBe(true);
    });
    it('makes es.AuthenticationException a SavedObjectsClient/NotAuthorized error', () => {
        const error = new elasticsearch_1.errors.AuthenticationException();
        expect(errors_1.SavedObjectsErrorHelpers.isNotAuthorizedError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isNotAuthorizedError(error)).toBe(true);
    });
    it('makes es.Forbidden a SavedObjectsClient/Forbidden error', () => {
        const error = new elasticsearch_1.errors.Forbidden();
        expect(errors_1.SavedObjectsErrorHelpers.isForbiddenError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isForbiddenError(error)).toBe(true);
    });
    it('makes es.RequestEntityTooLarge a SavedObjectsClient/RequestEntityTooLarge error', () => {
        const error = new elasticsearch_1.errors.RequestEntityTooLarge();
        expect(errors_1.SavedObjectsErrorHelpers.isRequestEntityTooLargeError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isRequestEntityTooLargeError(error)).toBe(true);
    });
    it('discards es.NotFound errors and returns a generic NotFound error', () => {
        const error = new elasticsearch_1.errors.NotFound();
        expect(errors_1.SavedObjectsErrorHelpers.isNotFoundError(error)).toBe(false);
        const genericError = decorate_es_error_1.decorateEsError(error);
        expect(genericError).not.toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isNotFoundError(error)).toBe(false);
        expect(errors_1.SavedObjectsErrorHelpers.isNotFoundError(genericError)).toBe(true);
    });
    it('makes es.BadRequest a SavedObjectsClient/BadRequest error', () => {
        const error = new elasticsearch_1.errors.BadRequest();
        expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(false);
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(true);
    });
    describe('when es.BadRequest has a reason', () => {
        it('makes a SavedObjectsClient/esCannotExecuteScriptError error when script context is disabled', () => {
            const error = new elasticsearch_1.errors.BadRequest();
            error.body = {
                error: { reason: 'cannot execute scripts using [update] context' },
            };
            expect(errors_1.SavedObjectsErrorHelpers.isEsCannotExecuteScriptError(error)).toBe(false);
            expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
            expect(errors_1.SavedObjectsErrorHelpers.isEsCannotExecuteScriptError(error)).toBe(true);
            expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(false);
        });
        it('makes a SavedObjectsClient/esCannotExecuteScriptError error when inline scripts are disabled', () => {
            const error = new elasticsearch_1.errors.BadRequest();
            error.body = {
                error: { reason: 'cannot execute [inline] scripts' },
            };
            expect(errors_1.SavedObjectsErrorHelpers.isEsCannotExecuteScriptError(error)).toBe(false);
            expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
            expect(errors_1.SavedObjectsErrorHelpers.isEsCannotExecuteScriptError(error)).toBe(true);
            expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(false);
        });
        it('makes a SavedObjectsClient/BadRequest error for any other reason', () => {
            const error = new elasticsearch_1.errors.BadRequest();
            error.body = { error: { reason: 'some other reason' } };
            expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(false);
            expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
            expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(true);
        });
    });
    it('returns other errors as Boom errors', () => {
        const error = new Error();
        expect(error).not.toHaveProperty('isBoom');
        expect(decorate_es_error_1.decorateEsError(error)).toBe(error);
        expect(error).toHaveProperty('isBoom');
    });
});
