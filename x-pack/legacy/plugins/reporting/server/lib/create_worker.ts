/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { ElasticsearchServiceSetup } from 'kibana/server';
import { PLUGIN_ID } from '../../common/constants';
import { ExportTypesRegistry, HeadlessChromiumDriverFactory } from '../../types';
import { CancellationToken } from '../../common/cancellation_token';
import {
  ESQueueInstance,
  QueueConfig,
  ExportTypeDefinition,
  ESQueueWorkerExecuteFn,
  JobDocPayload,
  ImmediateExecuteFn,
  JobSource,
  RequestFacade,
  ServerFacade,
  Logger,
} from '../../types';
// @ts-ignore untyped dependency
import { events as esqueueEvents } from './esqueue';

interface CreateWorkerFactoryOpts {
  exportTypesRegistry: ExportTypesRegistry;
  browserDriverFactory: HeadlessChromiumDriverFactory;
}

export function createWorkerFactory<JobParamsType>(
  server: ServerFacade,
  elasticsearch: ElasticsearchServiceSetup,
  logger: Logger,
  { exportTypesRegistry, browserDriverFactory }: CreateWorkerFactoryOpts
) {
  type JobDocPayloadType = JobDocPayload<JobParamsType>;
  const config = server.config();
  const queueConfig: QueueConfig = config.get('xpack.reporting.queue');
  const kibanaName: string = config.get('server.name');
  const kibanaId: string = config.get('server.uuid');

  // Once more document types are added, this will need to be passed in
  return function createWorker(queue: ESQueueInstance<JobParamsType, JobDocPayloadType>) {
    // export type / execute job map
    const jobExecutors: Map<
      string,
      ImmediateExecuteFn<JobParamsType> | ESQueueWorkerExecuteFn<JobDocPayloadType>
    > = new Map();

    for (const exportType of exportTypesRegistry.getAll() as Array<
      ExportTypeDefinition<JobParamsType, any, any, any>
    >) {
      // TODO: the executeJobFn should be unwrapped in the register method of the export types registry
      const jobExecutor = exportType.executeJobFactory(server, elasticsearch, logger, {
        browserDriverFactory,
      });
      jobExecutors.set(exportType.jobType, jobExecutor);
    }

    const workerFn = (jobSource: JobSource<JobParamsType>, ...workerRestArgs: any[]) => {
      const {
        _id: jobId,
        _source: { jobtype: jobType },
      } = jobSource;

      const jobTypeExecutor = jobExecutors.get(jobType);
      // pass the work to the jobExecutor
      if (!jobTypeExecutor) {
        throw new Error(`Unable to find a job executor for the claimed job: [${jobId}]`);
      }

      if (jobId) {
        const jobExecutorWorker = jobTypeExecutor as ESQueueWorkerExecuteFn<JobDocPayloadType>;
        return jobExecutorWorker(
          jobId,
          ...(workerRestArgs as [JobDocPayloadType, CancellationToken])
        );
      } else {
        const jobExecutorImmediate = jobExecutors.get(jobType) as ImmediateExecuteFn<JobParamsType>;
        return jobExecutorImmediate(
          null,
          ...(workerRestArgs as [JobDocPayload<JobParamsType>, RequestFacade])
        );
      }
    };

    const workerOptions = {
      kibanaName,
      kibanaId,
      interval: queueConfig.pollInterval,
      intervalErrorMultiplier: queueConfig.pollIntervalErrorMultiplier,
    };
    const worker = queue.registerWorker(PLUGIN_ID, workerFn, workerOptions);

    worker.on(esqueueEvents.EVENT_WORKER_COMPLETE, (res: any) => {
      logger.debug(`Worker completed: (${res.job.id})`);
    });
    worker.on(esqueueEvents.EVENT_WORKER_JOB_EXECUTION_ERROR, (res: any) => {
      logger.debug(`Worker error: (${res.job.id})`);
    });
    worker.on(esqueueEvents.EVENT_WORKER_JOB_TIMEOUT, (res: any) => {
      logger.debug(`Job timeout exceeded: (${res.job.id})`);
    });
  };
}
