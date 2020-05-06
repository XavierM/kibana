"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("./shared");
/* eslint-disable @typescript-eslint/camelcase */
exports.settings = (specService) => {
    specService.addEndpointDescription('put_settings', {
        data_autocomplete_rules: {
            refresh_interval: '1s',
            number_of_shards: 1,
            number_of_replicas: 1,
            'blocks.read_only': shared_1.BOOLEAN,
            'blocks.read': shared_1.BOOLEAN,
            'blocks.write': shared_1.BOOLEAN,
            'blocks.metadata': shared_1.BOOLEAN,
            term_index_interval: 32,
            term_index_divisor: 1,
            'translog.flush_threshold_ops': 5000,
            'translog.flush_threshold_size': '200mb',
            'translog.flush_threshold_period': '30m',
            'translog.disable_flush': shared_1.BOOLEAN,
            'cache.filter.max_size': '2gb',
            'cache.filter.expire': '2h',
            'gateway.snapshot_interval': '10s',
            routing: {
                allocation: {
                    include: {
                        tag: '',
                    },
                    exclude: {
                        tag: '',
                    },
                    require: {
                        tag: '',
                    },
                    total_shards_per_node: -1,
                },
            },
            'recovery.initial_shards': {
                __one_of: ['quorum', 'quorum-1', 'half', 'full', 'full-1'],
            },
            'ttl.disable_purge': shared_1.BOOLEAN,
            analysis: {
                analyzer: {},
                tokenizer: {},
                filter: {},
                char_filter: {},
            },
            'cache.query.enable': shared_1.BOOLEAN,
            shadow_replicas: shared_1.BOOLEAN,
            shared_filesystem: shared_1.BOOLEAN,
            data_path: 'path',
            codec: {
                __one_of: ['default', 'best_compression', 'lucene_default'],
            },
        },
    });
};
