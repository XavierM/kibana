"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shardFailureResponse = {
    _shards: {
        total: 2,
        successful: 1,
        skipped: 0,
        failed: 1,
        failures: [
            {
                shard: 0,
                index: 'repro2',
                node: 'itsmeyournode',
                reason: {
                    type: 'script_exception',
                    reason: 'runtime error',
                    script_stack: ["return doc['targetfield'].value;", '           ^---- HERE'],
                    script: "return doc['targetfield'].value;",
                    lang: 'painless',
                    caused_by: {
                        type: 'illegal_argument_exception',
                        reason: 'Gimme reason',
                    },
                },
            },
        ],
    },
};
