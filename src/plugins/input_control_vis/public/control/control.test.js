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
const tslib_1 = require("tslib");
const expect_1 = tslib_1.__importDefault(require("@kbn/expect"));
const control_1 = require("./control");
function createControlParams(id, label) {
    return {
        id,
        options: {},
        label,
    };
}
let valueFromFilterBar;
const mockFilterManager = {
    getValueFromFilterBar: () => {
        return valueFromFilterBar;
    },
    createFilter: (value) => {
        return `mockKbnFilter:${value}`;
    },
    getIndexPattern: () => {
        return 'mockIndexPattern';
    },
};
class ControlMock extends control_1.Control {
    fetch() {
        return Promise.resolve();
    }
    destroy() { }
}
describe('hasChanged', () => {
    let control;
    beforeEach(() => {
        control = new ControlMock(createControlParams('3', 'control'), mockFilterManager, false);
    });
    afterEach(() => {
        valueFromFilterBar = undefined;
    });
    test('should be false if value has not changed', () => {
        expect_1.default(control.hasChanged()).to.be(false);
    });
    test('should be true if value has been set', () => {
        control.set('new value');
        expect_1.default(control.hasChanged()).to.be(true);
    });
    test('should be false if value has been set and control is cleared', () => {
        control.set('new value');
        control.clear();
        expect_1.default(control.hasChanged()).to.be(false);
    });
});
describe('ancestors', () => {
    let grandParentControl;
    let parentControl;
    let childControl;
    beforeEach(() => {
        grandParentControl = new ControlMock(createControlParams('1', 'grandparent control'), mockFilterManager, false);
        parentControl = new ControlMock(createControlParams('2', 'parent control'), mockFilterManager, false);
        childControl = new ControlMock(createControlParams('3', 'child control'), mockFilterManager, false);
    });
    describe('hasUnsetAncestor', () => {
        test('should be true if parent is not set', function () {
            grandParentControl.set('myGrandParentValue');
            childControl.setAncestors([parentControl, grandParentControl]);
            expect_1.default(grandParentControl.hasValue()).to.be(true);
            expect_1.default(parentControl.hasValue()).to.be(false);
            expect_1.default(childControl.hasUnsetAncestor()).to.be(true);
        });
        test('should be true if grand parent is not set', function () {
            parentControl.set('myParentValue');
            childControl.setAncestors([parentControl, grandParentControl]);
            expect_1.default(grandParentControl.hasValue()).to.be(false);
            expect_1.default(parentControl.hasValue()).to.be(true);
            expect_1.default(childControl.hasUnsetAncestor()).to.be(true);
        });
        test('should be false if all ancestors are set', function () {
            grandParentControl.set('myGrandParentValue');
            parentControl.set('myParentValue');
            childControl.setAncestors([parentControl, grandParentControl]);
            expect_1.default(grandParentControl.hasValue()).to.be(true);
            expect_1.default(parentControl.hasValue()).to.be(true);
            expect_1.default(childControl.hasUnsetAncestor()).to.be(false);
        });
    });
    describe('getAncestorValues', () => {
        let lastAncestorValues;
        beforeEach(() => {
            grandParentControl.set('myGrandParentValue');
            parentControl.set('myParentValue');
            childControl.setAncestors([parentControl, grandParentControl]);
            lastAncestorValues = childControl.getAncestorValues();
        });
        test('should be the same when ancestor values have not changed', function () {
            const newAncestorValues = childControl.getAncestorValues();
            expect_1.default(newAncestorValues).to.eql(lastAncestorValues);
        });
        test('should be different when grand parent value changes', function () {
            grandParentControl.set('new myGrandParentValue');
            const newAncestorValues = childControl.getAncestorValues();
            expect_1.default(newAncestorValues).to.not.eql(lastAncestorValues);
        });
        test('should be different when parent value changes', function () {
            parentControl.set('new myParentValue');
            const newAncestorValues = childControl.getAncestorValues();
            expect_1.default(newAncestorValues).to.not.eql(lastAncestorValues);
        });
    });
    test('should build filters from ancestors', function () {
        grandParentControl.set('myGrandParentValue');
        parentControl.set('myParentValue');
        childControl.setAncestors([parentControl, grandParentControl]);
        const ancestorFilters = childControl.getAncestorFilters();
        expect_1.default(ancestorFilters.length).to.be(2);
        expect_1.default(ancestorFilters[0]).to.eql('mockKbnFilter:myParentValue');
        expect_1.default(ancestorFilters[1]).to.eql('mockKbnFilter:myGrandParentValue');
    });
});
