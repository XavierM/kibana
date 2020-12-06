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

import execa from 'execa';

import { REPO_ROOT } from '@kbn/utils';

// Retrieves the correct location for the .git dir for
// every git setup (including git worktree)
export async function getGitDir() {
  return (
    await execa('git', ['rev-parse', '--git-common-dir'], {
      cwd: REPO_ROOT,
    })
  ).stdout.trim();
}

// Checks if a correct git version is installed
export async function isCorrectGitVersionInstalled() {
  const rawGitVersionStr = (
    await execa('git', ['--version'], {
      cwd: REPO_ROOT,
    })
  ).stdout.trim();

  const match = rawGitVersionStr.match(/[0-9]+(\.[0-9]+)+/);
  if (!match) {
    return false;
  }

  const [major, minor] = match[0].split('.').map((n) => parseInt(n, 10));
  return major > 2 || (major === 2 && minor >= 5);
}
