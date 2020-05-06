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
/* eslint-disable @typescript-eslint/camelcase */
exports.regexpTemplate = {
    FIELD: 'REGEXP',
};
exports.fuzzyTemplate = {
    FIELD: {},
};
exports.prefixTemplate = {
    FIELD: {
        value: '',
    },
};
exports.rangeTemplate = {
    FIELD: {
        gte: 10,
        lte: 20,
    },
};
exports.spanFirstTemplate = {
    match: {
        span_term: {
            FIELD: 'VALUE',
        },
    },
    end: 3,
};
exports.spanNearTemplate = {
    clauses: [
        {
            span_term: {
                FIELD: {
                    value: 'VALUE',
                },
            },
        },
    ],
    slop: 12,
    in_order: false,
};
exports.spanTermTemplate = {
    FIELD: {
        value: 'VALUE',
    },
};
exports.spanNotTemplate = {
    include: {
        span_term: {
            FIELD: {
                value: 'VALUE',
            },
        },
    },
    exclude: {
        span_term: {
            FIELD: {
                value: 'VALUE',
            },
        },
    },
};
exports.spanOrTemplate = {
    clauses: [
        {
            span_term: {
                FIELD: {
                    value: 'VALUE',
                },
            },
        },
    ],
};
exports.spanContainingTemplate = {
    little: {
        span_term: {
            FIELD: {
                value: 'VALUE',
            },
        },
    },
    big: {
        span_near: {
            clauses: [
                {
                    span_term: {
                        FIELD: {
                            value: 'VALUE',
                        },
                    },
                },
                {
                    span_term: {
                        FIELD: {
                            value: 'VALUE',
                        },
                    },
                },
            ],
            slop: 5,
            in_order: false,
        },
    },
};
exports.spanWithinTemplate = {
    little: {
        span_term: {
            FIELD: {
                value: 'VALUE',
            },
        },
    },
    big: {
        span_near: {
            clauses: [
                {
                    span_term: {
                        FIELD: {
                            value: 'VALUE',
                        },
                    },
                },
                {
                    span_term: {
                        FIELD: {
                            value: 'VALUE',
                        },
                    },
                },
            ],
            slop: 5,
            in_order: false,
        },
    },
};
exports.wildcardTemplate = {
    FIELD: {
        value: 'VALUE',
    },
};
