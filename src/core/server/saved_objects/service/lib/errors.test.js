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
const errors_1 = require("./errors");
describe('savedObjectsClient/errorTypes', () => {
    describe('BadRequest error', () => {
        describe('createUnsupportedTypeError', () => {
            const errorObj = errors_1.SavedObjectsErrorHelpers.createUnsupportedTypeError('someType');
            it('should have the unsupported type message', () => {
                expect(errorObj).toHaveProperty('message', "Unsupported saved object type: 'someType': Bad Request");
            });
            it('has boom properties', () => {
                expect(errorObj).toHaveProperty('isBoom', true);
                expect(errorObj.output.payload).toMatchObject({
                    statusCode: 400,
                    message: "Unsupported saved object type: 'someType': Bad Request",
                    error: 'Bad Request',
                });
            });
            it("should be identified by 'isBadRequestError' method", () => {
                expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(errorObj)).toBeTruthy();
            });
        });
        describe('createBadRequestError', () => {
            const errorObj = errors_1.SavedObjectsErrorHelpers.createBadRequestError('test reason message');
            it('should create an appropriately structured error object', () => {
                expect(errorObj.message).toEqual('test reason message: Bad Request');
            });
            it("should be identified by 'isBadRequestError' method", () => {
                expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(errorObj)).toBeTruthy();
            });
            it('has boom properties', () => {
                expect(errorObj).toHaveProperty('isBoom', true);
                expect(errorObj.output.payload).toMatchObject({
                    statusCode: 400,
                    message: 'test reason message: Bad Request',
                    error: 'Bad Request',
                });
            });
        });
        describe('decorateBadRequestError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(error)).toBe(error);
            });
            it('makes the error identifiable as a BadRequest error', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(false);
                errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(error);
                expect(errors_1.SavedObjectsErrorHelpers.isBadRequestError(error)).toBe(true);
            });
            it('adds boom properties', () => {
                const error = errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(new Error());
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('defaults to message of error', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(new Error('foobar'));
                    expect(error.output.payload).toHaveProperty('message', 'foobar');
                });
                it('prefixes message with passed reason', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(new Error('foobar'), 'biz');
                    expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
                });
                it('sets statusCode to 400', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 400);
                });
                it('preserves boom properties of input', () => {
                    const error = boom_1.default.notFound();
                    errors_1.SavedObjectsErrorHelpers.decorateBadRequestError(error);
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
    describe('NotAuthorized error', () => {
        describe('decorateNotAuthorizedError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(error)).toBe(error);
            });
            it('makes the error identifiable as a NotAuthorized error', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.isNotAuthorizedError(error)).toBe(false);
                errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(error);
                expect(errors_1.SavedObjectsErrorHelpers.isNotAuthorizedError(error)).toBe(true);
            });
            it('adds boom properties', () => {
                const error = errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(new Error());
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('defaults to message of error', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(new Error('foobar'));
                    expect(error.output.payload).toHaveProperty('message', 'foobar');
                });
                it('prefixes message with passed reason', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(new Error('foobar'), 'biz');
                    expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
                });
                it('sets statusCode to 401', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 401);
                });
                it('preserves boom properties of input', () => {
                    const error = boom_1.default.notFound();
                    errors_1.SavedObjectsErrorHelpers.decorateNotAuthorizedError(error);
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
    describe('Forbidden error', () => {
        describe('decorateForbiddenError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(error)).toBe(error);
            });
            it('makes the error identifiable as a Forbidden error', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.isForbiddenError(error)).toBe(false);
                errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(error);
                expect(errors_1.SavedObjectsErrorHelpers.isForbiddenError(error)).toBe(true);
            });
            it('adds boom properties', () => {
                const error = errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(new Error());
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('defaults to message of error', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(new Error('foobar'));
                    expect(error.output.payload).toHaveProperty('message', 'foobar');
                });
                it('prefixes message with passed reason', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(new Error('foobar'), 'biz');
                    expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
                });
                it('sets statusCode to 403', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 403);
                });
                it('preserves boom properties of input', () => {
                    const error = boom_1.default.notFound();
                    errors_1.SavedObjectsErrorHelpers.decorateForbiddenError(error);
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
    describe('NotFound error', () => {
        describe('createGenericNotFoundError', () => {
            it('makes an error identifiable as a NotFound error', () => {
                const error = errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError();
                expect(errors_1.SavedObjectsErrorHelpers.isNotFoundError(error)).toBe(true);
            });
            it('returns a boom error', () => {
                const error = errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError();
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('Uses "Not Found" message', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError();
                    expect(error.output.payload).toHaveProperty('message', 'Not Found');
                });
                it('sets statusCode to 404', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.createGenericNotFoundError();
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
    describe('Conflict error', () => {
        describe('decorateConflictError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.decorateConflictError(error)).toBe(error);
            });
            it('makes the error identifiable as a Conflict error', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.isConflictError(error)).toBe(false);
                errors_1.SavedObjectsErrorHelpers.decorateConflictError(error);
                expect(errors_1.SavedObjectsErrorHelpers.isConflictError(error)).toBe(true);
            });
            it('adds boom properties', () => {
                const error = errors_1.SavedObjectsErrorHelpers.decorateConflictError(new Error());
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('defaults to message of error', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateConflictError(new Error('foobar'));
                    expect(error.output.payload).toHaveProperty('message', 'foobar');
                });
                it('prefixes message with passed reason', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateConflictError(new Error('foobar'), 'biz');
                    expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
                });
                it('sets statusCode to 409', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateConflictError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 409);
                });
                it('preserves boom properties of input', () => {
                    const error = boom_1.default.notFound();
                    errors_1.SavedObjectsErrorHelpers.decorateConflictError(error);
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
    describe('EsCannotExecuteScript error', () => {
        describe('decorateEsCannotExecuteScriptError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(error)).toBe(error);
            });
            it('makes the error identifiable as a EsCannotExecuteScript error', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.isEsCannotExecuteScriptError(error)).toBe(false);
                errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(error);
                expect(errors_1.SavedObjectsErrorHelpers.isEsCannotExecuteScriptError(error)).toBe(true);
            });
            it('adds boom properties', () => {
                const error = errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(new Error());
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('defaults to message of error', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(new Error('foobar'));
                    expect(error.output.payload).toHaveProperty('message', 'foobar');
                });
                it('prefixes message with passed reason', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(new Error('foobar'), 'biz');
                    expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
                });
                it('sets statusCode to 501', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 400);
                });
                it('preserves boom properties of input', () => {
                    const error = boom_1.default.notFound();
                    errors_1.SavedObjectsErrorHelpers.decorateEsCannotExecuteScriptError(error);
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
    describe('EsUnavailable error', () => {
        describe('decorateEsUnavailableError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(error)).toBe(error);
            });
            it('makes the error identifiable as a EsUnavailable error', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(false);
                errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(error);
                expect(errors_1.SavedObjectsErrorHelpers.isEsUnavailableError(error)).toBe(true);
            });
            it('adds boom properties', () => {
                const error = errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(new Error());
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('defaults to message of error', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(new Error('foobar'));
                    expect(error.output.payload).toHaveProperty('message', 'foobar');
                });
                it('prefixes message with passed reason', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(new Error('foobar'), 'biz');
                    expect(error.output.payload).toHaveProperty('message', 'biz: foobar');
                });
                it('sets statusCode to 503', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 503);
                });
                it('preserves boom properties of input', () => {
                    const error = boom_1.default.notFound();
                    errors_1.SavedObjectsErrorHelpers.decorateEsUnavailableError(error);
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
    describe('General error', () => {
        describe('decorateGeneralError', () => {
            it('returns original object', () => {
                const error = new Error();
                expect(errors_1.SavedObjectsErrorHelpers.decorateGeneralError(error)).toBe(error);
            });
            it('adds boom properties', () => {
                const error = errors_1.SavedObjectsErrorHelpers.decorateGeneralError(new Error());
                expect(error).toHaveProperty('isBoom', true);
            });
            describe('error.output', () => {
                it('ignores error message', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateGeneralError(new Error('foobar'));
                    expect(error.output.payload.message).toMatch(/internal server error/i);
                });
                it('sets statusCode to 500', () => {
                    const error = errors_1.SavedObjectsErrorHelpers.decorateGeneralError(new Error('foo'));
                    expect(error.output).toHaveProperty('statusCode', 500);
                });
                it('preserves boom properties of input', () => {
                    const error = boom_1.default.notFound();
                    errors_1.SavedObjectsErrorHelpers.decorateGeneralError(error);
                    expect(error.output).toHaveProperty('statusCode', 404);
                });
            });
        });
    });
});
