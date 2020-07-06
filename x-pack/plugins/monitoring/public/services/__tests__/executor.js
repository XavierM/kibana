/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import ngMock from 'ng_mock';
import expect from '@kbn/expect';
import sinon from 'sinon';
import { executorProvider } from '../executor';
import Bluebird from 'bluebird';
import { Legacy } from '../../legacy_shims';
import { dataPluginMock } from '../../../../../../src/plugins/data/public/mocks';

describe('$executor service', () => {
  let scope;
  let executor;
  let $timeout;
  let timefilter;

  beforeEach(() => {
    const data = dataPluginMock.createStartContract();
    Legacy._shims = { timefilter };
    timefilter = data.query.timefilter.timefilter;
  });

  beforeEach(ngMock.module('kibana'));

  beforeEach(
    ngMock.inject(function (_$rootScope_) {
      scope = _$rootScope_.$new();
    })
  );

  beforeEach(() => {
    $timeout = sinon.spy(setTimeout);
    $timeout.cancel = (id) => clearTimeout(id);

    timefilter.setRefreshInterval({
      value: 0,
    });

    executor = executorProvider(Bluebird, $timeout);
  });

  afterEach(() => executor.destroy());

  it('should not call $timeout if the timefilter is not paused and set to zero', () => {
    executor.start(scope);
    expect($timeout.callCount).to.equal(0);
  });

  it('should call $timeout if the timefilter is not paused and set to 1000ms', () => {
    timefilter.setRefreshInterval({
      pause: false,
      value: 1000,
    });
    executor.start(scope);
    expect($timeout.callCount).to.equal(1);
  });

  it('should execute function if timefilter is not paused and interval set to 1000ms', (done) => {
    timefilter.setRefreshInterval({
      pause: false,
      value: 1000,
    });
    executor.register({ execute: () => Bluebird.resolve().then(() => done(), done) });
    executor.start(scope);
  });

  it('should execute function multiple times', (done) => {
    let calls = 0;
    timefilter.setRefreshInterval({
      pause: false,
      value: 10,
    });
    executor.register({
      execute: () => {
        if (calls++ > 1) {
          done();
        }
        return Bluebird.resolve();
      },
    });
    executor.start(scope);
  });

  it('should call handleResponse', (done) => {
    timefilter.setRefreshInterval({
      pause: false,
      value: 10,
    });
    executor.register({
      execute: () => Bluebird.resolve(),
      handleResponse: () => done(),
    });
    executor.start(scope);
  });

  it('should call handleError', (done) => {
    timefilter.setRefreshInterval({
      pause: false,
      value: 10,
    });
    executor.register({
      execute: () => Bluebird.reject(new Error('reject test')),
      handleError: () => done(),
    });
    executor.start(scope);
  });
});
