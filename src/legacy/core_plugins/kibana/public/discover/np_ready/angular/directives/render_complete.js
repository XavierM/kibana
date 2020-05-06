"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const public_1 = require("../../../../../../../../plugins/kibana_utils/public");
function createRenderCompleteDirective() {
    return {
        controller($scope, $element) {
            const el = $element[0];
            const renderCompleteHelper = new public_1.RenderCompleteHelper(el);
            $scope.$on('$destroy', renderCompleteHelper.destroy);
        },
    };
}
exports.createRenderCompleteDirective = createRenderCompleteDirective;
