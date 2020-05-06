"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTROL_TYPES = {
    LIST: 'list',
    RANGE: 'range',
};
exports.setControl = (controls, controlIndex, control) => [
    ...controls.slice(0, controlIndex),
    control,
    ...controls.slice(controlIndex + 1),
];
exports.addControl = (controls, control) => [
    ...controls,
    control,
];
exports.moveControl = (controls, controlIndex, direction) => {
    let newIndex;
    if (direction >= 0) {
        newIndex = controlIndex + 1;
    }
    else {
        newIndex = controlIndex - 1;
    }
    if (newIndex < 0) {
        // Move first item to last
        return [...controls.slice(1), controls[0]];
    }
    else if (newIndex >= controls.length) {
        const lastItemIndex = controls.length - 1;
        // Move last item to first
        return [controls[lastItemIndex], ...controls.slice(0, lastItemIndex)];
    }
    else {
        const swapped = controls.slice();
        const temp = swapped[newIndex];
        swapped[newIndex] = swapped[controlIndex];
        swapped[controlIndex] = temp;
        return swapped;
    }
};
exports.removeControl = (controls, controlIndex) => [
    ...controls.slice(0, controlIndex),
    ...controls.slice(controlIndex + 1),
];
exports.getDefaultOptions = (type) => {
    const defaultOptions = {};
    switch (type) {
        case exports.CONTROL_TYPES.RANGE:
            defaultOptions.decimalPlaces = 0;
            defaultOptions.step = 1;
            break;
        case exports.CONTROL_TYPES.LIST:
            defaultOptions.type = 'terms';
            defaultOptions.multiselect = true;
            defaultOptions.dynamicOptions = true;
            defaultOptions.size = 5;
            defaultOptions.order = 'desc';
            break;
    }
    return defaultOptions;
};
exports.newControl = (type) => ({
    id: new Date().getTime().toString(),
    indexPattern: '',
    fieldName: '',
    parent: '',
    label: '',
    type,
    options: exports.getDefaultOptions(type),
});
exports.getTitle = (controlParams, controlIndex) => {
    let title = `${controlParams.type}: ${controlIndex}`;
    if (controlParams.label) {
        title = `${controlParams.label}`;
    }
    else if (controlParams.fieldName) {
        title = `${controlParams.fieldName}`;
    }
    return title;
};
