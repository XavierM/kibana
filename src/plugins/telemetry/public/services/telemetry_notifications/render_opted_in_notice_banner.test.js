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
const render_opted_in_notice_banner_1 = require("./render_opted_in_notice_banner");
// eslint-disable-next-line @kbn/eslint/no-restricted-paths
const overlay_service_mock_1 = require("../../../../../core/public/overlays/overlay_service.mock");
describe('renderOptedInNoticeBanner', () => {
    it('adds a banner to banners with priority of 10000', () => {
        const bannerID = 'brucer-wayne';
        const overlays = overlay_service_mock_1.overlayServiceMock.createStartContract();
        overlays.banners.add.mockReturnValue(bannerID);
        const returnedBannerId = render_opted_in_notice_banner_1.renderOptedInNoticeBanner({
            onSeen: jest.fn(),
            overlays,
        });
        expect(overlays.banners.add).toBeCalledTimes(1);
        expect(returnedBannerId).toBe(bannerID);
        const bannerConfig = overlays.banners.add.mock.calls[0];
        expect(bannerConfig[0]).not.toBe(undefined);
        expect(bannerConfig[1]).toBe(10000);
    });
});
