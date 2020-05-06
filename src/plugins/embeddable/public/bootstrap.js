"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const lib_1 = require("./lib");
/**
 * This method initializes Embeddable plugin with initial set of
 * triggers and actions.
 */
exports.bootstrap = (uiActions) => {
    uiActions.registerTrigger(lib_1.contextMenuTrigger);
    uiActions.registerTrigger(lib_1.panelBadgeTrigger);
    const actionApplyFilter = lib_1.createFilterAction();
    uiActions.registerAction(actionApplyFilter);
};
