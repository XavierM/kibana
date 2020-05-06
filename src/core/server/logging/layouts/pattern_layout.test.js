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
const strip_ansi_snapshot_serializer_1 = require("../../../test_helpers/strip_ansi_snapshot_serializer");
const log_level_1 = require("../log_level");
const pattern_layout_1 = require("./pattern_layout");
const timestamp = new Date(Date.UTC(2012, 1, 1, 14, 30, 22, 11));
const records = [
    {
        context: 'context-1',
        error: {
            message: 'Some error message',
            name: 'Some error name',
            stack: 'Some error stack',
        },
        level: log_level_1.LogLevel.Fatal,
        message: 'message-1',
        timestamp,
        pid: 5355,
    },
    {
        context: 'context-2',
        level: log_level_1.LogLevel.Error,
        message: 'message-2',
        timestamp,
        pid: 5355,
    },
    {
        context: 'context-3',
        level: log_level_1.LogLevel.Warn,
        message: 'message-3',
        timestamp,
        pid: 5355,
    },
    {
        context: 'context-4',
        level: log_level_1.LogLevel.Debug,
        message: 'message-4',
        timestamp,
        pid: 5355,
    },
    {
        context: 'context-5',
        level: log_level_1.LogLevel.Info,
        message: 'message-5',
        timestamp,
        pid: 5355,
    },
    {
        context: 'context-6',
        level: log_level_1.LogLevel.Trace,
        message: 'message-6',
        timestamp,
        pid: 5355,
    },
];
expect.addSnapshotSerializer(strip_ansi_snapshot_serializer_1.stripAnsiSnapshotSerializer);
test('`createConfigSchema()` creates correct schema.', () => {
    const layoutSchema = pattern_layout_1.PatternLayout.configSchema;
    const validConfigWithOptional = { kind: 'pattern' };
    expect(layoutSchema.validate(validConfigWithOptional)).toEqual({
        highlight: undefined,
        kind: 'pattern',
        pattern: undefined,
    });
    const validConfig = {
        highlight: true,
        kind: 'pattern',
        pattern: '%message',
    };
    expect(layoutSchema.validate(validConfig)).toEqual({
        highlight: true,
        kind: 'pattern',
        pattern: '%message',
    });
    const wrongConfig1 = { kind: 'json' };
    expect(() => layoutSchema.validate(wrongConfig1)).toThrow();
    const wrongConfig2 = { kind: 'pattern', pattern: 1 };
    expect(() => layoutSchema.validate(wrongConfig2)).toThrow();
});
test('`format()` correctly formats record with full pattern.', () => {
    const layout = new pattern_layout_1.PatternLayout();
    for (const record of records) {
        expect(layout.format(record)).toMatchSnapshot();
    }
});
test('`format()` correctly formats record with custom pattern.', () => {
    const layout = new pattern_layout_1.PatternLayout('mock-%message-%logger-%message');
    for (const record of records) {
        expect(layout.format(record)).toMatchSnapshot();
    }
});
test('`format()` correctly formats record with meta data.', () => {
    const layout = new pattern_layout_1.PatternLayout();
    expect(layout.format({
        context: 'context-meta',
        level: log_level_1.LogLevel.Debug,
        message: 'message-meta',
        timestamp,
        pid: 5355,
        meta: {
            from: 'v7',
            to: 'v8',
        },
    })).toBe('[2012-02-01T14:30:22.011Z][DEBUG][context-meta]{"from":"v7","to":"v8"} message-meta');
    expect(layout.format({
        context: 'context-meta',
        level: log_level_1.LogLevel.Debug,
        message: 'message-meta',
        timestamp,
        pid: 5355,
        meta: {},
    })).toBe('[2012-02-01T14:30:22.011Z][DEBUG][context-meta]{} message-meta');
    expect(layout.format({
        context: 'context-meta',
        level: log_level_1.LogLevel.Debug,
        message: 'message-meta',
        timestamp,
        pid: 5355,
    })).toBe('[2012-02-01T14:30:22.011Z][DEBUG][context-meta] message-meta');
});
test('`format()` correctly formats record with highlighting.', () => {
    const layout = new pattern_layout_1.PatternLayout(undefined, true);
    for (const record of records) {
        expect(layout.format(record)).toMatchSnapshot();
    }
});
test('allows specifying the PID in custom pattern', () => {
    const layout = new pattern_layout_1.PatternLayout('%pid-%logger-%message');
    for (const record of records) {
        expect(layout.format(record)).toMatchSnapshot();
    }
});
test('`format()` allows specifying pattern with meta.', () => {
    const layout = new pattern_layout_1.PatternLayout('%logger-%meta-%message');
    const record = {
        context: 'context',
        level: log_level_1.LogLevel.Debug,
        message: 'message',
        timestamp,
        pid: 5355,
        meta: {
            from: 'v7',
            to: 'v8',
        },
    };
    expect(layout.format(record)).toBe('context-{"from":"v7","to":"v8"}-message');
});
describe('format', () => {
    describe('timestamp', () => {
        const record = {
            context: 'context',
            level: log_level_1.LogLevel.Debug,
            message: 'message',
            timestamp,
            pid: 5355,
        };
        it('uses ISO8601 as default', () => {
            const layout = new pattern_layout_1.PatternLayout();
            expect(layout.format(record)).toBe('[2012-02-01T14:30:22.011Z][DEBUG][context] message');
        });
        describe('supports specifying a predefined format', () => {
            it('ISO8601', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{ISO8601}][%logger]');
                expect(layout.format(record)).toBe('[2012-02-01T14:30:22.011Z][context]');
            });
            it('ISO8601_TZ', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{ISO8601_TZ}][%logger]');
                expect(layout.format(record)).toBe('[2012-02-01T09:30:22.011-05:00][context]');
            });
            it('ABSOLUTE', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{ABSOLUTE}][%logger]');
                expect(layout.format(record)).toBe('[09:30:22.011][context]');
            });
            it('UNIX', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{UNIX}][%logger]');
                expect(layout.format(record)).toBe('[1328106622][context]');
            });
            it('UNIX_MILLIS', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{UNIX_MILLIS}][%logger]');
                expect(layout.format(record)).toBe('[1328106622011][context]');
            });
        });
        describe('supports specifying a predefined format and timezone', () => {
            it('ISO8601', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{ISO8601}{America/Los_Angeles}][%logger]');
                expect(layout.format(record)).toBe('[2012-02-01T14:30:22.011Z][context]');
            });
            it('ISO8601_TZ', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{ISO8601_TZ}{America/Los_Angeles}][%logger]');
                expect(layout.format(record)).toBe('[2012-02-01T06:30:22.011-08:00][context]');
            });
            it('ABSOLUTE', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{ABSOLUTE}{America/Los_Angeles}][%logger]');
                expect(layout.format(record)).toBe('[06:30:22.011][context]');
            });
            it('UNIX', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{UNIX}{America/Los_Angeles}][%logger]');
                expect(layout.format(record)).toBe('[1328106622][context]');
            });
            it('UNIX_MILLIS', () => {
                const layout = new pattern_layout_1.PatternLayout('[%date{UNIX_MILLIS}{America/Los_Angeles}][%logger]');
                expect(layout.format(record)).toBe('[1328106622011][context]');
            });
        });
        it('formats several conversions patterns correctly', () => {
            const layout = new pattern_layout_1.PatternLayout('[%date{ABSOLUTE}{America/Los_Angeles}][%logger][%date{UNIX}]');
            expect(layout.format(record)).toBe('[06:30:22.011][context][1328106622]');
        });
    });
});
describe('schema', () => {
    describe('pattern', () => {
        describe('%date', () => {
            it('does not fail when %date not present', () => {
                expect(pattern_layout_1.patternSchema.validate('')).toBe('');
                expect(pattern_layout_1.patternSchema.validate('{pid}')).toBe('{pid}');
            });
            it('does not fail on %date without params', () => {
                expect(pattern_layout_1.patternSchema.validate('%date')).toBe('%date');
                expect(pattern_layout_1.patternSchema.validate('%date')).toBe('%date');
                expect(pattern_layout_1.patternSchema.validate('{%date}')).toBe('{%date}');
                expect(pattern_layout_1.patternSchema.validate('%date%date')).toBe('%date%date');
            });
            it('does not fail on %date with predefined date format', () => {
                expect(pattern_layout_1.patternSchema.validate('%date{ISO8601}')).toBe('%date{ISO8601}');
            });
            it('does not fail on %date with predefined date format and valid timezone', () => {
                expect(pattern_layout_1.patternSchema.validate('%date{ISO8601_TZ}{Europe/Berlin}')).toBe('%date{ISO8601_TZ}{Europe/Berlin}');
            });
            it('fails on %date with unknown date format', () => {
                expect(() => pattern_layout_1.patternSchema.validate('%date{HH:MM:SS}')).toThrowErrorMatchingInlineSnapshot(`"Date format expected one of ISO8601, ISO8601_TZ, ABSOLUTE, UNIX, UNIX_MILLIS, but given: HH:MM:SS"`);
            });
            it('fails on %date with predefined date format and invalid timezone', () => {
                expect(() => pattern_layout_1.patternSchema.validate('%date{ISO8601_TZ}{Europe/Kibana}')).toThrowErrorMatchingInlineSnapshot(`"Unknown timezone: Europe/Kibana"`);
            });
            it('validates several %date in pattern', () => {
                expect(() => pattern_layout_1.patternSchema.validate('%date{ISO8601_TZ}{Europe/Berlin}%message%date{HH}')).toThrowErrorMatchingInlineSnapshot(`"Date format expected one of ISO8601, ISO8601_TZ, ABSOLUTE, UNIX, UNIX_MILLIS, but given: HH"`);
            });
        });
    });
});
