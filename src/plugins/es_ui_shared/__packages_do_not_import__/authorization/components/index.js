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
var authorization_provider_1 = require("./authorization_provider");
exports.AuthorizationProvider = authorization_provider_1.AuthorizationProvider;
exports.AuthorizationContext = authorization_provider_1.AuthorizationContext;
exports.useAuthorizationContext = authorization_provider_1.useAuthorizationContext;
var with_privileges_1 = require("./with_privileges");
exports.WithPrivileges = with_privileges_1.WithPrivileges;
var not_authorized_section_1 = require("./not_authorized_section");
exports.NotAuthorizedSection = not_authorized_section_1.NotAuthorizedSection;
var section_error_1 = require("./section_error");
exports.SectionError = section_error_1.SectionError;
