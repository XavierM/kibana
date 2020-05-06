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
const i18n_1 = require("@kbn/i18n");
// @ts-ignore
const obj_define_1 = require("./obj_define");
const services_1 = require("../../services");
const common_1 = require("../../../common");
const utils_1 = require("../../../common/utils");
class Field {
    constructor(indexPattern, spec, shortDotsEnable = false) {
        // unwrap old instances of Field
        if (spec instanceof Field)
            spec = spec.$$spec;
        // construct this object using ObjDefine class, which
        // extends the Field.prototype but gets it's properties
        // defined using the logic below
        const obj = new obj_define_1.ObjDefine(spec, Field.prototype);
        if (spec.name === '_source') {
            spec.type = '_source';
        }
        // find the type for this field, fallback to unknown type
        let type = common_1.getKbnFieldType(spec.type);
        if (spec.type && !type) {
            const title = i18n_1.i18n.translate('data.indexPatterns.unknownFieldHeader', {
                values: { type: spec.type },
                defaultMessage: 'Unknown field type {type}',
            });
            const text = i18n_1.i18n.translate('data.indexPatterns.unknownFieldErrorMessage', {
                values: { name: spec.name, title: indexPattern.title },
                defaultMessage: 'Field {name} in indexPattern {title} is using an unknown field type.',
            });
            const { toasts } = services_1.getNotifications();
            toasts.addDanger({
                title,
                text,
            });
        }
        if (!type)
            type = common_1.getKbnFieldType('unknown');
        let format = spec.format;
        if (!common_1.FieldFormat.isInstanceOfFieldFormat(format)) {
            const fieldFormatsService = services_1.getFieldFormats();
            format =
                indexPattern.fieldFormatMap[spec.name] ||
                    fieldFormatsService.getDefaultInstance(spec.type, spec.esTypes);
        }
        const indexed = !!spec.indexed;
        const scripted = !!spec.scripted;
        const searchable = !!spec.searchable || scripted;
        const aggregatable = !!spec.aggregatable || scripted;
        const readFromDocValues = !!spec.readFromDocValues && !scripted;
        const sortable = spec.name === '_score' || ((indexed || aggregatable) && type && type.sortable);
        const filterable = spec.name === '_id' || scripted || ((indexed || searchable) && type && type.filterable);
        const visualizable = aggregatable;
        this.name = '';
        obj.fact('name');
        this.type = '';
        obj.fact('type');
        obj.fact('esTypes');
        obj.writ('count', spec.count || 0);
        // scripted objs
        obj.fact('scripted', scripted);
        obj.writ('script', scripted ? spec.script : null);
        obj.writ('lang', scripted ? spec.lang || 'painless' : null);
        // stats
        obj.fact('searchable', searchable);
        obj.fact('aggregatable', aggregatable);
        obj.fact('readFromDocValues', readFromDocValues);
        // usage flags, read-only and won't be saved
        obj.comp('format', format);
        obj.comp('sortable', sortable);
        obj.comp('filterable', filterable);
        obj.comp('visualizable', visualizable);
        // computed values
        obj.comp('indexPattern', indexPattern);
        obj.comp('displayName', shortDotsEnable ? utils_1.shortenDottedString(spec.name) : spec.name);
        this.$$spec = spec;
        obj.comp('$$spec', spec);
        // conflict info
        obj.writ('conflictDescriptions');
        // multi info
        obj.fact('subType');
        return obj.create();
    }
}
exports.Field = Field;
