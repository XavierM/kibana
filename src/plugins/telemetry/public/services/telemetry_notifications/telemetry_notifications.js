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
const render_opt_in_banner_1 = require("./render_opt_in_banner");
class TelemetryNotifications {
    constructor({ overlays, telemetryService }) {
        this.shouldShowOptedInNoticeBanner = () => {
            const userHasSeenOptedInNotice = this.telemetryService.getUserHasSeenOptedInNotice();
            const bannerOnScreen = typeof this.optedInNoticeBannerId !== 'undefined';
            return !bannerOnScreen && userHasSeenOptedInNotice;
        };
        this.renderOptedInNoticeBanner = () => {
            const bannerId = render_opted_in_notice_banner_1.renderOptedInNoticeBanner({
                onSeen: this.setOptedInNoticeSeen,
                overlays: this.overlays,
            });
            this.optedInNoticeBannerId = bannerId;
        };
        this.shouldShowOptInBanner = () => {
            const isOptedIn = this.telemetryService.getIsOptedIn();
            const bannerOnScreen = typeof this.optInBannerId !== 'undefined';
            return !bannerOnScreen && isOptedIn === null;
        };
        this.renderOptInBanner = () => {
            const bannerId = render_opt_in_banner_1.renderOptInBanner({
                setOptIn: this.onSetOptInClick,
                overlays: this.overlays,
            });
            this.optInBannerId = bannerId;
        };
        this.onSetOptInClick = async (isOptIn) => {
            if (this.optInBannerId) {
                this.overlays.banners.remove(this.optInBannerId);
                this.optInBannerId = undefined;
            }
            await this.telemetryService.setOptIn(isOptIn);
        };
        this.setOptedInNoticeSeen = async () => {
            if (this.optedInNoticeBannerId) {
                this.overlays.banners.remove(this.optedInNoticeBannerId);
                this.optedInNoticeBannerId = undefined;
            }
            await this.telemetryService.setUserHasSeenNotice();
        };
        this.telemetryService = telemetryService;
        this.overlays = overlays;
    }
}
exports.TelemetryNotifications = TelemetryNotifications;
