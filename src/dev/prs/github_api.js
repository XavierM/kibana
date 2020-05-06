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
const axios_1 = tslib_1.__importDefault(require("axios"));
const dev_utils_1 = require("@kbn/dev-utils");
const isResponseError = (error) => error && error.response && error.response.status;
const isRateLimitError = (error) => isResponseError(error) &&
    error.response.status === 403 &&
    `${error.response.headers['X-RateLimit-Remaining']}` === '0';
class GithubApi {
    constructor(accessToken) {
        this.accessToken = accessToken;
        this.api = axios_1.default.create({
            baseURL: 'https://api.github.com/',
            headers: {
                Accept: 'application/vnd.github.v3+json',
                'User-Agent': 'kibana/update_prs_cli',
                ...(this.accessToken ? { Authorization: `token ${this.accessToken} ` } : {}),
            },
        });
    }
    async getPrInfo(prNumber) {
        try {
            const resp = await this.api.get(`repos/elastic/kibana/pulls/${prNumber}`);
            const targetRef = resp.data.base && resp.data.base.ref;
            if (!targetRef) {
                throw new Error('unable to read base ref from pr info');
            }
            const owner = resp.data.head && resp.data.head.user && resp.data.head.user.login;
            if (!owner) {
                throw new Error('unable to read owner info from pr info');
            }
            const sourceBranch = resp.data.head.ref;
            if (!sourceBranch) {
                throw new Error('unable to read source branch name from pr info');
            }
            return {
                targetRef,
                owner,
                sourceBranch,
            };
        }
        catch (error) {
            if (!isRateLimitError(error)) {
                throw error;
            }
            throw dev_utils_1.createFailError('github rate limit exceeded, please specify the `--access-token` command line flag and try again');
        }
    }
}
exports.GithubApi = GithubApi;
