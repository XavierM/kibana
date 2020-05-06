"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.multiSelectComponent = {
    // This deSerializer takes the previously selected options and map them
    // against the default select options values.
    selectedValueToOptions(selectOptions) {
        return defaultFormValue => {
            // If there are no default form value, it means that no previous value has been selected.
            if (!defaultFormValue) {
                return selectOptions;
            }
            return selectOptions.map(option => ({
                ...option,
                checked: defaultFormValue.includes(option.label) ? 'on' : undefined,
            }));
        };
    },
};
