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
const field_format_editors_1 = require("ui/registry/field_format_editors");
const bytes_1 = require("./editors/bytes");
const color_1 = require("./editors/color");
const date_1 = require("./editors/date");
const date_nanos_1 = require("./editors/date_nanos");
const duration_1 = require("./editors/duration");
const number_1 = require("./editors/number");
const percent_1 = require("./editors/percent");
const static_lookup_1 = require("./editors/static_lookup");
const string_1 = require("./editors/string");
const truncate_1 = require("./editors/truncate");
const url_1 = require("./editors/url/url");
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => bytes_1.BytesFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => color_1.ColorFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => date_1.DateFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => date_nanos_1.DateNanosFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => duration_1.DurationFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => number_1.NumberFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => percent_1.PercentFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => static_lookup_1.StaticLookupFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => string_1.StringFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => truncate_1.TruncateFormatEditor);
field_format_editors_1.RegistryFieldFormatEditorsProvider.register(() => url_1.UrlFormatEditor);
