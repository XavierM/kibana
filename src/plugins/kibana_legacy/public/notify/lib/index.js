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
var format_es_msg_1 = require("./format_es_msg");
exports.formatESMsg = format_es_msg_1.formatESMsg;
var format_msg_1 = require("./format_msg");
exports.formatMsg = format_msg_1.formatMsg;
var format_stack_1 = require("./format_stack");
exports.formatStack = format_stack_1.formatStack;
var format_angular_http_error_1 = require("./format_angular_http_error");
exports.isAngularHttpError = format_angular_http_error_1.isAngularHttpError;
exports.formatAngularHttpError = format_angular_http_error_1.formatAngularHttpError;
var add_fatal_error_1 = require("./add_fatal_error");
exports.addFatalError = add_fatal_error_1.addFatalError;
